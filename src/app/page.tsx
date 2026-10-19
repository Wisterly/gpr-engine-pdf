'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { pdfjsLib } from '@/lib/pdfWorker';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  OpenTab,
  RecentFile,
  LoadedPDFDocument,
  PDFPageInfo,
} from '@/types/pdf';
import { GlobalHeader } from '@/components/GlobalHeader';
import { HomeScreen } from '@/components/HomeScreen';
import { ToolsCatalogScreen } from '@/components/ToolsCatalogScreen';
import { DocumentTabView } from '@/components/DocumentTabView';
import { SignatureModal } from '@/components/SignatureModal';
import { StampPicker } from '@/components/StampPicker';
import { CombineFilesModal } from '@/components/CombineFilesModal';
import { combinePDFDocuments, CombineFileInput } from '@/lib/pdfCombine';
import { generateExportedPDF } from '@/lib/pdfExport';
import { formatFileSize } from '@/lib/utils';
import {
  persistUserFile,
  getPersistedUserFiles,
  togglePersistedFavorite,
} from '@/lib/storage';

const INITIAL_RECENT_FILES: RecentFile[] = [
  {
    id: 'rec_1',
    name: 'ATA DE MANUTENÇÃO E REFORMA SEDUC.pdf',
    openedAt: 'Hoje, 22:45',
    size: '2.4 MB',
    sizeBytes: 2516582,
    isFavorite: true,
  },
  {
    id: 'rec_2',
    name: 'RELATÓRIO DE MEDIÇÃO GPR 04-2026.pdf',
    openedAt: 'Hoje, 20:10',
    size: '1.8 MB',
    sizeBytes: 1887436,
    isFavorite: true,
  },
  {
    id: 'rec_3',
    name: 'MEMORIAL DESCRITIVO OBRAS ESCOLARES.pdf',
    openedAt: 'Ontem, 16:30',
    size: '4.1 MB',
    sizeBytes: 4300000,
  },
  {
    id: 'rec_4',
    name: 'LAUDO TÉCNICO VISTORIA ENGENHARIA PI.pdf',
    openedAt: '15/10/2026',
    size: '950 KB',
    sizeBytes: 972800,
  },
];

export default function GPREngineMain() {
  // Abas Globais
  const [tabs, setTabs] = useState<OpenTab[]>([
    { id: 'home', title: 'Início', type: 'home' },
    { id: 'tools', title: 'Ferramentas', type: 'tools' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Arquivos Recentes (Inicial + Persistidos)
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(INITIAL_RECENT_FILES);

  // Carrega permanentemente do IndexedDB todos os PDFs reais que o usuário já anexou
  useEffect(() => {
    const loadPersistedDocuments = async () => {
      try {
        const persisted = await getPersistedUserFiles();
        if (persisted && persisted.length > 0) {
          setRecentFiles((prev) => {
            const persistedNames = new Set(persisted.map((f) => f.name));
            const filteredDefaults = prev.filter((f) => !persistedNames.has(f.name));
            return [...persisted, ...filteredDefaults];
          });
        }
      } catch (err) {
        console.warn('Erro ao carregar documentos persistidos:', err);
      }
    };
    loadPersistedDocuments();
  }, []);

  // Documentos Abertos (Chave: docId)
  const [openDocuments, setOpenDocuments] = useState<Record<string, LoadedPDFDocument>>({});

  // Modais de Assinatura, Carimbo e COMBINAR ARQUIVOS
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isStampPickerOpen, setIsStampPickerOpen] = useState(false);
  const [isCombineModalOpen, setIsCombineModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gera documento de demonstração com pdf-lib para os arquivos de exemplo
  const generateInMemoryPDF = async (docTitle: string): Promise<ArrayBuffer> => {
    const doc = await PDFDocument.create();
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

    const page1 = doc.addPage([595, 842]);
    page1.drawText('GPR ENGINE - GOVERNO DO ESTADO DO PIAUÍ / SEDUC', {
      x: 50,
      y: 780,
      size: 15,
      font: fontBold,
      color: rgb(0.83, 0.68, 0.21),
    });

    page1.drawText(docTitle, {
      x: 50,
      y: 755,
      size: 17,
      font: fontBold,
      color: rgb(1, 0.42, 0),
    });

    page1.drawRectangle({
      x: 50,
      y: 570,
      width: 495,
      height: 160,
      borderWidth: 1.5,
      borderColor: rgb(0.83, 0.68, 0.21),
      color: rgb(0.04, 0.04, 0.05),
    });

    page1.drawText('Documento Inicial Carregado no Sistema:', {
      x: 70,
      y: 700,
      size: 13,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    const lines = [
      '• Documento pronto para edição, anotações e combinação;',
      '• Pode ser mesclado com outros relatórios técnicos via "Combinar Arquivos";',
      '• Renderização vetorial HiDPI em Canvas pura via PDF.js;',
      '• Exportação preservando 100% das páginas originais.',
    ];

    lines.forEach((l, i) => {
      page1.drawText(l, {
        x: 70,
        y: 670 - i * 22,
        size: 11,
        font: fontRegular,
        color: rgb(0.88, 0.88, 0.9),
      });
    });

    const page2 = doc.addPage([595, 842]);
    page2.drawText(`FOLHA DE ANEXOS - ${docTitle.slice(0, 30)}`, {
      x: 50,
      y: 780,
      size: 15,
      font: fontBold,
      color: rgb(0.83, 0.68, 0.21),
    });

    const bytes = await doc.save();
    return bytes.buffer as ArrayBuffer;
  };

  // Carrega e ativa um documento a partir de um ArrayBuffer
  const loadDocumentFromBuffer = useCallback(
    async (docId: string, docName: string, buffer: ArrayBuffer, sizeBytes: number) => {
      try {
        // Preserva o buffer original íntegro para operações de mesclagem e exportação
        const preservedBuffer = buffer.slice(0) as ArrayBuffer;

        // Envia cópia isolada em Uint8Array para o PDF.js worker para não neutrar/destruir o buffer original
        const workerData = new Uint8Array(buffer.slice(0));

        const loadingTask = pdfjsLib.getDocument({
          data: workerData,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });

        const loadedPdf = await loadingTask.promise;
        const total = loadedPdf.numPages;
        const initialPages: PDFPageInfo[] = [];

        for (let i = 1; i <= total; i++) {
          const page = await loadedPdf.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          initialPages.push({
            pageIndex: i - 1,
            pageNumber: i,
            width: viewport.width,
            height: viewport.height,
            rotation: 0,
            isDeleted: false,
          });
        }

        const newDoc: LoadedPDFDocument = {
          id: docId,
          name: docName,
          size: sizeBytes,
          fileBuffer: preservedBuffer,
          pdfDoc: loadedPdf,
          pages: initialPages,
          pageAnnotations: {},
          currentPage: 1,
          zoom: 1.12,
        };

        setOpenDocuments((prev) => ({ ...prev, [docId]: newDoc }));

        // Cria a aba se ainda não existir
        setTabs((prev) => {
          if (prev.some((t) => t.id === docId)) return prev;
          return [
            ...prev,
            {
              id: docId,
              title: docName,
              type: 'document',
              docId,
            },
          ];
        });

        setActiveTabId(docId);
      } catch (err) {
        console.error('Erro ao inicializar documento PDF:', err);
        alert('Falha ao processar o documento PDF.');
      }
    },
    []
  );

  // Abertura de arquivo do computador
  const handleUploadFile = useCallback(
    async (file: File) => {
      const docId = `doc_${Date.now()}`;
      const buffer = await file.arrayBuffer();

      // Envia uma cópia para o visualizador e retém outra cópia para a lista/banco
      await loadDocumentFromBuffer(docId, file.name, buffer.slice(0) as ArrayBuffer, file.size);

      const newRecent: RecentFile = {
        id: docId,
        name: file.name,
        openedAt: 'Agora',
        size: formatFileSize(file.size),
        sizeBytes: file.size,
        fileBuffer: buffer.slice(0) as ArrayBuffer,
      };

      // Persiste permanentemente no IndexedDB do navegador
      await persistUserFile(newRecent);

      setRecentFiles((prev) => [
        newRecent,
        ...prev.filter((f) => f.name !== file.name),
      ]);
    },
    [loadDocumentFromBuffer]
  );

  // Abertura de arquivo recente da lista
  const handleOpenRecentFile = useCallback(
    async (file: RecentFile) => {
      let buffer = file.fileBuffer ? (file.fileBuffer.slice(0) as ArrayBuffer) : undefined;
      if (!buffer || buffer.byteLength === 0) {
        // Tenta recuperar do IndexedDB
        const persistedFiles = await getPersistedUserFiles();
        const found = persistedFiles.find((p) => p.id === file.id || p.name === file.name);
        if (found && found.fileBuffer && found.fileBuffer.byteLength > 0) {
          buffer = found.fileBuffer.slice(0) as ArrayBuffer;
        } else {
          buffer = await generateInMemoryPDF(file.name);
        }
      }
      await loadDocumentFromBuffer(file.id, file.name, buffer, file.sizeBytes);
    },
    [loadDocumentFromBuffer]
  );

  // Fechamento de aba
  const handleCloseTab = (tabId: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    setOpenDocuments((prev) => {
      const copy = { ...prev };
      delete copy[tabId];
      return copy;
    });

    if (activeTabId === tabId) {
      setActiveTabId('home');
    }
  };

  // Salvar / Baixar PDF Final
  const handleSaveActiveDocument = async () => {
    const doc = openDocuments[activeTabId];
    if (!doc || !doc.fileBuffer) return;

    try {
      const exportedBytes = await generateExportedPDF({
        originalBuffer: doc.fileBuffer,
        pagesInfo: doc.pages,
        pageAnnotations: doc.pageAnnotations,
      });

      const blob = new Blob([exportedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name.replace(/\.pdf$/i, '_editado_gpr.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Erro gerando exportação:', e);
      alert('Falha ao exportar PDF.');
    }
  };

  // Atualizar estado de documento ativo
  const handleUpdateActiveDocument = (updatedDoc: LoadedPDFDocument) => {
    setOpenDocuments((prev) => ({
      ...prev,
      [updatedDoc.id]: updatedDoc,
    }));
  };

  // Lógica de COMBINAR ARQUIVOS (Merge PDFs em nova aba com máxima tolerância)
  const handleExecuteCombine = async (
    selectedFiles: { id: string; name: string; fileBuffer?: ArrayBuffer }[]
  ) => {
    // 1. Resolve buffers íntegros para todos os arquivos selecionados
    const resolvedFiles: CombineFileInput[] = [];
    const persisted = await getPersistedUserFiles();

    for (const file of selectedFiles) {
      let buf = file.fileBuffer;

      // Se o buffer estiver ausente ou desanexado (byteLength 0), recupera de várias fontes
      if (!buf || buf.byteLength === 0) {
        // Tenta nos documentos abertos
        const inOpen = openDocuments[file.id];
        if (inOpen && inOpen.fileBuffer && inOpen.fileBuffer.byteLength > 0) {
          buf = inOpen.fileBuffer;
        }

        // Tenta nos arquivos recentes
        if (!buf || buf.byteLength === 0) {
          const inRecent = recentFiles.find((r) => r.id === file.id || r.name === file.name);
          if (inRecent && inRecent.fileBuffer && inRecent.fileBuffer.byteLength > 0) {
            buf = inRecent.fileBuffer;
          }
        }

        // Tenta no IndexedDB permanente
        if (!buf || buf.byteLength === 0) {
          const inPersisted = persisted.find((p) => p.id === file.id || p.name === file.name);
          if (inPersisted && inPersisted.fileBuffer && inPersisted.fileBuffer.byteLength > 0) {
            buf = inPersisted.fileBuffer;
          }
        }

        // Caso ainda não tenha, sintetiza os dados do documento para combinação contínua
        if (!buf || buf.byteLength === 0) {
          buf = await generateInMemoryPDF(file.name);
        }
      }

      resolvedFiles.push({
        id: file.id,
        name: file.name,
        fileBuffer: buf.slice(0) as ArrayBuffer,
      });
    }

    // 2. Mescla os PDFs com pdf-lib tolerante a permissões e anomalias
    const mergedBytes = await combinePDFDocuments(resolvedFiles);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
    const combinedDocName = `DOCUMENTO_COMBINADO_GPR_${timeStr}.pdf`;
    const combinedDocId = `combined_${Date.now()}`;

    // 3. Fatiamento exato do buffer limpo
    const arrayBuffer = mergedBytes.buffer.slice(
      mergedBytes.byteOffset,
      mergedBytes.byteOffset + mergedBytes.byteLength
    ) as ArrayBuffer;

    // 4. Carrega como novo documento ativo em uma nova aba
    await loadDocumentFromBuffer(combinedDocId, combinedDocName, arrayBuffer.slice(0) as ArrayBuffer, arrayBuffer.byteLength);

    // 5. Registra na lista de recentes e persiste no IndexedDB
    const newCombinedRecent: RecentFile = {
      id: combinedDocId,
      name: combinedDocName,
      openedAt: 'Agora (Combinado)',
      size: formatFileSize(arrayBuffer.byteLength),
      sizeBytes: arrayBuffer.byteLength,
      fileBuffer: arrayBuffer.slice(0) as ArrayBuffer,
      isFavorite: true,
    };
    await persistUserFile(newCombinedRecent);

    setRecentFiles((prev) => [
      newCombinedRecent,
      ...prev.filter((f) => f.name !== combinedDocName),
    ]);
  };

  // Carrega arquivo extra do disco na tela de combinação
  const handleAddLocalFileForCombine = async (file: File) => {
    const buffer = await file.arrayBuffer();
    return {
      id: `add_${Date.now()}`,
      name: file.name,
      size: formatFileSize(file.size),
      fileBuffer: buffer,
    };
  };

  // Atalhos de Ferramentas Rápidas e Botões
  const handleToolSelection = async (toolId: string) => {
    if (toolId === 'create') {
      fileInputRef.current?.click();
    } else if (toolId === 'combine') {
      // Abre o Modal de Seleção para Combinar Arquivos!
      setIsCombineModalOpen(true);
    } else if (toolId === 'fill_sign') {
      setIsSignatureModalOpen(true);
    } else if (toolId === 'stamp') {
      setIsStampPickerOpen(true);
    } else {
      if (!openDocuments[activeTabId]) {
        await handleOpenRecentFile(recentFiles[0]);
      }
    }
  };

  // Alternar favorito com persistência no IndexedDB
  const handleToggleFavorite = async (fileId: string) => {
    let nextFavState = false;
    setRecentFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          nextFavState = !f.isFavorite;
          return { ...f, isFavorite: nextFavState };
        }
        return f;
      })
    );
    await togglePersistedFavorite(fileId, nextFavState);
  };

  // Prepara lista de arquivos disponíveis para o modal de combinação
  // Combina documentos atualmente abertos + recentes para fácil seleção
  const filesAvailableForCombine = [
    ...Object.values(openDocuments).map((doc) => ({
      id: doc.id,
      name: doc.name,
      size: formatFileSize(doc.size),
      fileBuffer: doc.fileBuffer,
    })),
    ...recentFiles
      .filter((rec) => !Object.keys(openDocuments).includes(rec.id))
      .map((rec) => ({
        id: rec.id,
        name: rec.name,
        size: rec.size,
        fileBuffer: rec.fileBuffer,
      })),
  ];

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const currentOpenDoc = openDocuments[activeTabId];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian-bg text-brand-text">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUploadFile(f);
        }}
        className="hidden"
      />

      {/* Barra Superior Global */}
      <GlobalHeader
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewDocumentClick={() => fileInputRef.current?.click()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Modal de COMBINAR ARQUIVOS (Novo recurso funcional PR.006) */}
      {isCombineModalOpen && (
        <CombineFilesModal
          isOpen={isCombineModalOpen}
          onClose={() => setIsCombineModalOpen(false)}
          initialFiles={filesAvailableForCombine}
          onExecuteCombine={handleExecuteCombine}
          onAddLocalFile={handleAddLocalFileForCombine}
        />
      )}

      {/* Modais Flutuantes de Assinatura e Carimbo */}
      {isSignatureModalOpen && (
        <SignatureModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          onSaveSignature={(dataUrl) => {
            alert('Assinatura salva com sucesso!');
            setIsSignatureModalOpen(false);
          }}
        />
      )}

      {isStampPickerOpen && (
        <StampPicker
          onSelectStamp={(type, color) => {
            alert(`Carimbo ${type} selecionado!`);
            setIsStampPickerOpen(false);
          }}
          onClose={() => setIsStampPickerOpen(false)}
        />
      )}

      {/* 3 Telas Baseadas na Aba Ativa */}
      {activeTabId === 'home' && (
        <HomeScreen
          recentFiles={recentFiles}
          onOpenFile={handleOpenRecentFile}
          onUploadFile={handleUploadFile}
          onGoToToolsTab={() => setActiveTabId('tools')}
          onQuickAction={handleToolSelection}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {activeTabId === 'tools' && (
        <ToolsCatalogScreen onSelectTool={handleToolSelection} />
      )}

      {activeTab?.type === 'document' && currentOpenDoc && (
        <DocumentTabView
          document={currentOpenDoc}
          onUpdateDocument={handleUpdateActiveDocument}
          onSavePDF={handleSaveActiveDocument}
          onOpenFillSign={() => setIsSignatureModalOpen(true)}
          onSelectTool={handleToolSelection}
          onGoToToolsTab={() => setActiveTabId('tools')}
        />
      )}
    </div>
  );
}

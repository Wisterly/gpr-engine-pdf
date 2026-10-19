'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { pdfjsLib } from '@/lib/pdfWorker';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  OpenTab,
  RecentFile,
  LoadedPDFDocument,
  PDFPageInfo,
  PageAnnotations,
} from '@/types/pdf';
import { GlobalHeader } from '@/components/GlobalHeader';
import { HomeScreen } from '@/components/HomeScreen';
import { ToolsCatalogScreen } from '@/components/ToolsCatalogScreen';
import { DocumentTabView } from '@/components/DocumentTabView';
import { SignatureModal } from '@/components/SignatureModal';
import { StampPicker } from '@/components/StampPicker';
import { generateExportedPDF } from '@/lib/pdfExport';
import { formatFileSize } from '@/lib/utils';

// Arquivos Recentes Pré-populados do Sistema GPR
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

  // Arquivos Recentes
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(INITIAL_RECENT_FILES);

  // Documentos Abertos (Chave: docId)
  const [openDocuments, setOpenDocuments] = useState<Record<string, LoadedPDFDocument>>({});

  // Modais de Assinatura e Carimbo
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isStampPickerOpen, setIsStampPickerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função auxiliar para criar PDF em memória com pdf-lib quando abrir arquivo recente
  const generateInMemoryPDF = async (docTitle: string): Promise<ArrayBuffer> => {
    const doc = await PDFDocument.create();
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

    // Página 1
    const page1 = doc.addPage([595, 842]);
    page1.drawText('GPR ENGINE - GOVERNO DO ESTADO DO PIAUÍ / SEDUC', {
      x: 50,
      y: 780,
      size: 15,
      font: fontBold,
      color: rgb(0.83, 0.68, 0.21), // Ouro Metálico
    });

    page1.drawText(docTitle, {
      x: 50,
      y: 755,
      size: 18,
      font: fontBold,
      color: rgb(1, 0.42, 0), // Laranja Vibrante
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

    page1.drawText('Documento Oficial Carregado na Suíte GPR Engine:', {
      x: 70,
      y: 700,
      size: 13,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    const lines = [
      '• Visualização com renderização vetorial de alta resolução Canvas;',
      '• Ferramentas completas estilo Adobe Acrobat Pro (Comentários, Formas, Assinatura);',
      '• Caixa lateral retrátil à direita com acesso direto às 12 ferramentas de engenharia;',
      '• Gaveta lateral à esquerda para visualização de miniaturas de páginas e reordenação;',
      '• Exportação preservando 100% das camadas originais e novos carimbos.',
    ];

    lines.forEach((l, i) => {
      page1.drawText(l, {
        x: 70,
        y: 670 - i * 20,
        size: 10,
        font: fontRegular,
        color: rgb(0.88, 0.88, 0.9),
      });
    });

    // Página 2 (Para testar paginação)
    const page2 = doc.addPage([595, 842]);
    page2.drawText('ANEXO TÉCNICO - FOLHA DE MEDIÇÕES E VISTORIAS', {
      x: 50,
      y: 780,
      size: 16,
      font: fontBold,
      color: rgb(0.83, 0.68, 0.21),
    });

    page2.drawText('Página 2 de 2 - Registros e assinaturas técnicas de campo.', {
      x: 50,
      y: 755,
      size: 12,
      font: fontRegular,
      color: rgb(0.7, 0.7, 0.7),
    });

    const bytes = await doc.save();
    return bytes.buffer as ArrayBuffer;
  };

  // Carrega e ativa um documento a partir de um ArrayBuffer
  const loadDocumentFromBuffer = useCallback(
    async (docId: string, docName: string, buffer: ArrayBuffer, sizeBytes: number) => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: buffer,
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
          fileBuffer: buffer,
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
      await loadDocumentFromBuffer(docId, file.name, buffer, file.size);

      // Adiciona aos recentes
      setRecentFiles((prev) => [
        {
          id: docId,
          name: file.name,
          openedAt: 'Agora',
          size: formatFileSize(file.size),
          sizeBytes: file.size,
          fileBuffer: buffer,
        },
        ...prev.filter((f) => f.name !== file.name),
      ]);
    },
    [loadDocumentFromBuffer]
  );

  // Abertura de arquivo recente da lista
  const handleOpenRecentFile = useCallback(
    async (file: RecentFile) => {
      let buffer = file.fileBuffer;
      if (!buffer) {
        buffer = await generateInMemoryPDF(file.name);
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

  // Atalhos de Ferramentas Rápidas
  const handleToolSelection = (toolId: string) => {
    if (toolId === 'create') {
      fileInputRef.current?.click();
    } else if (toolId === 'fill_sign') {
      setIsSignatureModalOpen(true);
    } else if (toolId === 'stamp') {
      setIsStampPickerOpen(true);
    } else {
      // Se não houver documento aberto, abre o primeiro dos recentes para permitir testar a ferramenta imediatamente
      if (!openDocuments[activeTabId]) {
        handleOpenRecentFile(recentFiles[0]);
      }
    }
  };

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

      {/* 2. Barra Superior Global: Faixa 1 (Menus) + Faixa 2 (Abas + Busca) */}
      <GlobalHeader
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewDocumentClick={() => fileInputRef.current?.click()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Modais Flutuantes */}
      {isSignatureModalOpen && (
        <SignatureModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          onSaveSignature={(dataUrl) => {
            alert('Assinatura salva! Clique em qualquer ponto da página do documento para carimbar.');
            setIsSignatureModalOpen(false);
          }}
        />
      )}

      {isStampPickerOpen && (
        <StampPicker
          onSelectStamp={(type, color) => {
            alert(`Carimbo ${type} selecionado! Clique na página para aplicar.`);
            setIsStampPickerOpen(false);
          }}
          onClose={() => setIsStampPickerOpen(false)}
        />
      )}

      {/* 3 Telas Principais Baseadas na Aba Ativa */}
      {activeTabId === 'home' && (
        <HomeScreen
          recentFiles={recentFiles}
          onOpenFile={handleOpenRecentFile}
          onUploadFile={handleUploadFile}
          onGoToToolsTab={() => setActiveTabId('tools')}
          onQuickAction={handleToolSelection}
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

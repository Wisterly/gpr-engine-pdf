'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { pdfjsLib } from '@/lib/pdfWorker';
import {
  AcrobatMode,
  ToolMode,
  PDFPageInfo,
  PageAnnotations,
} from '@/types/pdf';
import { AcrobatHeader } from '@/components/AcrobatHeader';
import { AcrobatContextBar } from '@/components/AcrobatContextBar';
import { AcrobatLeftDock } from '@/components/AcrobatLeftDock';
import { AcrobatBottomHUD } from '@/components/AcrobatBottomHUD';
import { PDFCanvas } from '@/components/PDFCanvas';
import { EmptyState } from '@/components/EmptyState';
import { StampPicker } from '@/components/StampPicker';
import { SignatureModal } from '@/components/SignatureModal';
import { generateExportedPDF } from '@/lib/pdfExport';
import { formatFileSize } from '@/lib/utils';

export default function AcrobatProPDFSuite() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Estados de Navegação e Zoom
  const [pages, setPages] = useState<PDFPageInfo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.1);

  // Modos do Adobe Acrobat Pro
  const [activeMode, setActiveMode] = useState<AcrobatMode>('comment');
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [selectedColor, setSelectedColor] = useState<string>('#f59e0b');
  const [strokeSize, setStrokeSize] = useState<number>(4);

  // Dock Lateral Estilo Acrobat
  const [isLeftDockOpen, setIsLeftDockOpen] = useState<boolean>(true);
  const [leftDockTab, setLeftDockTab] = useState<'thumbnails' | 'comments' | 'search'>('thumbnails');

  // Modais de Carimbos e Assinatura
  const [showStampPicker, setShowStampPicker] = useState<boolean>(false);
  const [activeStampType, setActiveStampType] = useState<
    'APROVADO' | 'CONFERIDO' | 'URGENTE' | 'MEDIDO GPR' | 'EM ANÁLISE' | null
  >('APROVADO');
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  const [savedSignatureDataUrl, setSavedSignatureDataUrl] = useState<string | null>(null);

  // Anotações e Histórico (Undo/Redo)
  const [pageAnnotations, setPageAnnotations] = useState<Record<number, PageAnnotations>>({});
  const [history, setHistory] = useState<Record<number, PageAnnotations>[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Carrega e inicializa o arquivo PDF
  const handleLoadFile = useCallback(async (file: File) => {
    try {
      setFileName(file.name);
      setFileSize(file.size);

      const buffer = await file.arrayBuffer();
      setFileBuffer(buffer);

      const loadingTask = pdfjsLib.getDocument({
        data: buffer,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });

      const loadedPdf = await loadingTask.promise;
      setPdfDoc(loadedPdf);

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

      setPages(initialPages);
      setCurrentPage(1);
      setZoom(1.1);
      setPageAnnotations({});
      setHistory([]);
      setActiveMode('comment');
      setActiveTool('select');
    } catch (err) {
      console.error('Erro ao abrir documento PDF:', err);
      alert('Falha ao abrir o arquivo PDF.');
    }
  }, []);

  // Navegação
  const handlePrevPage = () => {
    const active = pages.filter((p) => !p.isDeleted);
    const currentIndex = active.findIndex((p) => p.pageNumber === currentPage);
    if (currentIndex > 0) {
      setCurrentPage(active[currentIndex - 1].pageNumber);
    }
  };

  const handleNextPage = () => {
    const active = pages.filter((p) => !p.isDeleted);
    const currentIndex = active.findIndex((p) => p.pageNumber === currentPage);
    if (currentIndex < active.length - 1) {
      setCurrentPage(active[currentIndex + 1].pageNumber);
    }
  };

  // Zoom
  const handleZoomIn = () => setZoom((prev) => Math.min(3.0, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.4, +(prev - 0.15).toFixed(2)));
  const handleZoomFit = () => setZoom(1.0);

  // Rotações
  const handleRotateCurrentPage = (dir: 'cw' | 'ccw') => {
    const angleDelta = dir === 'cw' ? 90 : 270;
    setPages((prev) =>
      prev.map((p) =>
        p.pageNumber === currentPage ? { ...p, rotation: (p.rotation + angleDelta) % 360 } : p
      )
    );
  };

  const handleRotateSpecificPage = (pageIndex: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageIndex === pageIndex ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  // Exclusão de Páginas
  const handleDeleteCurrentPage = () => {
    const active = pages.filter((p) => !p.isDeleted);
    if (active.length <= 1) {
      alert('O documento precisa ter pelo menos 1 página.');
      return;
    }

    if (confirm(`Deseja remover a página ${currentPage} do documento?`)) {
      setPages((prev) =>
        prev.map((p) => (p.pageNumber === currentPage ? { ...p, isDeleted: true } : p))
      );
      const remaining = active.filter((p) => p.pageNumber !== currentPage);
      if (remaining.length > 0) {
        setCurrentPage(remaining[0].pageNumber);
      }
    }
  };

  const handleDeleteSpecificPage = (pageIndex: number) => {
    const active = pages.filter((p) => !p.isDeleted);
    if (active.length <= 1) return;

    setPages((prev) =>
      prev.map((p) => (p.pageIndex === pageIndex ? { ...p, isDeleted: true } : p))
    );
    const remaining = active.filter((p) => p.pageIndex !== pageIndex);
    if (remaining.length > 0) {
      setCurrentPage(remaining[0].pageNumber);
    }
  };

  // Reordenação de Páginas
  const handleMovePage = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    const active = pages.filter((p) => !p.isDeleted);
    if (toIndex < 0 || toIndex >= active.length) return;

    const newPages = [...pages];
    const item1 = active[fromIndex];
    const item2 = active[toIndex];

    const idx1 = newPages.findIndex((p) => p.pageIndex === item1.pageIndex);
    const idx2 = newPages.findIndex((p) => p.pageIndex === item2.pageIndex);

    const temp = newPages[idx1];
    newPages[idx1] = newPages[idx2];
    newPages[idx2] = temp;

    setPages(newPages);
  };

  // Atualização de Anotações com Histórico para Undo
  const handleUpdateAnnotations = (newAnnotations: PageAnnotations) => {
    setHistory((prev) => [...prev.slice(-15), pageAnnotations]);
    setPageAnnotations((prev) => ({
      ...prev,
      [currentPage]: newAnnotations,
    }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setPageAnnotations(previous);
  };

  const handleClearPageAnnotations = () => {
    if (confirm('Deseja limpar as anotações desta página?')) {
      handleUpdateAnnotations({
        pageNumber: currentPage,
        drawings: [],
        texts: [],
        stickyNotes: [],
        shapes: [],
        stamps: [],
        signatures: [],
        formMarks: [],
      });
    }
  };

  const handleDeleteComment = (pageNumber: number, commentId: string, type: 'text' | 'sticky' | 'signature') => {
    const current = pageAnnotations[pageNumber];
    if (!current) return;

    const updated: PageAnnotations = {
      ...current,
      texts: type === 'text' ? (current.texts || []).filter((t) => t.id !== commentId) : current.texts,
      stickyNotes:
        type === 'sticky' ? (current.stickyNotes || []).filter((s) => s.id !== commentId) : current.stickyNotes,
      signatures:
        type === 'signature'
          ? (current.signatures || []).filter((sig) => sig.id !== commentId)
          : current.signatures,
    };

    setPageAnnotations((prev) => ({
      ...prev,
      [pageNumber]: updated,
    }));
  };

  // Troca de Modo e Ferramenta
  const handleChangeMode = (mode: AcrobatMode) => {
    setActiveMode(mode);
    if (mode === 'organize') {
      setIsLeftDockOpen(true);
      setLeftDockTab('thumbnails');
    } else if (mode === 'comment') {
      setActiveTool('select');
    } else if (mode === 'fill_sign') {
      setActiveTool('signature');
    }
  };

  // Exportação e Download
  const handleExportPDF = async () => {
    if (!fileBuffer) return;

    try {
      setIsExporting(true);

      const exportedBytes = await generateExportedPDF({
        originalBuffer: fileBuffer,
        pagesInfo: pages,
        pageAnnotations,
      });

      const blob = new Blob([exportedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName
        ? fileName.replace(/\.pdf$/i, '_acrobat_pro.pdf')
        : 'documento_gpr_acrobat_pro.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      alert('Erro ao gerar exportação do PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  // Atalhos de Teclado estilo Acrobat Pro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select');
      } else if (e.key === 'h' || e.key === 'H') {
        setActiveTool('pan');
      } else if (e.key === 'u' || e.key === 'U') {
        setActiveMode('comment');
        setActiveTool('highlight');
      } else if (e.key === 't' || e.key === 'T') {
        setActiveTool('text');
      } else if (e.key === 's' || e.key === 'S') {
        setActiveMode('comment');
        setActiveTool('sticky_note');
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'Escape') {
        setShowStampPicker(false);
        setShowSignatureModal(false);
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages, history, pageAnnotations]);

  const activePages = pages.filter((p) => !p.isDeleted);
  const currentPageInfo = activePages.find((p) => p.pageNumber === currentPage);
  const currentAnnotations = pageAnnotations[currentPage] || {
    pageNumber: currentPage,
    drawings: [],
    texts: [],
    stickyNotes: [],
    shapes: [],
    stamps: [],
    signatures: [],
    formMarks: [],
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-dark">
      {/* 1. Barra de Menu & Modos do Adobe Acrobat Pro */}
      <AcrobatHeader
        fileName={fileName}
        currentPage={activePages.findIndex((p) => p.pageNumber === currentPage) + 1}
        totalPages={activePages.length}
        activeMode={activeMode}
        isExporting={isExporting}
        canUndo={history.length > 0}
        onChangeMode={handleChangeMode}
        onUploadFile={handleLoadFile}
        onExportPDF={handleExportPDF}
        onUndo={handleUndo}
      />

      {/* 2. Barra de Ferramentas Contextuais do Modo Ativo */}
      {fileName && (
        <AcrobatContextBar
          activeMode={activeMode}
          activeTool={activeTool}
          selectedColor={selectedColor}
          strokeSize={strokeSize}
          zoom={zoom}
          currentPage={activePages.findIndex((p) => p.pageNumber === currentPage) + 1}
          totalPages={activePages.length}
          onChangeTool={setActiveTool}
          onChangeColor={setSelectedColor}
          onChangeStrokeSize={setStrokeSize}
          onOpenSignatureModal={() => setShowSignatureModal(true)}
          onOpenStampPicker={() => setShowStampPicker(true)}
          onRotateCurrentPage={handleRotateCurrentPage}
          onDeleteCurrentPage={handleDeleteCurrentPage}
          onClearPageAnnotations={handleClearPageAnnotations}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomFit={handleZoomFit}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}

      {/* 3. Modais de Carimbo e Assinatura */}
      {showStampPicker && (
        <StampPicker
          onSelectStamp={(type, color) => {
            setActiveStampType(type);
            setSelectedColor(color);
            setActiveTool('stamp');
            setShowStampPicker(false);
          }}
          onClose={() => setShowStampPicker(false)}
        />
      )}

      {showSignatureModal && (
        <SignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          onSaveSignature={(dataUrl) => {
            setSavedSignatureDataUrl(dataUrl);
            setActiveTool('signature');
          }}
        />
      )}

      {/* 4. Corpo Central: Dock Lateral do Acrobat + Viewport + HUD Flutuante */}
      <div className="flex-1 flex overflow-hidden relative">
        {fileName ? (
          <>
            <AcrobatLeftDock
              isOpen={isLeftDockOpen}
              activeTab={leftDockTab}
              pages={pages}
              currentPage={currentPage}
              pdfDoc={pdfDoc}
              pageAnnotations={pageAnnotations}
              onToggleOpen={() => setIsLeftDockOpen((prev) => !prev)}
              onChangeTab={setLeftDockTab}
              onSelectPage={setCurrentPage}
              onRotatePage={handleRotateSpecificPage}
              onDeletePage={handleDeleteSpecificPage}
              onMovePage={handleMovePage}
              onDeleteComment={handleDeleteComment}
            />

            {/* Viewport Central de Edição com Fundo Ônix Nobre */}
            <main className="flex-1 overflow-auto p-8 flex items-center justify-center bg-brand-dark/95 relative">
              {currentPageInfo && (
                <PDFCanvas
                  pdfDoc={pdfDoc}
                  pageInfo={currentPageInfo}
                  zoom={zoom}
                  activeTool={activeTool}
                  selectedColor={selectedColor}
                  strokeSize={strokeSize}
                  annotations={currentAnnotations}
                  activeStampType={activeStampType}
                  activeSignatureDataUrl={savedSignatureDataUrl}
                  onUpdateAnnotations={handleUpdateAnnotations}
                />
              )}

              {/* HUD Flutuante de Navegação e Zoom estilo Acrobat Pro */}
              <AcrobatBottomHUD
                currentPage={activePages.findIndex((p) => p.pageNumber === currentPage) + 1}
                totalPages={activePages.length}
                zoom={zoom}
                activeTool={activeTool}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onSelectTool={setActiveTool}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomFit={handleZoomFit}
              />
            </main>
          </>
        ) : (
          <EmptyState onLoadFile={handleLoadFile} />
        )}
      </div>
    </div>
  );
}

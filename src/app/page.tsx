'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { pdfjsLib } from '@/lib/pdfWorker';
import { PDFPageInfo, PageAnnotations, ToolMode } from '@/types/pdf';
import { Toolbar } from '@/components/Toolbar';
import { ThumbnailSidebar } from '@/components/ThumbnailSidebar';
import { PDFCanvas } from '@/components/PDFCanvas';
import { EmptyState } from '@/components/EmptyState';
import { StampPicker } from '@/components/StampPicker';
import { generateExportedPDF } from '@/lib/pdfExport';
import { formatFileSize } from '@/lib/utils';

export default function PDFSuitePage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const [pages, setPages] = useState<PDFPageInfo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [selectedColor, setSelectedColor] = useState<string>('#f59e0b');
  const [showStampPicker, setShowStampPicker] = useState<boolean>(false);
  const [activeStampType, setActiveStampType] = useState<
    'APROVADO' | 'CONFERIDO' | 'URGENTE' | 'MEDIDO GPR' | 'EM ANÁLISE' | null
  >('APROVADO');

  const [pageAnnotations, setPageAnnotations] = useState<Record<number, PageAnnotations>>({});
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
    } catch (err) {
      console.error('Erro ao abrir documento PDF:', err);
      alert('Falha ao abrir o arquivo PDF. Verifique se o arquivo não está corrompido ou protegido.');
    }
  }, []);

  // Navegação entre páginas
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

  // Rotação da página atual
  const handleRotateCurrentPage = () => {
    setPages((prev) =>
      prev.map((p) =>
        p.pageNumber === currentPage ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  // Rotação de página específica via miniatura
  const handleRotateSpecificPage = (pageIndex: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageIndex === pageIndex ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  // Exclusão de página
  const handleDeleteCurrentPage = () => {
    const active = pages.filter((p) => !p.isDeleted);
    if (active.length <= 1) {
      alert('O documento precisa ter pelo menos 1 página.');
      return;
    }

    if (confirm(`Deseja realmente remover a página ${currentPage} deste documento?`)) {
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

    const target = pages.find((p) => p.pageIndex === pageIndex);
    if (!target) return;

    setPages((prev) =>
      prev.map((p) => (p.pageIndex === pageIndex ? { ...p, isDeleted: true } : p))
    );

    if (currentPage === target.pageNumber) {
      const remaining = active.filter((p) => p.pageIndex !== pageIndex);
      if (remaining.length > 0) {
        setCurrentPage(remaining[0].pageNumber);
      }
    }
  };

  // Reordenação de páginas
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

  // Limpar anotações da página atual
  const handleClearPageAnnotations = () => {
    if (confirm('Deseja limpar todos os textos, marcações e carimbos desta página?')) {
      setPageAnnotations((prev) => ({
        ...prev,
        [currentPage]: {
          pageNumber: currentPage,
          drawings: [],
          texts: [],
          stamps: [],
        },
      }));
    }
  };

  // Atualizar anotações
  const handleUpdateAnnotations = (newAnnotations: PageAnnotations) => {
    setPageAnnotations((prev) => ({
      ...prev,
      [currentPage]: newAnnotations,
    }));
  };

  // Troca de ferramenta
  const handleChangeTool = (tool: ToolMode) => {
    setActiveTool(tool);
    if (tool === 'stamp') {
      setShowStampPicker(true);
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
        ? fileName.replace(/\.pdf$/i, '_editado.pdf')
        : 'documento_gpr_editado.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro gerando exportação de PDF:', err);
      alert('Houve um erro ao processar o arquivo final.');
    } finally {
      setIsExporting(false);
    }
  };

  // Atalhos de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em um input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'Escape') {
        setShowStampPicker(false);
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages]);

  const activePages = pages.filter((p) => !p.isDeleted);
  const currentPageInfo = activePages.find((p) => p.pageNumber === currentPage);
  const currentAnnotations = pageAnnotations[currentPage] || {
    pageNumber: currentPage,
    drawings: [],
    texts: [],
    stamps: [],
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-dark">
      {/* Barra de Ferramentas Superior */}
      <Toolbar
        fileName={fileName}
        fileSizeText={formatFileSize(fileSize)}
        currentPage={activePages.findIndex((p) => p.pageNumber === currentPage) + 1}
        totalPages={activePages.length}
        zoom={zoom}
        activeTool={activeTool}
        selectedColor={selectedColor}
        sidebarOpen={sidebarOpen}
        isExporting={isExporting}
        onUploadFile={handleLoadFile}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onChangeTool={handleChangeTool}
        onChangeColor={setSelectedColor}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomFit={handleZoomFit}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onRotateCurrentPage={handleRotateCurrentPage}
        onDeleteCurrentPage={handleDeleteCurrentPage}
        onClearPageAnnotations={handleClearPageAnnotations}
        onExportPDF={handleExportPDF}
      />

      {/* Modal / Popover Seletor de Carimbos */}
      {showStampPicker && (
        <StampPicker
          onSelectStamp={(type, color) => {
            setActiveStampType(type);
            setSelectedColor(color);
            setShowStampPicker(false);
          }}
          onClose={() => setShowStampPicker(false)}
        />
      )}

      {/* Corpo Central: Miniaturas Retráteis + Visualizador da Página */}
      <div className="flex-1 flex overflow-hidden relative">
        {fileName ? (
          <>
            <ThumbnailSidebar
              isOpen={sidebarOpen}
              pages={pages}
              currentPage={currentPage}
              pdfDoc={pdfDoc}
              onSelectPage={setCurrentPage}
              onRotatePage={handleRotateSpecificPage}
              onDeletePage={handleDeleteSpecificPage}
              onMovePage={handleMovePage}
            />

            {/* Viewport Central da Página */}
            <main className="flex-1 overflow-auto p-8 flex items-center justify-center bg-brand-dark/95">
              {currentPageInfo && (
                <PDFCanvas
                  pdfDoc={pdfDoc}
                  pageInfo={currentPageInfo}
                  zoom={zoom}
                  activeTool={activeTool}
                  selectedColor={selectedColor}
                  annotations={currentAnnotations}
                  activeStampType={activeStampType}
                  onUpdateAnnotations={handleUpdateAnnotations}
                />
              )}
            </main>
          </>
        ) : (
          <EmptyState onLoadFile={handleLoadFile} />
        )}
      </div>
    </div>
  );
}

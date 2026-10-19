'use client';

import React, { useState } from 'react';
import {
  ToolMode,
  PDFPageInfo,
  PageAnnotations,
  LoadedPDFDocument,
} from '@/types/pdf';
import { DocumentContextToolbar } from './DocumentContextToolbar';
import { LeftHiddenDrawer } from './LeftHiddenDrawer';
import { RightRetractableToolbox } from './RightRetractableToolbox';
import { PDFCanvas } from './PDFCanvas';
import { AcrobatBottomHUD } from './AcrobatBottomHUD';

interface DocumentTabViewProps {
  document: LoadedPDFDocument;
  onUpdateDocument: (doc: LoadedPDFDocument) => void;
  onSavePDF: () => void;
  onOpenFillSign: () => void;
  onSelectTool: (toolId: string) => void;
  onGoToToolsTab: () => void;
}

export const DocumentTabView: React.FC<DocumentTabViewProps> = ({
  document,
  onUpdateDocument,
  onSavePDF,
  onOpenFillSign,
  onSelectTool,
  onGoToToolsTab,
}) => {
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLeftDrawerExpanded, setIsLeftDrawerExpanded] = useState(false);
  const [isRightToolboxExpanded, setIsRightToolboxExpanded] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#D4AF37');
  const [strokeSize, setStrokeSize] = useState(4);

  const activePages = document.pages.filter((p) => !p.isDeleted);
  const currentPageInfo = activePages.find((p) => p.pageNumber === document.currentPage) || activePages[0];

  const currentAnnotations = document.pageAnnotations[document.currentPage] || {
    pageNumber: document.currentPage,
    drawings: [],
    texts: [],
    stickyNotes: [],
    shapes: [],
    stamps: [],
    signatures: [],
    formMarks: [],
  };

  // Funções de navegação
  const handlePrevPage = () => {
    const currentIndex = activePages.findIndex((p) => p.pageNumber === document.currentPage);
    if (currentIndex > 0) {
      onUpdateDocument({
        ...document,
        currentPage: activePages[currentIndex - 1].pageNumber,
      });
    }
  };

  const handleNextPage = () => {
    const currentIndex = activePages.findIndex((p) => p.pageNumber === document.currentPage);
    if (currentIndex < activePages.length - 1) {
      onUpdateDocument({
        ...document,
        currentPage: activePages[currentIndex + 1].pageNumber,
      });
    }
  };

  // Funções de Zoom
  const handleZoomIn = () => {
    onUpdateDocument({
      ...document,
      zoom: Math.min(3.0, +(document.zoom + 0.15).toFixed(2)),
    });
  };

  const handleZoomOut = () => {
    onUpdateDocument({
      ...document,
      zoom: Math.max(0.4, +(document.zoom - 0.15).toFixed(2)),
    });
  };

  const handleZoomFit = () => {
    onUpdateDocument({
      ...document,
      zoom: 1.0,
    });
  };

  // Rotações
  const handleRotatePage = (pageIndex: number) => {
    const updatedPages = document.pages.map((p) =>
      p.pageIndex === pageIndex ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    );
    onUpdateDocument({ ...document, pages: updatedPages });
  };

  // Exclusão
  const handleDeletePage = (pageIndex: number) => {
    if (activePages.length <= 1) {
      alert('O documento precisa ter pelo menos 1 página ativa.');
      return;
    }
    const updatedPages = document.pages.map((p) =>
      p.pageIndex === pageIndex ? { ...p, isDeleted: true } : p
    );
    const remaining = updatedPages.filter((p) => !p.isDeleted);
    onUpdateDocument({
      ...document,
      pages: updatedPages,
      currentPage: remaining[0]?.pageNumber || 1,
    });
  };

  // Reordenação
  const handleMovePage = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= activePages.length) return;

    const newPages = [...document.pages];
    const item1 = activePages[fromIndex];
    const item2 = activePages[toIndex];

    const idx1 = newPages.findIndex((p) => p.pageIndex === item1.pageIndex);
    const idx2 = newPages.findIndex((p) => p.pageIndex === item2.pageIndex);

    const temp = newPages[idx1];
    newPages[idx1] = newPages[idx2];
    newPages[idx2] = temp;

    onUpdateDocument({ ...document, pages: newPages });
  };

  // Atualização de anotações
  const handleUpdateAnnotations = (newAnnotations: PageAnnotations) => {
    onUpdateDocument({
      ...document,
      pageAnnotations: {
        ...document.pageAnnotations,
        [document.currentPage]: newAnnotations,
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-obsidian-bg select-none">
      {/* 4.1 Barra de Ferramentas Contextual do Topo do Documento */}
      <DocumentContextToolbar
        currentPage={activePages.findIndex((p) => p.pageNumber === document.currentPage) + 1}
        totalPages={activePages.length}
        zoom={document.zoom}
        activeTool={activeTool}
        isFavorite={isFavorite}
        onSavePDF={onSavePDF}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
        onPrint={() => window.print()}
        onEmailShare={() => alert('Compartilhamento direto por e-mail configurado para envio seguro.')}
        onSearchInDoc={() => alert('Pressione Ctrl+F para pesquisar palavras no documento.')}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onSelectTool={setActiveTool}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomFit={handleZoomFit}
        onOpenFillSign={onOpenFillSign}
        onShare={onSavePDF}
      />

      {/* 4.2 Área Central: Gaveta Esquerda + Viewport + Caixa Direita Retrátil */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Gaveta Esquerda Oculta (Miniaturas) */}
        <LeftHiddenDrawer
          isExpanded={isLeftDrawerExpanded}
          onToggleExpand={() => setIsLeftDrawerExpanded(!isLeftDrawerExpanded)}
          pages={document.pages}
          currentPage={document.currentPage}
          pdfDoc={document.pdfDoc}
          onSelectPage={(pageNum) => onUpdateDocument({ ...document, currentPage: pageNum })}
          onRotatePage={handleRotatePage}
          onDeletePage={handleDeletePage}
          onMovePage={handleMovePage}
        />

        {/* Canvas Central de Visualização */}
        <main className="flex-1 overflow-auto p-8 flex items-center justify-center bg-obsidian-bg relative">
          {currentPageInfo && (
            <PDFCanvas
              pdfDoc={document.pdfDoc}
              pageInfo={currentPageInfo}
              zoom={document.zoom}
              activeTool={activeTool}
              selectedColor={selectedColor}
              strokeSize={strokeSize}
              annotations={currentAnnotations}
              activeStampType={'APROVADO'}
              activeSignatureDataUrl={null}
              onUpdateAnnotations={handleUpdateAnnotations}
            />
          )}

          {/* Barra Flutuante de Controle na Base (Acrobat HUD) */}
          <AcrobatBottomHUD
            currentPage={activePages.findIndex((p) => p.pageNumber === document.currentPage) + 1}
            totalPages={activePages.length}
            zoom={document.zoom}
            activeTool={activeTool}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onSelectTool={setActiveTool}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomFit={handleZoomFit}
          />
        </main>

        {/* 4.3 Caixa de Ferramentas Direita Retrátil (52px recolhida / 280px ampliada) */}
        <RightRetractableToolbox
          isExpanded={isRightToolboxExpanded}
          onToggleExpand={() => setIsRightToolboxExpanded(!isRightToolboxExpanded)}
          onSelectTool={(toolId) => {
            if (toolId === 'fill_sign') onOpenFillSign();
            else onSelectTool(toolId);
          }}
          onGoToToolsTab={onGoToToolsTab}
        />
      </div>
    </div>
  );
};

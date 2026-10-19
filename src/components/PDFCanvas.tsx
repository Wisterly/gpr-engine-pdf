'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PDFPageInfo, PageAnnotations, ToolMode } from '@/types/pdf';
import { AnnotationOverlay } from './AnnotationOverlay';
import { Loader2 } from 'lucide-react';

interface PDFCanvasProps {
  pdfDoc: any;
  pageInfo: PDFPageInfo;
  zoom: number;
  activeTool: ToolMode;
  selectedColor: string;
  annotations: PageAnnotations;
  activeStampType: 'APROVADO' | 'CONFERIDO' | 'URGENTE' | 'MEDIDO GPR' | 'EM ANÁLISE' | null;
  onUpdateAnnotations: (newAnnotations: PageAnnotations) => void;
}

export const PDFCanvas: React.FC<PDFCanvasProps> = ({
  pdfDoc,
  pageInfo,
  zoom,
  activeTool,
  selectedColor,
  annotations,
  activeStampType,
  onUpdateAnnotations,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [isRendering, setIsRendering] = useState(true);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        setIsRendering(true);

        // Cancela tarefa de renderização anterior se estiver em andamento
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(pageInfo.pageIndex + 1);
        if (isCancelled) return;

        const effectiveRotation = (page.rotate + pageInfo.rotation) % 360;
        const dpr = window.devicePixelRatio || 1;

        // Viewport CSS (tamanho visível)
        const cssViewport = page.getViewport({
          scale: zoom,
          rotation: effectiveRotation,
        });

        // Viewport Canvas de Alta Resolução (HiDPI / Retina)
        const canvasViewport = page.getViewport({
          scale: zoom * dpr,
          rotation: effectiveRotation,
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = canvasViewport.width;
        canvas.height = canvasViewport.height;

        canvas.style.width = `${cssViewport.width}px`;
        canvas.style.height = `${cssViewport.height}px`;

        setDimensions({
          width: cssViewport.width,
          height: cssViewport.height,
        });

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const renderContext = {
          canvasContext: ctx,
          viewport: canvasViewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;

        await task.promise;
        if (!isCancelled) {
          setIsRendering(false);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Erro renderizando página PDF:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageInfo.pageIndex, pageInfo.rotation, zoom]);

  return (
    <div className="relative inline-block bg-white shadow-2xl rounded-sm overflow-hidden select-none border border-black/10">
      {/* Canvas da página do PDF */}
      <canvas ref={canvasRef} className="block transition-all" />

      {/* Camada interativa de anotações */}
      {dimensions.width > 0 && (
        <AnnotationOverlay
          width={dimensions.width}
          height={dimensions.height}
          activeTool={activeTool}
          selectedColor={selectedColor}
          annotations={annotations}
          activeStampType={activeStampType}
          onUpdateAnnotations={onUpdateAnnotations}
        />
      )}

      {/* Indicador de renderização suave */}
      {isRendering && (
        <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-30">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-panel/90 border border-brand-cardBorder text-white text-xs shadow-lg">
            <Loader2 size={14} className="animate-spin text-amber-400" />
            <span>Processando página...</span>
          </div>
        </div>
      )}
    </div>
  );
};

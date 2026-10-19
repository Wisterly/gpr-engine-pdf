import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { PageAnnotations, PDFPageInfo } from '@/types/pdf';

interface ExportPDFOptions {
  originalBuffer: ArrayBuffer;
  pagesInfo: PDFPageInfo[];
  pageAnnotations: Record<number, PageAnnotations>;
}

// Converte cor hex (#3b82f6) para RGB normalizado [0, 1] do pdf-lib
function hexToRgbColor(hex: string) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return rgb(r, g, b);
}

export async function generateExportedPDF({
  originalBuffer,
  pagesInfo,
  pageAnnotations,
}: ExportPDFOptions): Promise<Uint8Array> {
  const sourceDoc = await PDFDocument.load(originalBuffer);
  const newDoc = await PDFDocument.create();

  // Filtra apenas páginas não excluídas
  const activePages = pagesInfo.filter((p) => !p.isDeleted);

  // Copia as páginas na ordem atual
  const pageIndicesToCopy = activePages.map((p) => p.pageIndex);
  const copiedPages = await newDoc.copyPages(sourceDoc, pageIndicesToCopy);

  const helveticaFont = await newDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaRegular = await newDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < activePages.length; i++) {
    const pageInfo = activePages[i];
    const newPage = copiedPages[i];
    newDoc.addPage(newPage);

    // Aplica rotação adicional
    if (pageInfo.rotation) {
      const currentAngle = newPage.getRotation().angle;
      newPage.setRotation(degrees((currentAngle + pageInfo.rotation) % 360));
    }

    const { width, height } = newPage.getSize();
    const annotations = pageAnnotations[pageInfo.pageNumber];

    if (annotations) {
      // 1. Textos
      for (const textItem of annotations.texts) {
        if (!textItem.text.trim()) continue;
        const textColor = hexToRgbColor(textItem.color || '#3b82f6');
        
        // Conversão de coordenadas da tela (topo-esquerda) para PDF (base-esquerda)
        // x e y armazenados como percentuais (0-1) da largura/altura da página
        const pdfX = textItem.x * width;
        const pdfY = height - (textItem.y * height) - (textItem.fontSize || 16);

        newPage.drawText(textItem.text, {
          x: Math.max(10, Math.min(width - 50, pdfX)),
          y: Math.max(10, Math.min(height - 20, pdfY)),
          size: textItem.fontSize || 16,
          font: helveticaRegular,
          color: textColor,
        });
      }

      // 2. Carimbos
      for (const stamp of annotations.stamps) {
        const stampColor = hexToRgbColor(stamp.color || '#10b981');
        const pdfX = stamp.x * width;
        const pdfY = height - (stamp.y * height) - 40;

        const text = stamp.type;
        const textWidth = helveticaFont.widthOfTextAtSize(text, 14);
        const padding = 12;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 32;

        // Borda do carimbo
        newPage.drawRectangle({
          x: Math.max(10, pdfX),
          y: Math.max(10, pdfY),
          width: boxWidth,
          height: boxHeight,
          borderWidth: 2,
          borderColor: stampColor,
          color: rgb(stampColor.red, stampColor.green, stampColor.blue),
          opacity: 0.15,
        });

        // Borda externa
        newPage.drawRectangle({
          x: Math.max(10, pdfX),
          y: Math.max(10, pdfY),
          width: boxWidth,
          height: boxHeight,
          borderWidth: 1.5,
          borderColor: stampColor,
        });

        // Texto do carimbo
        newPage.drawText(text, {
          x: Math.max(10, pdfX) + padding,
          y: Math.max(10, pdfY) + 9,
          size: 14,
          font: helveticaFont,
          color: stampColor,
        });
      }

      // 3. Desenhos livres e Destaques
      for (const drawing of annotations.drawings) {
        if (drawing.points.length < 2) continue;
        const drawColor = hexToRgbColor(drawing.color);
        const isHighlight = drawing.tool === 'highlight';

        for (let pIdx = 0; pIdx < drawing.points.length - 1; pIdx++) {
          const pt1 = drawing.points[pIdx];
          const pt2 = drawing.points[pIdx + 1];

          const startX = pt1.x * width;
          const startY = height - (pt1.y * height);
          const endX = pt2.x * width;
          const endY = height - (pt2.y * height);

          newPage.drawLine({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            thickness: isHighlight ? (drawing.size || 18) : (drawing.size || 2.5),
            color: drawColor,
            opacity: isHighlight ? 0.35 : 1,
          });
        }
      }
    }
  }

  return await newDoc.save();
}

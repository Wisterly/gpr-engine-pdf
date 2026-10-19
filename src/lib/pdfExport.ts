import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { PageAnnotations, PDFPageInfo } from '@/types/pdf';

interface ExportPDFOptions {
  originalBuffer: ArrayBuffer;
  pagesInfo: PDFPageInfo[];
  pageAnnotations: Record<number, PageAnnotations>;
}

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

  const activePages = pagesInfo.filter((p) => !p.isDeleted);
  const pageIndicesToCopy = activePages.map((p) => p.pageIndex);
  const copiedPages = await newDoc.copyPages(sourceDoc, pageIndicesToCopy);

  const helveticaFont = await newDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaRegular = await newDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < activePages.length; i++) {
    const pageInfo = activePages[i];
    const newPage = copiedPages[i];
    newDoc.addPage(newPage);

    if (pageInfo.rotation) {
      const currentAngle = newPage.getRotation().angle;
      newPage.setRotation(degrees((currentAngle + pageInfo.rotation) % 360));
    }

    const { width, height } = newPage.getSize();
    const annotations = pageAnnotations[pageInfo.pageNumber];

    if (annotations) {
      // 1. Textos
      if (annotations.texts) {
        for (const textItem of annotations.texts) {
          if (!textItem.text.trim()) continue;
          const textColor = hexToRgbColor(textItem.color || '#f59e0b');
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
      }

      // 2. Notas Adesivas (Sticky Notes estilo Acrobat)
      if (annotations.stickyNotes) {
        for (const note of annotations.stickyNotes) {
          const pdfX = note.x * width;
          const pdfY = height - (note.y * height);
          const noteColor = hexToRgbColor(note.color || '#f59e0b');

          // Ícone da nota
          newPage.drawRectangle({
            x: pdfX - 8,
            y: pdfY - 8,
            width: 16,
            height: 16,
            color: noteColor,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
          });

          // Texto resumido ao lado
          if (note.text) {
            newPage.drawText(`[Nota: ${note.text.slice(0, 45)}]`, {
              x: pdfX + 12,
              y: pdfY - 4,
              size: 9,
              font: helveticaRegular,
              color: noteColor,
            });
          }
        }
      }

      // 3. Formas Geométricas
      if (annotations.shapes) {
        for (const shape of annotations.shapes) {
          const shapeColor = hexToRgbColor(shape.color || '#f59e0b');
          const x1 = shape.startX * width;
          const y1 = height - (shape.startY * height);
          const x2 = shape.endX * width;
          const y2 = height - (shape.endY * height);

          if (shape.type === 'rectangle') {
            const rx = Math.min(x1, x2);
            const ry = Math.min(y1, y2);
            const rw = Math.abs(x2 - x1);
            const rh = Math.abs(y2 - y1);

            newPage.drawRectangle({
              x: rx,
              y: ry,
              width: rw,
              height: rh,
              borderWidth: shape.strokeWidth || 2,
              borderColor: shapeColor,
            });
          } else if (shape.type === 'circle') {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;

            newPage.drawEllipse({
              x: cx,
              y: cy,
              xScale: rx,
              yScale: ry,
              borderWidth: shape.strokeWidth || 2,
              borderColor: shapeColor,
            });
          } else if (shape.type === 'line' || shape.type === 'arrow') {
            newPage.drawLine({
              start: { x: x1, y: y1 },
              end: { x: x2, y: y2 },
              thickness: shape.strokeWidth || 2,
              color: shapeColor,
            });
          }
        }
      }

      // 4. Carimbos Oficiais
      if (annotations.stamps) {
        for (const stamp of annotations.stamps) {
          const stampColor = hexToRgbColor(stamp.color || '#f59e0b');
          const pdfX = stamp.x * width;
          const pdfY = height - (stamp.y * height) - 30;

          const text = stamp.type;
          const textWidth = helveticaFont.widthOfTextAtSize(text, 13);
          const padding = 12;
          const boxWidth = textWidth + padding * 2;
          const boxHeight = 28;

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

          newPage.drawRectangle({
            x: Math.max(10, pdfX),
            y: Math.max(10, pdfY),
            width: boxWidth,
            height: boxHeight,
            borderWidth: 1.5,
            borderColor: stampColor,
          });

          newPage.drawText(text, {
            x: Math.max(10, pdfX) + padding,
            y: Math.max(10, pdfY) + 8,
            size: 13,
            font: helveticaFont,
            color: stampColor,
          });
        }
      }

      // 5. Assinaturas Manuscritas (PNG Embed)
      if (annotations.signatures) {
        for (const sig of annotations.signatures) {
          try {
            const pngImage = await newDoc.embedPng(sig.dataUrl);
            const pdfX = sig.x * width - (sig.width / 2);
            const pdfY = height - (sig.y * height) - (sig.height / 2);

            newPage.drawImage(pngImage, {
              x: Math.max(10, pdfX),
              y: Math.max(10, pdfY),
              width: sig.width,
              height: sig.height,
            });
          } catch (e) {
            console.error('Erro ao embutir imagem de assinatura no PDF:', e);
          }
        }
      }

      // 6. Preenchimento de Formulários (Checkmark, Cross, Dot)
      if (annotations.formMarks) {
        for (const mark of annotations.formMarks) {
          const pdfX = mark.x * width;
          const pdfY = height - (mark.y * height);
          const markColor = hexToRgbColor(mark.color || '#f59e0b');

          if (mark.type === 'check') {
            newPage.drawText('V', {
              x: pdfX,
              y: pdfY,
              size: mark.size || 16,
              font: helveticaFont,
              color: markColor,
            });
          } else if (mark.type === 'cross') {
            newPage.drawText('X', {
              x: pdfX,
              y: pdfY,
              size: mark.size || 16,
              font: helveticaFont,
              color: markColor,
            });
          } else if (mark.type === 'dot') {
            newPage.drawEllipse({
              x: pdfX,
              y: pdfY,
              xScale: 4,
              yScale: 4,
              color: markColor,
            });
          }
        }
      }

      // 7. Desenhos Livres, Marca-texto e Destaques
      if (annotations.drawings) {
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
              thickness: isHighlight ? 20 : (drawing.size || 2.5),
              color: drawColor,
              opacity: isHighlight ? 0.35 : 1,
            });
          }
        }
      }
    }
  }

  return await newDoc.save();
}

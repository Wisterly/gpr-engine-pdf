import { PDFDocument } from 'pdf-lib';

export interface CombineFileInput {
  id: string;
  name: string;
  fileBuffer: ArrayBuffer;
}

/**
 * Mescla múltiplos arquivos PDF em um único documento mantendo a ordem especificada
 */
export async function combinePDFDocuments(files: CombineFileInput[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error('Nenhum arquivo fornecido para combinação.');
  }

  const mergedDoc = await PDFDocument.create();

  for (const file of files) {
    const sourceDoc = await PDFDocument.load(file.fileBuffer);
    const pageIndices = sourceDoc.getPageIndices();
    const copiedPages = await mergedDoc.copyPages(sourceDoc, pageIndices);
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  return await mergedDoc.save();
}

import { PDFDocument } from 'pdf-lib';

export interface CombineFileInput {
  id: string;
  name: string;
  fileBuffer: ArrayBuffer;
}

/**
 * Mescla múltiplos arquivos PDF em um único documento mantendo a ordem especificada.
 * Resiliente contra buffers neutered/detached, criptografia de permissões e anomalias de sintaxe.
 */
export async function combinePDFDocuments(files: CombineFileInput[]): Promise<Uint8Array> {
  if (!files || files.length === 0) {
    throw new Error('Nenhum arquivo fornecido para combinação.');
  }

  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.fileBuffer || file.fileBuffer.byteLength === 0) {
      throw new Error(`O arquivo "${file.name}" está vazio ou corrompido na memória.`);
    }

    // Cria uma cópia limpa do buffer em Uint8Array para evitar qualquer conflito de offset ou neutering
    const fileBytes = new Uint8Array(file.fileBuffer.slice(0));

    // Carrega com tolerância máxima (ignora encriptação de visualização/permissões e metadados inválidos)
    const sourceDoc = await PDFDocument.load(fileBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
      throwOnInvalidObject: false,
    });

    const pageIndices = sourceDoc.getPageIndices();
    const copiedPages = await mergedDoc.copyPages(sourceDoc, pageIndices);
    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  return await mergedDoc.save();
}

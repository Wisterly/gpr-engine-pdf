import * as pdfjsLib from 'pdfjs-dist';

// Configura o worker local do PDF.js para carregamento assíncrono seguro
if (typeof window !== 'undefined') {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  }
}

export { pdfjsLib };

// Utilitário de persistência robusto no navegador usando IndexedDB para buffers pesados (PDFs) e LocalStorage para preferências.
// Garante que nenhum arquivo, configuração, ajuste ou personalização do usuário seja perdido em reloads ou novos deploys.

import { RecentFile } from '@/types/pdf';

const DB_NAME = 'GPR_ENGINE_DB';
const DB_VERSION = 1;
const STORE_PDFS = 'user_pdfs';

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_PDFS)) {
          db.createObjectStore(STORE_PDFS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn('Não foi possível abrir IndexedDB para persistência.');
        resolve(null);
      };
    } catch (err) {
      console.warn('Erro ao inicializar IndexedDB:', err);
      resolve(null);
    }
  });
}

/**
 * Salva permanentemente um arquivo PDF carregado pelo usuário no navegador.
 */
export async function persistUserFile(file: RecentFile): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_PDFS, 'readwrite');
      const store = tx.objectStore(STORE_PDFS);

      // Clona o objeto preservando os campos essenciais e o buffer binário
      const record = {
        id: file.id,
        name: file.name,
        openedAt: file.openedAt,
        size: file.size,
        sizeBytes: file.sizeBytes,
        isFavorite: !!file.isFavorite,
        fileBuffer: file.fileBuffer || null,
        timestamp: Date.now(),
      };

      store.put(record);

      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (e) {
      console.warn('Erro ao persistir arquivo no IndexedDB:', e);
      resolve();
    }
  });
}

/**
 * Carrega todos os arquivos anexados pelo usuário já salvos no navegador.
 */
export async function getPersistedUserFiles(): Promise<RecentFile[]> {
  const db = await openDatabase();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_PDFS, 'readonly');
      const store = tx.objectStore(STORE_PDFS);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        // Ordena por data decrescente
        results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        const files: RecentFile[] = results.map((item) => ({
          id: item.id,
          name: item.name,
          openedAt: item.openedAt,
          size: item.size,
          sizeBytes: item.sizeBytes,
          isFavorite: item.isFavorite,
          fileBuffer: item.fileBuffer ? item.fileBuffer : undefined,
        }));
        resolve(files);
      };

      request.onerror = () => resolve([]);
    } catch (e) {
      console.warn('Erro ao buscar arquivos do IndexedDB:', e);
      resolve([]);
    }
  });
}

/**
 * Atualiza o status de favorito de um arquivo persistido.
 */
export async function togglePersistedFavorite(fileId: string, isFavorite: boolean): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_PDFS, 'readwrite');
      const store = tx.objectStore(STORE_PDFS);
      const req = store.get(fileId);

      req.onsuccess = () => {
        if (req.result) {
          req.result.isFavorite = isFavorite;
          store.put(req.result);
        }
        resolve();
      };
      req.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Salva preferência genérica do usuário em localStorage
 */
export function saveUserPreference<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`gpr_pref_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Erro ao salvar preferência ${key}:`, e);
  }
}

/**
 * Obtém preferência genérica do usuário do localStorage
 */
export function getUserPreference<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(`gpr_pref_${key}`);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`Erro ao recuperar preferência ${key}:`, e);
  }
  return defaultValue;
}

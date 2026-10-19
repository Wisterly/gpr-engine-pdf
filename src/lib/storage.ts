// Sistema de Persistência Dual-Layer (LocalStorage para Metadados Instantâneos + IndexedDB para Buffers Binários de PDFs).
// Garante que TODOS os arquivos anexados, históricos de recentes e configurações sobrevivam a recarregamentos (F5) e deploys.

import { RecentFile } from '@/types/pdf';

const DB_NAME = 'GPR_ENGINE_DB';
const DB_VERSION = 1;
const STORE_PDFS = 'user_pdfs';
const META_STORAGE_KEY = 'gpr_persisted_recent_files_meta';

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
          const store = db.createObjectStore(STORE_PDFS, { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
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
 * Salva metadados de forma síncrona no localStorage para carregamento imediato (zero delay em F5).
 */
export function saveRecentFileMeta(file: RecentFile): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentFilesMeta();
    const updated: RecentFile[] = [
      {
        id: file.id,
        name: file.name,
        openedAt: file.openedAt,
        size: file.size,
        sizeBytes: file.sizeBytes,
        isFavorite: !!file.isFavorite,
      },
      ...existing.filter((f) => f.name !== file.name && f.id !== file.id),
    ];
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Erro ao salvar metadados no localStorage:', e);
  }
}

/**
 * Lê metadados de arquivos recentes salvos no localStorage instantaneamente.
 */
export function getRecentFilesMeta(): RecentFile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Erro ao ler metadados do localStorage:', e);
  }
  return [];
}

/**
 * Salva permanentemente um arquivo PDF no banco de dados local (IndexedDB) e metadados no localStorage.
 */
export async function persistUserFile(file: RecentFile): Promise<void> {
  // 1. Salva metadados instantaneamente
  saveRecentFileMeta(file);

  // 2. Salva o buffer binário completo no IndexedDB
  const db = await openDatabase();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_PDFS, 'readwrite');
      const store = tx.objectStore(STORE_PDFS);

      const record = {
        id: file.id,
        name: file.name,
        openedAt: file.openedAt,
        size: file.size,
        sizeBytes: file.sizeBytes,
        isFavorite: !!file.isFavorite,
        fileBuffer: file.fileBuffer ? (file.fileBuffer.slice(0) as ArrayBuffer) : null,
        timestamp: Date.now(),
      };

      store.put(record);

      tx.oncomplete = () => resolve();
      tx.onerror = (e) => {
        console.warn('Erro no put do IndexedDB:', e);
        resolve();
      };
    } catch (e) {
      console.warn('Erro ao persistir arquivo no IndexedDB:', e);
      resolve();
    }
  });
}

/**
 * Carrega todos os arquivos persistidos com seus respectivos buffers binários do IndexedDB.
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
        results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        const files: RecentFile[] = results.map((item) => ({
          id: item.id,
          name: item.name,
          openedAt: item.openedAt,
          size: item.size,
          sizeBytes: item.sizeBytes,
          isFavorite: item.isFavorite,
          fileBuffer: item.fileBuffer ? (item.fileBuffer.slice(0) as ArrayBuffer) : undefined,
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
 * Busca o ArrayBuffer de um PDF específico por ID ou por Nome.
 */
export async function getFileBufferFromIndexedDB(idOrName: string): Promise<ArrayBuffer | null> {
  const db = await openDatabase();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_PDFS, 'readonly');
      const store = tx.objectStore(STORE_PDFS);

      // Tenta por ID
      const reqId = store.get(idOrName);
      reqId.onsuccess = () => {
        if (reqId.result && reqId.result.fileBuffer) {
          resolve(reqId.result.fileBuffer.slice(0) as ArrayBuffer);
          return;
        }

        // Se não achou por ID, varre todos para achar por nome
        const reqAll = store.getAll();
        reqAll.onsuccess = () => {
          const match = (reqAll.result || []).find((item) => item.name === idOrName);
          if (match && match.fileBuffer) {
            resolve(match.fileBuffer.slice(0) as ArrayBuffer);
          } else {
            resolve(null);
          }
        };
        reqAll.onerror = () => resolve(null);
      };

      reqId.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Alterna o status de favorito de um arquivo no localStorage e IndexedDB.
 */
export async function togglePersistedFavorite(fileId: string, isFavorite: boolean): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      const meta = getRecentFilesMeta();
      const updated = meta.map((f) => (f.id === fileId ? { ...f, isFavorite } : f));
      localStorage.setItem(META_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

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
 * Salva preferência genérica do usuário em localStorage.
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
 * Obtém preferência genérica do usuário do localStorage.
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

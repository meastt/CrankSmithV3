/**
 * Background sync queue for handling failed requests
 * Stores requests in IndexedDB and retries when online
 */

interface QueuedRequest {
    id: string;
    url: string;
    method: string;
    body?: string;
    headers?: Record<string, string>;
    timestamp: number;
    retryCount: number;
}

const DB_NAME = 'cranksmith-sync-queue';
const DB_VERSION = 1;
const STORE_NAME = 'requests';
const MAX_RETRIES = 3;

class SyncQueue {
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        if (typeof window === 'undefined' || !('indexedDB' in window)) {
            return;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async addRequest(url: string, options: RequestInit): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        if (!this.db) return;

        const request: QueuedRequest = {
            id: `${Date.now()}-${Math.random()}`,
            url,
            method: options.method || 'GET',
            body: options.body ? String(options.body) : undefined,
            headers: options.headers as Record<string, string>,
            timestamp: Date.now(),
            retryCount: 0,
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const addRequest = store.add(request);

            addRequest.onsuccess = () => {
                console.log('[SyncQueue] Request queued:', url);
                // Register background sync if available
                this.registerBackgroundSync();
                resolve();
            };
            addRequest.onerror = () => reject(addRequest.error);
        });
    }

    async getQueuedRequests(): Promise<QueuedRequest[]> {
        if (!this.db) {
            await this.init();
        }

        if (!this.db) return [];

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        });
    }

    async removeRequest(id: string): Promise<void> {
        if (!this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const deleteRequest = store.delete(id);

            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        });
    }

    async processQueue(): Promise<void> {
        const requests = await this.getQueuedRequests();

        if (requests.length === 0) {
            console.log('[SyncQueue] Queue is empty');
            return;
        }

        console.log(`[SyncQueue] Processing ${requests.length} queued requests`);

        for (const request of requests) {
            try {
                const response = await fetch(request.url, {
                    method: request.method,
                    body: request.body,
                    headers: request.headers,
                });

                if (response.ok) {
                    console.log('[SyncQueue] Request succeeded:', request.url);
                    await this.removeRequest(request.id);
                } else {
                    console.warn('[SyncQueue] Request failed with status:', response.status);
                    if (request.retryCount >= MAX_RETRIES) {
                        console.warn('[SyncQueue] Max retries reached, removing from queue');
                        await this.removeRequest(request.id);
                    }
                }
            } catch (error) {
                console.error('[SyncQueue] Request error:', error);
                // Keep in queue for retry
            }
        }
    }

    private registerBackgroundSync(): void {
        if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then((registration) => {
                // @ts-ignore - Background Sync API types not yet in lib.dom.d.ts
                return registration.sync.register('sync-builds');
            }).catch((error) => {
                console.warn('[SyncQueue] Background sync registration failed:', error);
            });
        }
    }
}

export const syncQueue = new SyncQueue();

// Initialize on module load
if (typeof window !== 'undefined') {
    syncQueue.init().catch(console.error);

    // Process queue when coming online
    window.addEventListener('online', () => {
        console.log('[SyncQueue] Connection restored, processing queue');
        syncQueue.processQueue().catch(console.error);
    });
}

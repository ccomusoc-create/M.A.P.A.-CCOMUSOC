import { OfflineQueueItem } from '../types';

const QUEUE_STORAGE_KEY = 'ccomusoc_offline_queue_v1';

export function getOfflineQueue(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error al leer la cola offline:', err);
    return [];
  }
}

export function saveOfflineQueue(queue: OfflineQueueItem[]): void {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Error al guardar la cola offline:', err);
  }
}

export function addToOfflineQueue(item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'status'>): OfflineQueueItem {
  const currentQueue = getOfflineQueue();
  const newItem: OfflineQueueItem = {
    ...item,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  
  const updated = [newItem, ...currentQueue];
  saveOfflineQueue(updated);
  return newItem;
}

export function removeQueueItem(id: string): void {
  const queue = getOfflineQueue();
  const filtered = queue.filter(item => item.id !== id);
  saveOfflineQueue(filtered);
}

export function clearSyncedQueue(): void {
  const queue = getOfflineQueue();
  const pending = queue.filter(item => item.status === 'pending');
  saveOfflineQueue(pending);
}

/**
 * Procesa la cola offline ejecutando un callback de sincronización por cada elemento pendiente
 */
export async function processOfflineQueue(
  syncHandler: (item: OfflineQueueItem) => Promise<boolean>
): Promise<{ processed: number; errors: number }> {
  const queue = getOfflineQueue();
  let processed = 0;
  let errors = 0;

  const updatedQueue: OfflineQueueItem[] = [];

  for (const item of queue) {
    if (item.status === 'pending') {
      try {
        const success = await syncHandler(item);
        if (success) {
          processed++;
          updatedQueue.push({ ...item, status: 'synced' });
        } else {
          errors++;
          updatedQueue.push({ ...item, status: 'error', errorMsg: 'Respuesta no satisfactoria' });
        }
      } catch (err: any) {
        errors++;
        updatedQueue.push({ ...item, status: 'error', errorMsg: err.message || 'Error de red' });
      }
    } else {
      updatedQueue.push(item);
    }
  }

  saveOfflineQueue(updatedQueue);
  return { processed, errors };
}

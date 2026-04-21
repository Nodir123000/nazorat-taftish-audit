import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'NazoratAuditDB';
const STORE_NAME = 'document_events';

export interface AuditEvent {
    id?: number;
    docId: string;
    docType: string;
    userId: string;
    userName: string;
    action: 'VIEW' | 'PRINT' | 'DOWNLOAD' | 'SIGN';
    timestamp: string;
    metadata?: any;
}

export const AuditLogger = {
    db: null as IDBPDatabase | null,

    async init() {
        if (this.db) return this.db;

        this.db = await openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    store.createIndex('docId', 'docId');
                    store.createIndex('timestamp', 'timestamp');
                    store.createIndex('action', 'action');
                }
            },
        });
        return this.db;
    },

    async logEvent(event: Omit<AuditEvent, 'timestamp'>) {
        try {
            const db = await this.init();
            await db.add(STORE_NAME, {
                ...event,
                timestamp: new Date().toISOString(),
            });
            console.log(`[Audit] Logged ${event.action} for ${event.docId}`);
        } catch (err) {
            console.error('Failed to log audit event:', err);
        }
    },

    async getLogsByDoc(docId: string) {
        const db = await this.init();
        return await db.getAllFromIndex(STORE_NAME, 'docId', docId);
    },

    async exportAllLogs(): Promise<string> {
        const db = await this.init();
        const all = await db.getAll(STORE_NAME);
        return JSON.stringify(all, null, 2);
    }
};

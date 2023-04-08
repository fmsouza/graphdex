import { StorageDriver } from "../types";

class MemoryStorageDriver implements StorageDriver {
  private _store: Map<string, any> = new Map();

  public async save(nid: string, payload: any): Promise<void> {
    this._store.set(nid, payload);
  }

  public async get(nid: string): Promise<any> {
    return this._store.get(nid);
  }

  public async remove(nid: string): Promise<void> {
    this._store.delete(nid);
  }
}

export function memory(): StorageDriver {
  return new MemoryStorageDriver();
}

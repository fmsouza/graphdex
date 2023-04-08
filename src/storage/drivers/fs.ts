import path from 'path';
import { promises as nodefs } from "fs";

import { StorageDriver } from "../types";

const DEFAULT_ENCODING = 'utf8';

class FileStorageDriver implements StorageDriver {

  public constructor(private _path: string) {}

  private getPath(filename: string): string {
    return path.join(this._path, filename + '.json');
  }

  public async save(filename: string, payload: any): Promise<void> {
    const filepath = this.getPath(filename);
    await nodefs.writeFile(filepath, payload, {
      encoding: DEFAULT_ENCODING,
    });
  }

  public async get(filename: string): Promise<any> {
    const filepath = this.getPath(filename);
    return await nodefs.readFile(filepath, {
      encoding: DEFAULT_ENCODING,
    });
  }

  public async remove(filename: string): Promise<void> {
    const filepath = this.getPath(filename);
    return await nodefs.unlink(filepath);
  }
}

export function fs(datapath: string): StorageDriver {
  return new FileStorageDriver(datapath);
}

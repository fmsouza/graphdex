import { Emitter } from "../emitter";
import { Maybe } from "../utils";

export interface StorageDriver {
  save(nid: string, payload: any): Promise<void>;
  get(nid: string): Promise<Maybe<any>>;
  remove(nid: string): Promise<Maybe<any>>;
}

type InternalStorageOptions = {
  emitter: Emitter;
}

export type ExternalStorageOptions = {
  driver?: StorageDriver;
}

export type StorageOptions = InternalStorageOptions & ExternalStorageOptions;
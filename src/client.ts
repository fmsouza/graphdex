import { Emitter } from "./emitter";
import { Graph } from "./graph";
import { Storage, ExternalStorageOptions } from "./storage";

interface NodeClientOptions {
  appId: string;
  storage: ExternalStorageOptions;
}

export class NodeClient {
  private static _instance: NodeClient;
  private _graph!: Graph;
  private _storage!: Storage;
  private _emitter: Emitter = new Emitter();
  
  
  public get graph(): Graph {
    return this._graph;
  }

  public get storage(): Storage {
    return this._storage;
  }

  public get events(): Emitter {
    return this._emitter;
  }

  public constructor(options?: NodeClientOptions) {
    if (NodeClient._instance) return NodeClient._instance;

    const defaultOps = {
      emitter: this._emitter,
    }
    
    this._graph = new Graph({ ...defaultOps });
    this._storage = new Storage({ ...options?.storage, ...defaultOps });

    NodeClient._instance = this;
  }
}


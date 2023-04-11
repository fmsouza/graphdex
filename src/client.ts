import { Emitter } from "./emitter";
import { Graph } from "./graph";
import { IdentityOptions } from "./identity";
import { Identity } from "./identity";
import { Storage, ExternalStorageOptions } from "./storage";

interface NodeClientOptions {
  appId: string;
  storage: ExternalStorageOptions;
  identity: IdentityOptions;
}

export class NodeClient {
  private static _instance: NodeClient;
  private _emitter: Emitter = new Emitter();
  private _graph!: Graph;
  private _identity!: Identity;
  private _storage!: Storage;

  public get events(): Emitter {
    return this._emitter;
  }
  
  public get graph(): Graph {
    return this._graph;
  }

  public get identity(): Identity {
    return this._identity;
  }

  public get storage(): Storage {
    return this._storage;
  }

  public constructor(options: NodeClientOptions) {
    if (NodeClient._instance) return NodeClient._instance;

    const defaultOps = {
      emitter: this._emitter,
    }
    
    this._graph = new Graph({ ...defaultOps });
    this._identity = new Identity({ ...options?.identity });
    this._storage = new Storage({ ...options?.storage, ...defaultOps });

    NodeClient._instance = this;
  }
}


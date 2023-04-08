import { Emitter } from "../emitter";
import { Node } from "./node";
import { GraphEvents } from "./events";
import { NodeNotFoundError } from "./errors";

export interface GraphOptions {
  emitter: Emitter;
}

export class Graph {
  private _store: Map<string, Node<any>> = new Map();
  private _emitter: Emitter;

  public constructor(options: GraphOptions) {
    this._emitter = options.emitter;
  }

  public async createNode<NodeValueType>(data: NodeValueType): Promise<Node<NodeValueType>> {
    const node = Node.create(data, this._emitter);

    this._store.set(node.nid, node);
    this._emitter.emit(GraphEvents.NODE_CREATED, node);

    return node;
  }

  public async getNode<NodeValueType>(nid: string): Promise<Node<NodeValueType>> {
    const node = this._store.get(nid);

    if (node) {
      return node as Node<NodeValueType>;
    }

    const newNode = await Node.find<NodeValueType>(nid, this._emitter);
    if (!newNode) {
      throw new NodeNotFoundError(nid);
    }

    await newNode.update();
    return newNode;
  }
}

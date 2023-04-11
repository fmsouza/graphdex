import { Emitter } from "../emitter";
import { generateHash } from "../utils";
import { Maybe } from "../types";

import { GraphEvents } from "./events";
import { deserializeNode, findNode, serializeNode } from "./utils";

interface NodeOptions<NodeValueType> {
  nid: string;
  payload?: NodeValueType;
  createdAt?: Date;
  edges?:  Map<string, Node<any>>;
  emitter: Emitter;
}

export class Node<NodeValueType> {
  private _nid: string;
  private _payload?: Maybe<NodeValueType>;
  private _createdAt?: Maybe<Date>;
  private _emitter: Emitter;
  private _edges?: Maybe<Map<string, Node<any>>>;
  private _loaded: boolean;

  public get nid(): string {
    return this._nid;
  }

  public get payload(): Maybe<NodeValueType> {
    return this._payload;
  }

  public get createdAt(): Maybe<Date> {
    return this._createdAt;
  }

  public get edges(): Maybe<Map<string, Node<any>>> {
    return this._edges;
  }

  public constructor(options: NodeOptions<NodeValueType>) {
    this._nid = options.nid;
    this._payload = options.payload;
    this._createdAt = options.createdAt;
    this._edges = options.edges;
    this._emitter = options.emitter;
    this._loaded = Boolean(options.createdAt);

    this._setupListeners();
  }

  private _setupListeners(): void {
    this._emitter.on(GraphEvents.NODE_UPDATED, this.onNodeUpdated.bind(this));
  }

  private onNodeUpdated(payload: {node: Node<NodeValueType>}): void {
    const {node} = payload;
    if (node.nid === this._nid) {
      this._updateNodeData(node);
    }
  }

  public async update(): Promise<void> {
    const event = this._loaded ? GraphEvents.NODE_UPDATE : GraphEvents.NODE_LOAD;
    this._emitter.emit({
      event,
      payload: {nid: this._nid}
    });

    if (this._loaded) return;

    const node = await Node.find<NodeValueType>({
      nid: this._nid,
      emitter: this._emitter
    });
    if (node) {
      this._updateNodeData(node);
    }
  }

  private _updateNodeData(node: Node<NodeValueType>): void {
    this._payload = node.payload;
    this._createdAt = node.createdAt;
    this._edges = node.edges;
    this._loaded = true;
  }

  public async add<EdgeNodeValueType>(input: {label: string, node: Node<EdgeNodeValueType>}): Promise<void> {
    const {label, node} = input;
    this._edges!.set(label, node);
    this._emitter.emit({
      event: GraphEvents.NODE_UPDATED,
      payload: {node: this}
    });
  }

  public async edge<EdgeNodeValueType>(label: string): Promise<Maybe<Node<EdgeNodeValueType>>> {
    const node = this._edges!.get(label);
    if (!node) return null;

    await node.update();
    return node;
  }

  public static create<NodeValueType>(input: {payload: NodeValueType, emitter: Emitter}): Node<NodeValueType> {
    const {payload, emitter} = input;
    const nid = generateHash({
      data: payload
    });
    const createdAt = new Date();
    const edges = new Map<string, Node<any>>();
    return new Node<NodeValueType>({nid, payload, emitter, createdAt, edges});
  }

  public serialize(): string {
    return serializeNode(this);
  }

  public static deserialize<NodeValueType>(input: {serialized: string, emitter: Emitter}): Node<NodeValueType> {
    const {serialized, emitter} = input;
    return deserializeNode(serialized, emitter);
  }

  public static async find<NodeValueType>(input: {nid: string, emitter: Emitter}): Promise<Maybe<Node<NodeValueType>>> {
    const {nid, emitter} = input;
    return findNode<NodeValueType>(nid, emitter);
  }
}

import { Emitter } from "../emitter";
import { GraphEvents, Node } from "../graph";

import { memory } from "./drivers/memory";
import { StorageDriver, StorageOptions } from "./types";

export class Storage {
  private _emitter: Emitter;
  private _driver: StorageDriver;

  public constructor(options: StorageOptions) {
    this._emitter = options.emitter;
    this._driver = options.driver ?? memory();
    this.setupListeners();
  }

  private setupListeners(): void {
    this._emitter
      .on(GraphEvents.NODE_CREATED, this.save.bind(this))
      .on(GraphEvents.NODE_UPDATED, this.save.bind(this))
      .on(GraphEvents.NODE_REMOVED, this.remove.bind(this))
      .on(GraphEvents.NODE_LOAD, this.load.bind(this));
  }

  private async save<NodeValueType>(payload: {node: Node<NodeValueType>}): Promise<void> {
    const {node} = payload;
    const serialized = node.serialize();
    await this._driver.save(node.nid, serialized);
  }

  public async load<NodeValueType>(payload: {nid: string}): Promise<void> {
    const {nid} = payload;
    const serialized = await this._driver.get(nid);
    const node = !serialized ? null : Node.deserialize<NodeValueType>({
      serialized,
      emitter: this._emitter
    });
    if (node) {
      this._emitter.emit({
        event: GraphEvents.NODE_LOADED,
        payload: {node}
      });
    } else {
      this._emitter.emit({
        event: GraphEvents.NODE_NOT_FOUND,
        payload: {nid}
      });
    }
  }

  public async remove(nid: string): Promise<void> {
    await this._driver.remove(nid);
  }
}

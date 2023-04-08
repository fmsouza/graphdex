import { BaseError } from "../utils";

export class NodeNotFoundError extends BaseError {
  constructor(nid: string) {
    super("NODE_NOT_FOUND", `Node with nid ${nid} not found`);
  }
}

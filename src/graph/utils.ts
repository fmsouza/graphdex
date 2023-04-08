import { Emitter } from "../emitter";
import { Maybe } from "../utils";
import { NodeNotFoundError } from "./errors";
import { GraphEvents } from "./events";
import { Node } from "./node";

export function serializeNode(node: Node<any>): string {
  const edges = serializeEdges(node.edges!);
  return JSON.stringify({
      nid: node.nid,
      payload: node.payload,
      createdAt: node.createdAt,
      edges,
  });
}

function serializeEdges(edges: Map<string, Node<any>>): Array<{ label: string, nid: string }> {
  return Array.from(edges.entries()).map((edge: [label: string, node: Node<any>]) => {
    const [label, node] = edge;
    return {
      label: label,
      nid: node.nid,
    };
  });
}

export function deserializeNode<T>(serialized: string, emitter: Emitter): Node<T> {
  const {nid, payload, createdAt: createdAtString, edges: serializedEdges} = JSON.parse(serialized);
  const edges = deserializeEdges(serializedEdges, emitter);
  const createdAt = new Date(createdAtString);
  return new Node<T>({nid, payload, createdAt, edges, emitter});
}

function deserializeEdges(serializedEdges: Array<{ label: string, nid: string }>, emitter: Emitter): Map<string, Node<any>> {
  const edges = new Map<string, Node<any>>();

  serializedEdges.forEach((edge) => {
    const {label, nid} = edge;
    edges.set(label, new Node<any>({nid, payload: null, emitter}));
  });

  return edges;
}

export async function findNode<NodeValueType>(nid: string, emitter: Emitter): Promise<Maybe<Node<NodeValueType>>> {
  return new Promise((resolve, reject) => {
    emitter
      .once(GraphEvents.NODE_LOADED, (node: Node<NodeValueType>) => {
        if (node.nid === nid) {
          resolve(node);
        }
      })
      .once(GraphEvents.NODE_NOT_FOUND, (nid: string) => {
        reject(new NodeNotFoundError(nid));
      })
      .emit(GraphEvents.NODE_LOAD, nid);
  });
}

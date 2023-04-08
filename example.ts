import { NodeClient } from "./src";
import { fs as fsDriver } from "./src/storage/drivers/fs";

(async function main() {
  const client = new NodeClient({
    storage: {
      driver: fsDriver(process.cwd() + '/tmp'),
    }
  });
  
  try {
    const node = await client.graph.createNode({ hello: "world" });
    console.log('nid:', node.nid);
  
    const node2 = await client.graph.createNode("bar");
    console.log('nid2:', node2.nid);
  
    await node.add('foo', node2);
  
    client.graph.debug();
  
  } catch (error) {
    const _err = error as Error;
    console.log(_err.message);
  }
})();

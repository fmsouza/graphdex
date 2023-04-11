import { createHash } from "crypto";

export function generateHash(input: {data: any, algorithm?: string}): string {
  const { data, algorithm } = input;
  const contents = (typeof data !== "string") ? JSON.stringify(data) : data;
  const dataHash = createHash(algorithm ?? "sha1");
  dataHash.update(contents);
  return dataHash.digest("hex");
}

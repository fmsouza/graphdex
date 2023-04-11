export type Maybe<T> = T | null | undefined;

export interface KeyPair {
  privateKey: Buffer;
  publicKey: Buffer;
}

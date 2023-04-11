import { ec as EllipticCurve } from "elliptic";

import { KeyPair } from "../types";

const ecdsa: EllipticCurve = new EllipticCurve("secp256k1");

export function generateKeyPair(options?: EllipticCurve.GenKeyPairOptions): KeyPair {
  const keys: EllipticCurve.KeyPair = ecdsa.genKeyPair(options);
  return {
    privateKey: Buffer.from(keys.getPrivate("hex"), "hex"),
    publicKey: Buffer.from(keys.getPublic("hex"), "hex"),
  };
}

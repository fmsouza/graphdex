import { KeyPair, generateHash } from "./utils";

export interface IdentityOptions {
  keyPair: KeyPair;
}

export class Identity {
  private _keyPair: KeyPair;

  public get keys(): KeyPair {
    return this._keyPair;
  }

  public get id(): string {
    return generateHash({
      data: this._keyPair.publicKey.toString("hex"),
      algorithm: "sha256"
    });
  }

  public constructor(options: IdentityOptions) {
    this._keyPair = options.keyPair;
  }
}
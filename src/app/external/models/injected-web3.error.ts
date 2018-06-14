export class InjectedWeb3Error extends Error {
  constructor(message?: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InjectedWeb3Error.prototype);
  }
}

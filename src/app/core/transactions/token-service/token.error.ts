export class TokenError extends Error {
  constructor(message?: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TokenError.prototype);
  }
}

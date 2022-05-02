export class ProofError extends Error {
  readonly name = 'ProofClientError'
  readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

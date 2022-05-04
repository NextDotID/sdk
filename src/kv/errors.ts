export class KVError extends Error {
  readonly name = 'KVClientError'
  readonly statusCode: number

  constructor(message: string, statusCode = Number.NaN) {
    super(message)
    this.statusCode = statusCode
  }
}

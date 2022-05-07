export class ProofError extends Error {
  readonly name = 'ProofClientError'
  readonly statusCode: number

  static async from(response: Response) {
    const payload = (await response.json()) as { message: string }
    throw new ProofError(payload.message, response.status)
  }

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

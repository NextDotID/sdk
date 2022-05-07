export class KVError extends Error {
  readonly name = 'KVClientError'
  readonly statusCode: number

  static async from(response: Response) {
    const payload = (await response.json()) as { message: string }
    throw new KVError(payload.message, response.status)
  }

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

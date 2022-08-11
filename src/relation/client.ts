import { GraphQLClient } from 'graphql-request'
import { getSdk, Sdk } from './graphql'

export class RelationClient {
  private readonly baseURL: URL
  public readonly sdk: Sdk

  static production() {
    return new RelationClient('https://relation-service.next.id')
  }

  static development() {
    return new RelationClient('https://relation-service.nextnext.id')
  }

  constructor(baseURL: string | URL) {
    this.baseURL = new URL(baseURL)
    const client = new GraphQLClient(this.baseURL.toString())
    this.sdk = getSdk(client)
  }
}

import { GraphQLClient } from 'graphql-request'
import { getSdk, Sdk } from './graphql'

export class RelationClient {
  private readonly baseURL: URL
  private readonly client: GraphQLClient
  public readonly sdk: Sdk

  static production() {
    return new RelationClient('https://relation-service.next.id')
  }

  static development() {
    return new RelationClient('https://relation-service.nextnext.id')
  }

  constructor(baseURL: string | URL) {
    this.baseURL = new URL(baseURL)
    this.client = new GraphQLClient(this.baseURL.toString())
    this.sdk = getSdk(this.client)
  }

  rawRequest(
    query: string,
    vars?: any,
  ): Promise<{
    data: any
    extensions?: any
    status: number
  }> {
    return this.client.rawRequest(query, vars)
  }
}

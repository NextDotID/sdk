import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  UUID: any;
};

/** List of chains supported by RelationService. */
export enum Chain {
  /**
   * Arbitrum One
   * http://arbiscan.io
   */
  Arbitrum = 'arbitrum',
  /**
   * Arweave enables you to store documents and applications forever.
   * https://www.arweave.org
   */
  Arweave = 'arweave',
  /**
   * BNB Smart Chain (BSC) (Previously Binance Smart Chain) - EVM compatible, consensus layers, and with hubs to multi-chains.
   * https://www.binance.com/en/support/announcement/854415cf3d214371a7b60cf01ead0918
   */
  Bsc = 'bsc',
  /**
   * Conflux is a new secure and reliable public blockchain with very high performance and scalability.
   * https://developer.confluxnetwork.org
   */
  Conflux = 'conflux',
  /**
   * Conflux has a virtual machine that is similar to the EVM.
   * https://evm.confluxscan.io
   * https://developer.confluxnetwork.org/conflux-doc/docs/EVM-Space/intro_of_evm_space
   */
  ConfluxEspace = 'conflux_espace',
  /** The Blockchain. */
  Ethereum = 'ethereum',
  EthereumClassic = 'ethereum_classic',
  /**
   * Gnosis Chain provides stability, scalability and an extendable beacon chain framework.
   * Established in 2018 as the xDai Chain, the updated Gnosis Chain gives devs the tools and resources they need to create enhanced user experiences and optimized applications.
   * https://developers.gnosischain.com
   */
  Gnosis = 'gnosis',
  /**
   * A cross-client proof-of-authority testing network for Ethereum.
   * https://goerli.net
   */
  Goerli = 'goerli',
  /** Deprecated since `The Merge`. */
  Kovan = 'kovan',
  /**
   * Polygon Testnet
   * https://mumbai.polygonscan.com
   */
  Mumbai = 'mumbai',
  /**
   * Optimism is a low-cost and lightning-fast Ethereum L2 blockchain.
   * https://www.optimism.io
   */
  Optimism = 'optimism',
  /**
   * Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees without ever sacrificing on security.
   * https://polygon.technology
   */
  Polygon = 'polygon',
  /** Deprecated since `The Merge`. */
  Rinkeby = 'rinkeby',
  /** Deprecated since `The Merge`. */
  Ropsten = 'ropsten',
  /**
   * Sepolia is expected to undergo `The Merge` to proof-of-stake in summer 2022.
   * https://sepolia.dev
   */
  Sepolia = 'sepolia',
  /**
   * Solana is a decentralized blockchain built to enable scalable, user-friendly apps for the world.
   * https://solana.com
   */
  Solana = 'solana',
  Unknown = 'unknown',
  /** https://zksync.io */
  Zksync = 'zksync'
}

export enum ContractCategory {
  Ens = 'ENS',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Poap = 'POAP',
  Unknown = 'unknown'
}

/**
 * Who collects all the data.
 * It works as a "data cleansing" or "proxy" between `Upstream`s and us.
 */
export enum DataFetcher {
  /** Aggregation service */
  AggregationService = 'aggregation_service',
  /** This server */
  RelationService = 'relation_service'
}

/** All data respource platform. */
export enum DataSource {
  Cyberconnect = 'cyberconnect',
  EthLeaderboard = 'ethLeaderboard',
  /** https://keybase.io/docs/api/1.0/call/user/lookup */
  Keybase = 'keybase',
  /** https://docs.knn3.xyz/graphql/ */
  Knn3 = 'knn3',
  /** https://docs.next.id/docs/proof-service/api */
  Nextid = 'nextid',
  /** Data directly fetched from blockchain's RPC server. */
  RpcServer = 'rpc_server',
  /** https://rss3.io/network/api.html */
  Rss3 = 'rss3',
  /** https://github.com/Uniswap/sybil-list/blob/master/verified.json */
  Sybil = 'sybil',
  TheGraph = 'the_graph',
  /** Unknown */
  Unknown = 'unknown'
}

/** Status for a record in RelationService DB */
export enum DataStatus {
  /** Fetched or not in Database. */
  Cached = 'cached',
  /**
   * Fetching this data.
   * The result you got maybe outdated.
   * Come back later if you want a fresh one.
   */
  Fetching = 'fetching',
  /** Outdated record */
  Outdated = 'outdated'
}

export type HoldRecord = {
  __typename?: 'HoldRecord';
  /** Contract address of this Contract. Usually `0xHEX_STRING`. */
  address: Scalars['String'];
  /** NFT Category. See `availableNftCategories` for all values available. */
  category: ContractCategory;
  /**
   * On which chain?
   *
   * See `availableChains` for all chains supported by RelationService.
   */
  chain: Chain;
  /** When the transaction happened. May not be provided by upstream. */
  createdAt?: Maybe<Scalars['Int']>;
  /**
   * Who collects this data.
   * It works as a "data cleansing" or "proxy" between `source`s and us.
   */
  fetcher: DataFetcher;
  /**
   * NFT_ID in contract / ENS domain / anything can be used as an unique ID to specify the held object.
   * It must be one here.
   * Tips: NFT_ID of ENS is a hash of domain. So domain can be used as NFT_ID.
   */
  id: Scalars['String'];
  /** Which `Identity` does this NFT belong to. */
  owner: IdentityRecord;
  /**
   * Data source (upstream) which provides this info.
   * Theoretically, Contract info should only be fetched by chain's RPC server,
   * but in practice, we still rely on third-party cache / snapshot service.
   */
  source: DataSource;
  /** Token symbol (if any). */
  symbol?: Maybe<Scalars['String']>;
  /**
   * Transaction info of this connection.
   * i.e. in which `tx` the Contract is transferred / minted.
   * In most case, it is a `"0xVERY_LONG_HEXSTRING"`.
   * It happens that this info is not provided by `source`, so we treat it as `Option<>`.
   */
  transaction?: Maybe<Scalars['String']>;
  /** When this HODL™ relation is fetched by us RelationService. */
  updatedAt: Scalars['Int'];
  /** UUID of this record. */
  uuid: Scalars['UUID'];
};

export type IdentityRecord = {
  __typename?: 'IdentityRecord';
  /**
   * When this Identity is added into this database.
   * Second-based unix timestamp.
   * Generated by us.
   */
  addedAt: Scalars['Int'];
  /** URL to avatar (if any is recorded and given by target platform). */
  avatarUrl?: Maybe<Scalars['String']>;
  /**
   * Account / identity creation time ON TARGET PLATFORM.
   * This is not necessarily the same as the creation time of the record in the database.
   * Since `created_at` may not be recorded or given by target platform.
   * e.g. `Twitter` has a `created_at` in the user profile API.
   * but `Ethereum` is obviously no such thing.
   */
  createdAt?: Maybe<Scalars['Int']>;
  /**
   * Usually user-friendly screen name.  e.g. for `Twitter`, this
   * is the user's `screen_name`.
   * Note: both `null` and `""` should be treated as "no value".
   */
  displayName?: Maybe<Scalars['String']>;
  /**
   * Identity on target platform.  Username or database primary key
   * (prefer, usually digits).  e.g. `Twitter` has this digits-like
   * user ID thing.
   */
  identity: Scalars['String'];
  /** Neighbor identity from current. Flattened. */
  neighbor: Array<IdentityRecord>;
  neighborWithTraversal: Array<ProofRecord>;
  /**
   * NFTs owned by this identity.
   * For now, there's only `platform: ethereum` identity has NFTs.
   */
  nft: Array<HoldRecord>;
  /**
   * Platform.  See `avaliablePlatforms` or schema definition for a
   * list of platforms supported by RelationService.
   */
  platform: Platform;
  /** URL to target identity profile page on `platform` (if any). */
  profileUrl?: Maybe<Scalars['String']>;
  /** Status for this record in RelationService. */
  status: Array<DataStatus>;
  /**
   * When it is updated (re-fetched) by us RelationService.
   * Second-based unix timestamp.
   * Managed by us.
   */
  updatedAt: Scalars['Int'];
  /**
   * UUID of this record.  Generated by us to provide a better
   * global-uniqueness for future P2P-network data exchange
   * scenario.
   */
  uuid?: Maybe<Scalars['String']>;
};


export type IdentityRecordNeighborArgs = {
  depth?: InputMaybe<Scalars['Int']>;
};


export type IdentityRecordNeighborWithTraversalArgs = {
  depth?: InputMaybe<Scalars['Int']>;
};

/**
 * All identity platform.
 * TODO: move this definition into `graph/vertex/identity`, since it is not specific to upstream.
 */
export enum Platform {
  /** Ethereum wallet `0x[a-f0-9]{40}` */
  Ethereum = 'ethereum',
  /** Github */
  Github = 'github',
  /** Keybase */
  Keybase = 'keybase',
  /** NextID */
  Nextid = 'nextid',
  /** Twitter */
  Twitter = 'twitter',
  /** Unknown */
  Unknown = 'unknown'
}

export type ProofRecord = {
  __typename?: 'ProofRecord';
  /** When this connection is recorded in upstream platform (if platform gives such data). */
  createdAt?: Maybe<Scalars['Int']>;
  /**
   * Who collects this data.
   * It works as a "data cleansing" or "proxy" between `source`s and us.
   */
  fetcher: DataFetcher;
  /** Which `IdentityRecord` does this connection starts at. */
  from: IdentityRecord;
  /** ID of this connection in upstream platform to locate (if any). */
  recordId?: Maybe<Scalars['String']>;
  /** Data source (upstream) which provides this connection info. */
  source: Scalars['String'];
  /** Which `IdentityRecord` does this connection ends at. */
  to: IdentityRecord;
  /** When this connection is fetched by us RelationService. */
  updatedAt: Scalars['Int'];
  /**
   * UUID of this record. Generated by us to provide a better
   * global-uniqueness for future P2P-network data exchange
   * scenario.
   */
  uuid: Scalars['String'];
};

/** Base struct of GraphQL query request. */
export type Query = {
  __typename?: 'Query';
  apiVersion: Scalars['String'];
  /** List of all chains supported by RelationService. */
  availableChains: Array<Scalars['String']>;
  /** List of all Contract Categoris supported by RelationService. */
  availableNftCategoris: Array<Scalars['String']>;
  /** Returns a list of all platforms supported by RelationService. */
  availablePlatforms: Array<Scalars['String']>;
  /** Returns a list of all upstreams (data sources) supported by RelationService. */
  availableUpstreams: Array<Scalars['String']>;
  identities: Array<IdentityRecord>;
  /** Query an `identity` by given `platform` and `identity`. */
  identity?: Maybe<IdentityRecord>;
  /** Search an NFT. */
  nft?: Maybe<HoldRecord>;
  ping: Scalars['String'];
  /** Prefetch proofs which are prefetchable, e.g. SybilList. */
  prefetchProof: Scalars['String'];
  proof?: Maybe<ProofRecord>;
};


/** Base struct of GraphQL query request. */
export type QueryIdentitiesArgs = {
  identity: Scalars['String'];
  platforms: Array<Scalars['String']>;
};


/** Base struct of GraphQL query request. */
export type QueryIdentityArgs = {
  identity: Scalars['String'];
  platform: Scalars['String'];
};


/** Base struct of GraphQL query request. */
export type QueryNftArgs = {
  address?: InputMaybe<Scalars['String']>;
  category: ContractCategory;
  chain: Chain;
  id: Scalars['String'];
};


/** Base struct of GraphQL query request. */
export type QueryProofArgs = {
  uuid?: InputMaybe<Scalars['String']>;
};

export type GetTwitterUserNeighborsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetTwitterUserNeighborsQuery = { __typename?: 'Query', identity?: { __typename?: 'IdentityRecord', addedAt: number, neighborWithTraversal: Array<{ __typename?: 'ProofRecord', fetcher: DataFetcher, source: string, createdAt?: number | null, uuid: string, from: { __typename?: 'IdentityRecord', uuid?: string | null, identity: string, platform: Platform, displayName?: string | null }, to: { __typename?: 'IdentityRecord', uuid?: string | null, platform: Platform, identity: string, displayName?: string | null } }> } | null };


export const GetTwitterUserNeighborsDocument = gql`
    query getTwitterUserNeighbors($id: String!) {
  identity(platform: "twitter", identity: $id) {
    addedAt
    neighborWithTraversal(depth: 2) {
      fetcher
      source
      createdAt
      uuid
      from {
        uuid
        identity
        platform
        displayName
      }
      to {
        uuid
        platform
        identity
        displayName
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getTwitterUserNeighbors(variables: GetTwitterUserNeighborsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTwitterUserNeighborsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTwitterUserNeighborsQuery>(GetTwitterUserNeighborsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTwitterUserNeighbors', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
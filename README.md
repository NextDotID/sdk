# @nextdotid/sdk

[![Publish][publish-badge]][publish-workflow]

[publish-badge]: https://github.com/nextdotid/sdk/actions/workflows/publish.yml/badge.svg
[publish-workflow]: https://github.com/nextdotid/sdk/actions/workflows/publish.yml

[Next.ID](https://next.id) JavaScript SDK

## Features

- [Proof Client](https://github.com/nextdotid/sdk/tree/HEAD/src/proof)
- [Key-Value Client](https://github.com/nextdotid/sdk/tree/HEAD/src/kv)

## Installation

```bash
npm install @nextdotid/sdk@latest
```

- [Unstable channel](https://github.com/nextdotid/sdk/tree/HEAD/docs/UNSTABLE.md)

## Usage

```ts
import { NextIDService } from '@nextdotid/sdk'

// preset `production` and `development` named constructor
const service = NextIDService.development() // = NextIDService.production()
// get available platform list
const platforms = await service.getAvaiabilePlatformList()
// get a binder instance, the binder pre-fill `platform`, `identity` and `public_key` on api call
const binder = service.createBinder({
  platform: 'platform code',
  identity: 'identity',
  public_key: 'your public key',
})
// key-value service
const { proofs } = await binder.get() // get all proofs
// proof service
const proof = await binder.bindProof('create')
```

## LICENSE

[MIT](LICENSE)

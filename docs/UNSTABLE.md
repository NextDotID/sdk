# Unstable channel

Publish Page: <https://github.com/nextdotid/sdk/packages/1398276>

1. unstable version publish to github package
1. `npm.next.id` is tokenless github package registry agenter
1. If **long-term** use unstable channel please select [Recommend Usage Method](#recommend-usage-method),\
   If **experimental** use unstable channel please select [Temporary Usage Method](#temporary-usage-method)

## Recommend Usage Method

Write into `.npmrc` on project root

```plain
@nextdotid:registry=https://npm.next.id
```

Add package:

```bash
npm install @nextdotid/sdk
```

## Temporary Usage Method

```plain
npm install @nextdotid/sdk@latest --registry https://npm.next.id
```

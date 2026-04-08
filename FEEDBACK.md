# Developer Feedback: Building on Arkiv (SDK v0.6.3)

I built [**JobArchive**](https://github.com/leohhhn/jobarchive) — a decentralized job board — on top of the Arkiv SDK. Creates, queries, and manages job posting entities on the Kaolin testnet. This was quite a simple application given the timeframe and scope, so I did not get to explore all of the features of the SDK yet.

---

## Litepaper

I would recommend keeping a README.md version of the litepaper on GitHub - especially if it's listed upfront on the page for the reader to click on. This will allow for easy updating and management of the document, fixing some of the minor items, such as:

- The comparison table on page 11 has "Customizable" column items but it's not clear what that means in context — customizable how, compared to what? Some more data would be useful (even though this is a litepaper).
- The Pectra upgrade has already shipped, so references to it as upcoming are outdated.
- etc

---

## Explorer & Faucet

**Explorer** was slow and sometimes wouldn't load at all during testing. I'm assuming it's running on a light machine setup, but it's a thing to keep in mind for the upcoming period when more users join the community.

It would also help if the explorer could automatically detect whether a hash is a transaction or an entity and redirect accordingly — right now you have to know which URL format to use. Not sure if this is technically possible, haven't looked into the format of entity key vs transaction hash.

**Faucet** had a few issues:

- Captcha failed me a few times - I had to re-do it. Not necessarily Akriv's fault but it was a small friction point.
- The page automatically tries to connect your wallet, which felt unexpected and unnecessary - this would be better as a manual option for the user
- The UI shows "ETH" instead of "GLM" (or whatever is the actual network token - this was unclear to me initially)
- No feedback after a successful send — a link to the transaction on the explorer or similar could help

---

## SDK Pain Points

### Block-based expiration leaks through the abstraction

Expiration is stored as a block number, not a timestamp. Every app that wants to display expiry in human-readable time has to do this math themselves:

```ts
const expiresAt =
  (currentBlockTime + (expiresAtBlock - currentBlock) * blockDuration) * 1000;
```

A utility like `entityExpiresAt(entity, timing): Date` or similar could be a good addition to the SDK.

### No full-text search

Filtering on exact attribute values works fine. But there's no way to query on free-text fields — title, company name, etc. — at the protocol level. Everything has to be fetched first and filtered client-side. A `contains` or `startsWith` operator would fix this.

### No app namespacing

There's no way to isolate one app's entities from everything else on the network. The workaround is manually tagging every entity with a sentinel attribute and including it in every query:

```ts
eq('JobArchiveTest4_project', 'JobArchiveTest4');
```

It works, but it's easy to forget and produces ugly attribute keys. An `appId` concept at client creation that scopes reads and writes automatically would be much cleaner.

A namespace system, where users can register a name under which they can have folders and app paths could be an interesting approach.

### Features of the SDK are not easily discoverable

The query builder has `orderBy`, `count()`, cursor pagination, and `validAtBlock` — none of which were obvious from the docs or type hints. Ended up sorting client-side and using a hard fetch limit, both of which were unnecessary. A query cookbook or richer JSDoc examples would have helped.

Generally, a feeling I got was that it was easier for me to dig in the SDK code than to explore the docs. More complex examples and use cases should be more easily accessible and visible to developers.

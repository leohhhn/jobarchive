# Developer Feedback: Building on Arkiv (SDK v0.6.3)

I built [**JobArchive**](https://github.com/leohhhn/jobarchive) — a decentralized job board — on top of the Arkiv SDK. Creates, queries, and manages job posting entities on the Kaolin testnet. This was quite a simple application given the timeframe and scope, so I did not get to explore all of the features of the SDK yet. Below is a list of items that stood out during the process of creating this app, starting from the litepaper and docs to the code itself.

---

## Litepaper

I would recommend keeping a Markdown version of the litepaper on GitHub - especially if it's listed upfront on the page for the reader to click on. This will allow for easy updating and management of the document, fixing some of the minor items, such as:

- The comparison table on page 11 has "Customizable" column items but it's not clear what that means in context — customizable how, compared to what? Some more data would be useful (even though this is a litepaper).
- ie, the Pectra upgrade has already shipped, so references to it as upcoming are outdated.
- etc

IMHO, listing "Developer Docs" on the home page instead of the "Read Litepaper" would be more appealing to devs and users.

---

## Explorer & Faucet

**Explorer** was slow and sometimes wouldn't load at all during testing. I'm assuming it's running on a light machine setup, but it's a thing to keep in mind for the upcoming period when more users join the community.

It would also help if the explorer could automatically detect whether a hash is a transaction or an entity and redirect accordingly — right now you have to know which URL format to use. Not sure if this is technically possible, haven't looked into the format of entity key vs transaction hash.

Rosario link on the main page under "Test DB-chains" is broken/dead. A dead link linter would help with this.

**Faucet** had a few issues:

- Captcha failed me a few times - I had to re-do it. Not necessarily Akriv's fault but it was a small friction point.
- The page automatically tries to connect your wallet, which felt unexpected and unnecessary - this would be better as a manual option for the user
- The UI shows "ETH" instead of "GLM" (or whatever is the actual network token - this was unclear to me initially)
- No feedback after a successful send — a link to the transaction on the explorer or similar could help

---

## SDK & Docs Pain Points

### Block-based expiration leaks through the abstraction

Expiration is stored as a block number, not a timestamp. Every app that wants to display expiry in human-readable time has to do math to calculate the proper expiration time. A utility like `entityExpiresAt(entity, timing): Date` or similar could be a good addition to the SDK.

### No full-text search

Filtering on exact attribute values works fine. But there's no way to query on free-text fields — title, company name, etc. — at the protocol level. Everything has to be fetched first and filtered client-side. A `contains` or `startsWith` operator could fix this if it's feasible.

### No app namespacing

There's no way to isolate one app's entities from everything else on the network. The workaround is manually tagging every entity with a sentinel attribute and including it in every query:

```ts
eq('project', 'JobArchiveTest4');
```

It works, but it's easy to forget and produces ugly attribute keys that might already be used in a previous app. An `appId` concept at client creation that scopes reads and writes automatically would be much cleaner.

Another idea - a namespace system, where users can register a name under which they can have folders and app paths could be an interesting approach, although it also comes with its own drawbacks, ie namespace squatting.

### Features of the SDK could be more easily discoverable

The query builder has `orderBy`, `count()`, cursor pagination, and `validAtBlock` — none of which were super obvious from the docs or getting started examples. I ended up sorting client-side and using a hard fetch limit at first, both of which were unnecessary. A query cookbook or richer, more focused docs examples would have helped. Seeing full examples in some docs pages seemed like a large wall - I felt I needed to dive into a whole project just to check out how some things were done - database storage examples with snippets of how they would be done via Arkiv would be a good approach.

Another idea that passed my mind during the ideation phase was building a Web3 app using both Ethereum Mainnet + Arkiv as a storage solution (ie an NFT marketplace). I couldn't easily find an example of this - and since the timeframe for working on this was short, I decided to go Arkiv-only. One of the items I was wondering was the problem of having to sign multiple transactions (ie one on Ethereum and one on Arkiv) to say, upload your own NFT.

### Docs

Generally, the docs seem a bit over the place - there is a getting started section, which is seemingly not part of the docs (separate page, separate part of the website), and there are the "docs". I believe a unified docs.arkiv.network site would be a solid approach. I would like to see something like (simplified):

- `Core Concepts` - SDK-agnostic
- `Getting started` - per-SDK - with a full example app
- `Stack` - how it works under the hood
- `Limitations` - what is impossible compared to a standard DB SDK, etc
- `Good practices` - whats different from a standard DB approach, what to watch out for as a user/developer, etc
- `API Reference`
- etc.

Also, docs searchability itself could be improved. A search bar using Meilisearch or similar docs scraper would improve the experience a lot.

Finally, a feeling I got was that it was easier for me to dig in the SDK code than to explore the docs. I believe more complex examples and use cases should be more easily accessible and visible to developers.

Small things like having the docs link directly in the navbar - and displaying the docs instead of the litepaper on the Dev Portal seem like good ideas.

### Local development

I am generally a proponent of not spamming testnets with garbage data which I did quite often during this mini-project. A local development kit could be a good next step. One good binary that would allow the developer to spin up a local testnet and a few other tools would be of great use down the line with many users.

## Final remarks

Given the scope and time given for this task, generally my development went smoothly. I would enjoy working on a more complex app in order to provide more detailed feedback on the dev experience as well as poking around the SDK and seeing what its pros, cons, and limitations are, in order to improve the stack.

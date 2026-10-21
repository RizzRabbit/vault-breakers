# Vault Breakers — frontend

Stake Engine web client for **Vault Breakers** (5x5 cluster pays, tumbles, spot multipliers).
Derived from Stake's official [web-sdk](https://github.com/StakeEngine/web-sdk) `apps/cluster`
sample (SvelteKit + PixiJS). The SDK packages it needs are vendored under `packages/`, so this
folder builds on its own.

```
frontend/
  apps/vault-breakers/      the game (SvelteKit app)
    src/game/config.ts      max win, max spot multiplier, bet modes, paytable, free-spin awards
    src/game/meta.ts        bet-mode cards (buy menu), paytable + rules text, built from config
    src/mock/               offline mock RGS + sample books
  packages/                 vendored Stake web-sdk packages (rgs-requests, state-shared, ...)
```

## Run

Requires Node 20+ and pnpm 10 (`corepack enable`; if corepack can't write its cache, set
`COREPACK_HOME=$HOME/.corepack`).

```bash
cd frontend
pnpm install
pnpm build            # -> apps/vault-breakers/build (static site)
pnpm dev              # dev server on http://localhost:3001
```

### Offline / mock mode

Open the game with `?mock=true` (or with no `rgs_url` at all), e.g.
`http://localhost:3001/?mock=true`. The mock RGS (`src/mock/mockRgs.ts`) answers
authenticate / play / end-round / bet-event / replay locally from the books in `src/mock/`,
starting with a $1,000 balance. Books are served in order per mode. `&book=wincap` forces the
10,000x book on any round.

| Mode  | Book | Origin |
|-------|------|--------|
| BASE  | `base_sample.json`  | copied from `math/samples/` |
| BONUS | `bonus_sample.json` | copied from `math/samples/` |
| ANTE  | `ante_mock.json`    | **synthetic**: base sample relabelled (no ante sample from math yet) |
| SUPER | `super_mock.json`   | **synthetic**: bonus sample + super-buy x2 `updateGrid` + Vault Meter events |
| any (`&book=wincap`) | `wincap_mock.json` | **synthetic**: bonus sample truncated and capped at 10,000x |

The client never decides outcomes; everything shown comes from books (mock or RGS).

### Live (Stake RGS)

Launched by Stake with the usual URL params, kept from the SDK:
`sessionID`, `rgs_url`, `lang`, `currency`, `device`, `social`, `demo`. Calls
`/wallet/authenticate`, `/wallet/play`, `/wallet/end-round`, `/bet/event`.
Replay: `?replay=true&rgs_url=…&game=…&version=…&mode=…&event=…&amount=…`
(`/bet/replay/{game}/{version}/{mode}/{event}`).

## Bet modes (`config.ts`)

| key | RGS mode | cost | notes |
|---|---|---|---|
| base  | BASE  | 1x    | |
| ante  | ANTE  | 1.25x | "activate" toggle; info text says ~1.2x scatter chance (display only) |
| bonus | BONUS | 100x  | buy, with confirm dialog |
| super | SUPER | 400x  | buy, every spot starts at x2 |

Max win 10,000x, max spot multiplier x128. The math repo names modes `base`/`ante`/`bonus`/`super`;
the client sends upper-case keys (SDK convention). Check the RGS mode names match on publish.

## Features

Grid with tumble animation, per-cell multiplier overlay (marked = frame, x2…x128 = frame + value),
cluster win amounts (base pay × sum of spot multipliers), tumble win counter, win counter and
big-win tiers (book `winLevel` 1–10), free-spins intro / counter / outro, retrigger, Vault Meter
(free spins only), buy menu with confirm, bet +/- and bet menu, autoplay, turbo, sound toggle,
paytable and rules modals, resume of unfinished rounds.

## Event schema (what the client consumes)

Amounts are bet multiples × 100 (`50` = 0.5x). Positions in `winInfo`, `tumbleBoard`,
`freeSpinTrigger` index into the **padded** board: `reveal.board` is 5 reels × 7 rows, row 0 and
row 6 are padding, visible rows are 1–5. `gridMultipliers` is `[reel][row]` 5×5, 0-based
(visible row r = grid row r-1). 0 = unmarked, 1 = marked (counts x1), 2…128 = multiplier.

| type | fields |
|---|---|
| `reveal` | `board[reel][row]` of `{name, wild?, scatter?}`, `paddingPositions`, `gameType` (`basegame`/`freegame`), `anticipation` |
| `winInfo` | `totalWin`, `wins[]: {symbol, clusterSize, win, positions[], meta:{globalMult, clusterMult, winWithoutMult, overlay}}` |
| `updateTumbleWin` | `amount` |
| `updateGrid` | `gridMultipliers` |
| `tumbleBoard` | `explodingSymbols[]`, `newSymbols[reel][]` |
| `setWin` | `amount`, `winLevel` (number 1–10) |
| `setTotalWin` | `amount` |
| `freeSpinTrigger` / `freeSpinRetrigger` | `totalFs`, `positions[]` |
| `updateFreeSpin` | `amount` (current), `total` |
| `freeSpinEnd` | `amount`, `winLevel` |
| `finalWin` | `amount` |
| `wincap` | `amount` |
| `vaultMeterUpdate` (provisional) | `meter`, `nextThreshold` (10/20/30 or null) |
| `vaultMeterUpgrade` (provisional) | `meter`, `position {reel,row}` (**0-based grid index**), `oldMultiplier`, `newMultiplier`, `gridMultipliers` |

For robustness the client also accepts the names currently written in `math/EVENTS.md`
(`setTumbleWin`, `updateFreeSpin.currentFs/totalFs`, `freeSpinEnd.totalWin`, `enterBonus`).

### Provisional events

`vaultMeterUpdate` / `vaultMeterUpgrade` were agreed with the backend and are documented in
`math/EVENTS.md` (#15, #16), but no real sample book contains them yet. The UI is exercised by
the synthetic `super_mock.json` (meter pre-seeded at 3 so the 10 threshold is reached).
Replace with real `super` books from the math SDK when available.

## Tests

The mock playthrough was run headless (Playwright + Chrome) against `build/`: base, ante, bonus
buy (via buy menu + confirm) and super buy all played end to end with no console errors.
`window.__VB_ROUNDS__` / `__VB_TEST__` are small mock-mode hooks used by that test.

## Known gaps

- Art and sounds are the SDK sample's mining theme as placeholders (H1–H4 → Gold Bar, Diamond,
  Ruby, Emerald in the paytable text only). Symbol art, vault theme and logo still to do.
- The bottom board row sits partly behind the bet bar on 16:9 desktop; layout needs a pass.
- No real `ante`, `super` or wincap books yet (synthetic fixtures above).
- `pnpm build` uses `scripts-build.mjs` to exit once the static site is written, because
  `vite build` otherwise hangs (a sass-embedded child process keeps Node alive).

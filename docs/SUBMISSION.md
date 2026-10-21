# Vault Breakers – Stake Engine Submission Checklist

Covers everything outside the math and frontend code. Status: **done**, **missing**, or **owner: X**. "unconfirmed" = not found in official docs as of 2026-10-21; verify in the Stake Engine dashboard (Studio/ACP).

Sources:
- [CORE] https://stakeengine.org/docs/approval-guidelines
- [CHECK] https://stakeengine.org/docs/approval-guidelines/submission-checklist (page says "still being built")
- [OVR] https://stake-engine.com/docs
- [RGS] https://stakeengine.org/docs/rgs
- [FMT] https://stakeengine.github.io/math-sdk/rgs_docs/data_format/
- [QS] https://stakeengine.github.io/math-sdk/math_docs/quickstart/
- [GF] https://stakeengine.github.io/math-sdk/math_docs/overview_section/game_format/
- [3P] https://bottlecapgaming.com/blog/stake-engine-approval-2026/ (third-party, NOT official; treat as unconfirmed)

## 1. Game metadata
| Item | Status | Source |
|---|---|---|
| Game title "Vault Breakers", original and IP-clean | owner: user (confirm no name conflict) | [CORE] |
| Team / provider name follows IP law | owner: user | [CORE] |
| Short promotional blurb (theme + mechanics) with the review request | missing, owner: Slot Mechanics Integration Expert (draft), user (submit) | [CORE] |
| Game description tag | missing, owner: user (pick in dashboard) | [CORE] |
| Thumbnail / cover art sizes and formats | unconfirmed, owner: Frontend Slot Dev once specs are known | not documented |
| No Stake Engine branding or other platforms' themes in assets | owner: Frontend Slot Dev | [CORE] |

## 2. Rules and paytable
| Item | Status | Source |
|---|---|---|
| Player rules page (`docs/RULES.md`) | done (placeholders), owner: Slot Mechanics Integration Expert | – |
| Rules/texts checked in functional review | unconfirmed (3P only) | [3P] |
| Paytable screen from final paytable | owner: Frontend Slot Dev (data from Slot Expert) | – |
| Required rules wording/format | unconfirmed | [CHECK] |
| Social/regulated market language requirements | unconfirmed (referenced but not published); test with social mode in play modal | [CORE] |

## 3. Disclosures
| Item | Status | Source |
|---|---|---|
| RTP per mode (base/ante/bonus/super) | missing, numbers from Stake-engine Backend Expert after rebuild | [GF] (RTP set per BetMode) |
| Max win (10,000x) per mode | missing until rebuild confirms, owner: Stake-engine Backend Expert | [GF] (`max_win` per BetMode) |
| Malfunction-voids clause | done in RULES.md; requirement itself unconfirmed | not documented |
| RTP range 90.0%–96.70% per mode, ≤10M outcomes per mode | unconfirmed (3P only); 96.2% would pass | [3P] |

## 4. Game restrictions
| Item | Status | Source |
|---|---|---|
| Stateless: no jackpots, gamble, continuation, early cashout | done per DESIGN.md (Vault Meter resets per round; confirm Slot Expert) | [CORE] |
| No child-appealing art | owner: Frontend Slot Dev | [CORE] |
| Original game, not licensed/pre-purchased | owner: user | [CORE] |
| All assets copyright-clean | **missing**: 155 sample-game assets remain (`/workspace/vb-release/sample-asset-audit.txt`), owner: Frontend Slot Dev | [CORE] |

## 5. Frontend / RGS build
| Item | Status | Source |
|---|---|---|
| Static web app uploaded in Studio | owner: Frontend Slot Dev (freeze fix + art pass in progress) | [OVR] |
| Served at `https://{team}.cdn.stakeengine.org/{gameID}/{version}/index.html` | owner: Frontend Slot Dev | [RGS] |
| Reads `sessionID`, `lang`, `device`, `rgs_url` from query; never hardcode `rgs_url` | owner: Frontend Slot Dev (verify) | [RGS] |
| Calls `/wallet/authenticate` first, then `/wallet/play` + `/wallet/end-round` | owner: Frontend Slot Dev (verify) | [RGS] |
| Resume from `round.event` on reload | owner: Frontend Slot Dev (verify) | [RGS] |
| Bet levels $0.01/$0.02/$0.05, sub-cent wins shown, replay links, mobile layout | unconfirmed (3P only), owner: Frontend Slot Dev | [3P] |

## 6. Math upload format
| Item | Status | Source |
|---|---|---|
| `index.json` with `modes[]` {name, cost, events, weights} | pending rebuild, owner: Stake-engine Backend Expert; review: Slot Expert. Current: base 1 / ante 1.25 / bonus 100 / super 400 | [FMT] |
| Books `*.jsonl.zst` (zstd), each line has `id`, `events`, `payoutMultiplier` | pending rebuild, owner: Stake-engine Backend Expert | [FMT] |
| Lookup CSV `id,probability,payout` as uint64; payout must match books | pending rebuild, owner: Stake-engine Backend Expert | [FMT] |
| Files taken from `library/publish_files/` | pending rebuild (`/workspace/vb-release`) | [QS] |
| Max-win outcomes present in each mode (winCap distribution) | pending rebuild, review: Slot Expert | [GF] |

## 7. Review and approval
| Item | Status | Source |
|---|---|---|
| Review request tied to one specific frontend + math version | owner: user | [CORE] |
| Game finished and publish-ready at submission | missing (math, art, freeze fix open) | [CORE] |
| No math/mode/mechanic changes after approval (small visual fixes only) | note: lock everything first | [CORE] |
| Rating round (3 reviewers, threshold 6/9) then functional review | unconfirmed (3P only) | [3P] |
| Official submission checklist | unconfirmed: page not published yet | [CHECK] |

## 8. Dashboard upload steps
| Step | Status | Source |
|---|---|---|
| Code pushed to github.com/RizzRabbit/vault-breakers | owner: Cursor Integration Expert (after checks pass) | – |
| Sign in to Stake Engine Studio/ACP | owner: user | [OVR], [GF] |
| Upload math version (directory containing `index.json`) | owner: user | [FMT], [QS] |
| Upload frontend build | owner: user | [OVR] |
| Test in play modal (incl. social mode) | owner: user | [CORE] |
| Submit review with blurb + description tag | owner: user | [CORE] |
| Exact dashboard click path | unconfirmed | not documented |

## Bet levels

Stake Engine's docs do not require fixed bet levels such as $0.01/$0.02/$0.05; that claim is third-party only. Bet levels are supplied by the RGS at runtime: `/wallet/authenticate` returns `config.minBet`, `maxBet`, `stepBet`, `defaultBetLevel` and `betLevels` (integer units, 1,000,000 = 1.00), set per operator and jurisdiction (https://raw.githubusercontent.com/StakeEngine/ts-client/refs/heads/main/dist/types.d.ts; https://stakeengine.org/docs/rgs). Our frontend already builds its bet options from that response (`vb-frontend/frontend/packages/components-shared/src/components/Authenticate.svelte:63`; schema at `packages/rgs-fetcher/src/schema.ts:205-213`). The hardcoded list in `apps/vault-breakers/src/mock/mockRgs.ts:46-50` is only for local mocks. Action: none in code; the game must accept whatever levels the RGS sends. Open question for the user to confirm with Stake if needed.

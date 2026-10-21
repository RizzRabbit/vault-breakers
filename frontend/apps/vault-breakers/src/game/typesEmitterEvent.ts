import type { EmitterEventBoard } from '../components/Board.svelte';
import type { EmitterEventBoardFrame } from '../components/BoardFrame.svelte';
import type { EmitterEventClusterWinAmounts } from '../components/ClusterWinAmounts.svelte';
import type { EmitterEventTumbleBoard } from '../components/TumbleBoard.svelte';
import type { EmitterEventTumbleWinAmount } from '../components/TumbleWinAmount.svelte';
import type { EmitterEventFreeSpinIntro } from '../components/FreeSpinIntro.svelte';
import type { EmitterEventFreeSpinCounter } from '../components/FreeSpinCounter.svelte';
import type { EmitterEventFreeSpinOutro } from '../components/FreeSpinOutro.svelte';
import type { EmitterEventWin } from '../components/Win.svelte';
import type { EmitterEventSound } from '../components/Sound.svelte';
import type { EmitterEventMultiplierGrid } from '../components/MultiplierGrid.svelte';
import type { EmitterEventVaultMeter } from '../components/VaultMeter.svelte';
import type { EmitterEventTransition } from '../components/Transition.svelte';
import type { EmitterEventMaxWin } from '../components/MaxWin.svelte';
import type { EmitterEventVaultFly } from '../components/VaultFly.svelte';

// legacy global-multiplier events (still broadcast by the handlers; no listener in Vault Breakers)
type EmitterEventGlobalMultiplier =
	| { type: 'globalMultiplierShow' }
	| { type: 'globalMultiplierHide' }
	| { type: 'globalMultiplierUpdate'; multiplier: number };

export type EmitterEventGame =
	| EmitterEventBoard
	| EmitterEventBoardFrame
	| EmitterEventClusterWinAmounts
	| EmitterEventTumbleBoard
	| EmitterEventTumbleWinAmount
	| EmitterEventWin
	| EmitterEventFreeSpinIntro
	| EmitterEventFreeSpinCounter
	| EmitterEventFreeSpinOutro
	| EmitterEventSound
	| EmitterEventMultiplierGrid
	| EmitterEventTransition
	| EmitterEventVaultMeter
	| EmitterEventMaxWin
	| EmitterEventVaultFly
	| EmitterEventGlobalMultiplier;

<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, REM } from 'pixi-svelte';
	import { stateModal } from 'state-shared';

	import { UI } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';

	import { getContext } from '../game/context';
	import VbLogo from './VbLogo.svelte';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import Sound from './Sound.svelte';
	import Background from './Background.svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import StudioSplash from './StudioSplash.svelte';
	import BoardFrame from './BoardFrame.svelte';
	import MultiplierGrid from './MultiplierGrid.svelte';
	import Board from './Board.svelte';
	import Anticipations from './Anticipations.svelte';
	import ScatterTierBanner from './ScatterTierBanner.svelte';
	import ClusterWinAmounts from './ClusterWinAmounts.svelte';
	import TumbleBoard from './TumbleBoard.svelte';
	import TumbleWinAmount from './TumbleWinAmount.svelte';
	import Win from './Win.svelte';
	import FreeSpinIntro from './FreeSpinIntro.svelte';
	import FreeSpinCounter from './FreeSpinCounter.svelte';
	import FreeSpinOutro from './FreeSpinOutro.svelte';
	import Transition from './Transition.svelte';
	import VaultMeter from './VaultMeter.svelte';
	import GameRules from './GameRules.svelte';
	import MaxWin from './MaxWin.svelte';
	import VaultFly from './VaultFly.svelte';

	const context = getContext();

	onMount(() => (context.stateLayout.showLoadingScreen = true));

	context.eventEmitter.subscribeOnMount({
		buyBonusConfirm: () => {
			stateModal.modal = { name: 'buyBonusConfirm' };
		},
	});
</script>

<App>
	<EnableSound />
	<EnableHotkey />
	<EnableGameActor />
	<EnablePixiExtension />

	<Background />

	{#if context.stateLayout.showLoadingScreen}
		<LoadingScreen onloaded={() => (context.stateLayout.showLoadingScreen = false)} />
	{:else}
		<ResumeBet />
		<!--
			The reason why <Sound /> is rendered after clicking the loading screen:
			"Autoplay with sound is allowed if: The user has interacted with the domain (click, tap, etc.)."
			Ref: https://developer.chrome.com/blog/autoplay
		-->
		<Sound />

		<MainContainer>
			<BoardFrame />
		</MainContainer>

		<MainContainer>
			<MultiplierGrid layer="frames" />
		</MainContainer>

		<MainContainer>
			<Board />
			<Anticipations />
			<ScatterTierBanner />
			<TumbleWinAmount />
		</MainContainer>

		<MainContainer>
			<TumbleBoard />
		</MainContainer>

		<MainContainer>
			<MultiplierGrid layer="labels" />
			<ClusterWinAmounts />
		</MainContainer>

		<UI>
			{#snippet gameName()}
				<VbLogo x={REM * 3.4} y={REM * 1.25} scale={REM * 0.016} />
			{/snippet}
			{#snippet logo()}
				<!-- brand mark lives in the game-name slot (VbLogo) -->
			{/snippet}
		</UI>
		<Win />
		<FreeSpinIntro />
		<!-- every layout; portrait places it above the board next to the Vault Meter -->
		<FreeSpinCounter />
		<VaultMeter />
		<VaultFly />
		<FreeSpinOutro />
		<MaxWin />
		<Transition />

	{/if}
</App>

<StudioSplash />

<Modals>
	{#snippet version()}
		{#if stateModal.modal?.name === 'gameRules'}
			<GameRules view="rules" />
		{:else if stateModal.modal?.name === 'payTable'}
			<GameRules view="paytable" />
		{/if}
		<GameVersion version="0.0.0" />
	{/snippet}
</Modals>

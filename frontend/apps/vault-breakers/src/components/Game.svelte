<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Text, REM } from 'pixi-svelte';
	import { stateModal } from 'state-shared';

	import { UI, UiGameName } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';

	import { getContext } from '../game/context';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import Sound from './Sound.svelte';
	import Background from './Background.svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import BoardFrame from './BoardFrame.svelte';
	import MultiplierGrid from './MultiplierGrid.svelte';
	import Board from './Board.svelte';
	import Anticipations from './Anticipations.svelte';
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
				<UiGameName name="VAULT BREAKERS" />
			{/snippet}
			{#snippet logo()}
				<!-- portrait: the clock + game name already fill the narrow header; skip the duplicate title -->
				{#if context.stateLayoutDerived.layoutType() !== 'portrait'}
				<Text
					anchor={{ x: 1, y: 0 }}
					text="VAULT BREAKERS"
					style={{
						fontFamily: 'proxima-nova',
						fontSize: REM * 1.5,
						fontWeight: '600',
						lineHeight: REM * 2,
						fill: 0xffffff,
					}}
				/>
				{/if}
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

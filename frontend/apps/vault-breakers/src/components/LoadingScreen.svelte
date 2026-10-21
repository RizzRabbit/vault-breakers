<script lang="ts">
	import { Container, Sprite, Text } from 'pixi-svelte';
	import VbLogo from './VbLogo.svelte';
	import { FadeContainer, LoadingProgress } from 'components-pixi';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import TransitionAnimation from './TransitionAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';

	type Props = {
		onloaded: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	let loadingType = $state<'start' | 'transition'>('start');
</script>

<!-- logo and loading progress -->
<FadeContainer show={loadingType === 'start'}>
	<MainContainer>
		<Container
			x={context.stateLayoutDerived.mainLayout().width * 0.5}
			y={context.stateLayoutDerived.mainLayout().height * 0.5}
		>
			{@const k = Math.min(1.6, context.stateLayoutDerived.mainLayout().width / 620)}
			<VbLogo x={-60 * k} y={-40} scale={k} />
			<Text
				anchor={{ x: 0.5, y: 0 }}
				y={130}
				text="a Rizzin Games production"
				style={{ fontFamily: 'proxima-nova', fontSize: 30, fontStyle: 'italic', fill: 0x7ff7ec, letterSpacing: 2 }}
			/>
			{#if !context.stateApp.loaded}
				<LoadingProgress y={250} width={1967 * 0.2} height={346 * 0.2}>
					{#snippet background(sizes)}
						<Sprite key="vb_progress_bg" {...sizes} />
					{/snippet}
					{#snippet progress(sizes)}
						<Sprite key="vb_progress_bar" {...sizes} />
					{/snippet}
					{#snippet frame(sizes)}
						<Sprite key="vb_progress_frame" {...sizes} />
					{/snippet}
				</LoadingProgress>
			{/if}
		</Container>
	</MainContainer>
</FadeContainer>

<!-- press to continue -->
<FadeContainer show={loadingType === 'start' && context.stateApp.loaded}>
	<PressToContinue onpress={() => (loadingType = 'transition')} />
</FadeContainer>

<!-- transition between the loading screen and the game -->
<FadeContainer show={loadingType === 'transition'}>
	<TransitionAnimation oncomplete={props.onloaded} />
</FadeContainer>

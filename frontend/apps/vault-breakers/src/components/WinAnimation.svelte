<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { backOut } from 'svelte/easing';

	import { BitmapText, Container, Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';

	type Props = {
		animationMap: {
			intro: 'big_win_intro' | 'epic_win_intro' | 'max_win_intro' | 'mega_win_intro' | 'super_win_intro';
			idle: 'big_win_idle' | 'epic_win_idle' | 'max_win_idle' | 'mega_win_idle' | 'super_win_idle';
			outro: 'big_win_exit' | 'epic_win_exit' | 'max_win_exit' | 'mega_win_exit' | 'super_win_exit';
		};
		children: Snippet;
	};

	// Code-drawn big-win banner: Vault Breakers plaque + tier title, pop-in then gentle pulse.
	const props: Props = $props();
	const context = getContext();
	const TITLES = {
		big_win_intro: 'BIG HAUL',
		super_win_intro: 'HUGE HAUL',
		mega_win_intro: 'MEGA HEIST',
		epic_win_intro: 'EPIC HEIST',
		max_win_intro: 'LEGENDARY HEIST',
	} as const;
	const title = $derived(TITLES[props.animationMap.intro]);
	const width = $derived(context.stateGameDerived.boardLayout().width * 1.25);
	const height = $derived((width / (1139 / 359)) * 1.7);

	const pop = new Tween(0.3, { duration: 450, easing: backOut });
	let pulse = $state(1);
	let raf = 0;
	onMount(() => {
		pop.set(1);
		const tick = (now: number) => {
			pulse = 1 + 0.03 * Math.sin(now / 180);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<Container scale={pop.current * pulse}>
	<Sprite key="vb_plaque" anchor={0.5} {width} {height} />
	<BitmapText
		anchor={0.5}
		y={-height * 0.24}
		text={title}
		style={{ fontFamily: 'gold', fill: 0xffffff, fontSize: height * 0.22 }}
	/>
	<Container y={height * 0.1} scale={0.3}>
		{@render props.children()}
	</Container>
</Container>

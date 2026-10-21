<script lang="ts">
	import { onMount } from 'svelte';
	import { Container, Rectangle, Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';

	type Props = {
		oncomplete: () => void;
	};

	// Code-drawn transition: navy curtain fades in while the vault door spins in, then fades out.
	const props: Props = $props();
	const context = getContext();
	const DURATION = 1100;

	let t = $state(0);
	onMount(() => {
		let raf = 0;
		let done = false;
		const start = performance.now();
		const tick = (now: number) => {
			t = Math.min(1, (now - start) / DURATION);
			if (t < 1) raf = requestAnimationFrame(tick);
			else if (!done) {
				done = true;
				props.oncomplete();
			}
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	const alpha = $derived(t < 0.5 ? t / 0.35 : (1 - t) / 0.35);
	const size = $derived(
		Math.min(
			context.stateLayoutDerived.canvasSizes().width,
			context.stateLayoutDerived.canvasSizes().height,
		) * (0.4 + 0.25 * t),
	);
</script>

<Rectangle
	{...context.stateLayoutDerived.canvasSizes()}
	backgroundColor={0x07101f}
	backgroundAlpha={Math.min(1, alpha)}
/>
<Container
	x={context.stateLayoutDerived.canvasSizes().width * 0.5}
	y={context.stateLayoutDerived.canvasSizes().height * 0.5}
	rotation={t * Math.PI * 2}
	alpha={Math.min(1, alpha)}
>
	<Sprite key="vb_s" anchor={0.5} width={size} height={size} />
</Container>

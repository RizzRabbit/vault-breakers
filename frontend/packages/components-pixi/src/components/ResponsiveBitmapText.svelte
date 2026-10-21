<script lang="ts">
	import { Container, BitmapText, type BitmapTextProps } from 'pixi-svelte';

	type Props = Omit<BitmapTextProps, 'scale' | 'onresize'> & { maxWidth: number };

	const { maxWidth, ...textProps }: Props = $props();
	let baseSizes = $state({ width: 0, height: 0 });
	const responsiveScale = $derived(maxWidth / (baseSizes.width || 1));
</script>

<Container visible={false}>
	<BitmapText {...textProps} onresize={(sizes) => (baseSizes = sizes)} />
</Container>

<Container>
	<BitmapText {...textProps} scale={Math.min(responsiveScale, 1)} />
</Container>

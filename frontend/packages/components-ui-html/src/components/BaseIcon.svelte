<script lang="ts">
	type Props = {
		width: string;
		height: string;
		background?: string;
		border?: string;
	};

	const { width, height, background = 'black', border = 'none' }: Props = $props();
</script>

<div
	class="rectangle"
	style="
	--width-value: {width};
	--height-value: {height};
	--background-value: {background};
	--border-value: {border};
"
></div>

<!-- ADD YOUR DESIGN -->

<!-- <script lang="ts">
	import { sharedAssetsHtml as assets } from 'constants-shared/assets';

	type Icon = keyof typeof assets;

	type Props = {
		icon: Icon;
		hovered?: Icon;
		pressed?: Icon;
		size?: string;
		disabled?: boolean;
	};

	const { icon, hovered, pressed, size = '1rem', disabled = false }: Props = $props();

	const defaultUrl = $derived(assets[icon] as string);
	const hoveredUrl = $derived((hovered ? assets[hovered] : defaultUrl) as string);
	const pressedUrl = $derived((pressed ? assets[pressed] : defaultUrl) as string);

	let hoveredState = $state(false);
	let pressedState = $state(false);

	const src = $derived.by(() => {
		if (disabled) return defaultUrl;
		if (hoveredState) return hoveredUrl;
		if (pressedState) return pressedUrl;
		return defaultUrl;
	});
</script>

<div
	style="width: {size}; height: {size};"
	on:mouseenter={() => (hoveredState = true)}
	on:mouseleave={() => (hoveredState = false)}
	on:mousedown={() => (pressedState = true)}
	on:mouseup={() => (pressedState = false)}
	on:pointerdown={() => (pressedState = true)}
	on:pointerup={() => (pressedState = false)}
>
	<img {src} style="width: 100%; object-fit: cover;" alt={icon} />
</div> -->

<style lang="scss">
	.rectangle {
		width: var(--width-value);
		height: var(--height-value);
		background: var(--background-value);
		border: var(--border-value);
		border-radius: 10px;
	}
</style>

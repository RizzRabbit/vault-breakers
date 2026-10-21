<script lang="ts" module>
	import { Rectangle, type RectangleProps } from 'pixi-svelte';

	export type Props = RectangleProps & { key?: string; uiHover?: boolean; uiPressed?: boolean };
</script>

<script lang="ts">
	import { uiSkin } from '../skin';

	const props: Props = $props();
	const Plate = uiSkin.plate;
	const rectProps = $derived.by(() => {
		const { key, uiHover, uiPressed, ...rest } = props;
		return rest;
	});
</script>

{#if Plate}
	<Plate {...props} />
{:else}
	<Rectangle borderRadius={50} {...rectProps} />
{/if}

<!-- ADD YOUR DESIGN -->

<!-- <script lang="ts" module>
	import { Sprite, type SpriteProps } from 'pixi-svelte';
	import type { sharedAssetsPixi } from 'constants-shared/assets';

	export type Props = SpriteProps & {
		key: keyof typeof sharedAssetsPixi;
	};
</script>

<script lang="ts">
	const props: Props = $props();
</script>

<Sprite {...props} /> -->

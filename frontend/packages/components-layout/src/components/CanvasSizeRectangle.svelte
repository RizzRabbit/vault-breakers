<script lang="ts">
	import { Rectangle, type RectangleProps } from 'pixi-svelte';
	import { getContextLayout } from 'utils-layout';

	type Props = Omit<RectangleProps, 'width' | 'height'>;

	const props: Props = $props();
	const context = getContextLayout();
</script>

<Rectangle
	{...props}
	width={context.stateLayoutDerived.canvasSizes().width}
	height={context.stateLayoutDerived.canvasSizes().height}
/>

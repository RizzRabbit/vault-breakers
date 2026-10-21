<script lang="ts">
	import { Container, Text, type ContainerProps, Rectangle, anchorToPivot } from 'pixi-svelte';
	import { getContextLayout } from 'utils-layout';

	type Props = Omit<ContainerProps, 'x' | 'y' | 'scale' | 'pivot'> & {
		debug?: boolean;
		standard?: boolean;
		alignVertical?: 'center' | 'bottom';
		alignHorizontal?: 'center' | 'left' | 'right';
	};

	const { debug, alignVertical, alignHorizontal, children, standard, ...containerProps }: Props =
		$props();
	const context = getContextLayout();

	const mainLayout = $derived.by(
		standard
			? context.stateLayoutDerived.mainLayoutStandard
			: context.stateLayoutDerived.mainLayout,
	);
	const canvasSizes = $derived.by(context.stateLayoutDerived.canvasSizes);
	const getY = () => {
		const bottomY = canvasSizes.height * 0.5 - mainLayout.height * mainLayout.scale * 0.5;
		return alignVertical === 'bottom' ? bottomY : 0;
	};
	const getX = () => {
		if (alignHorizontal === 'left')
			return -canvasSizes.width * 0.5 + mainLayout.width * mainLayout.scale * 0.5;
		if (alignHorizontal === 'right')
			return canvasSizes.width * 0.5 - mainLayout.width * mainLayout.scale * 0.5;
		return 0;
	};
	const y = $derived.by(getY);
	const x = $derived.by(getX);
</script>

<Container {x} {y}>
	<Container
		{...containerProps}
		x={mainLayout.x}
		y={mainLayout.y}
		scale={mainLayout.scale}
		pivot={anchorToPivot({
			anchor: mainLayout.anchor,
			sizes: { width: mainLayout.width, height: mainLayout.height },
		})}
	>
		{#if debug}
			<Rectangle
				width={mainLayout.width}
				height={mainLayout.height}
				alpha={0.5}
				borderWidth={2}
				borderColor={0xffffff}
			/>
		{/if}
		{@render children()}
		{#if debug}
			<Text
				text={`
layoutType: ${context.stateLayoutDerived.layoutType()}

type: ${standard ? 'standard' : 'game'}

scale: ${mainLayout.scale}

mainSizes: {
		width: ${mainLayout.width},
		height: ${mainLayout.height}
}

canvasSizes: {
		width: ${context.stateLayoutDerived.canvasSizes().width},
		height: ${context.stateLayoutDerived.canvasSizes().height}
}`}
				style={{ fill: 0xffffff }}
			/>
		{/if}
	</Container>
</Container>

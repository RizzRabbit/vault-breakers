<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { StoryPixiApp } from 'components-storybook';

	import { Container, Graphics } from 'pixi-svelte';

	const { Story } = defineMeta({
		tags: ['autodocs'],
		title: "pixi-svelte/Graphics",
		component: Graphics,
		args: {
			x: 50,
			y: 50,
			zIndex: 1,
			isMask: false,
			pivot: { x: 0, y: 0 },
		}
	});
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp assets={{}}>
			<Container>
				<Graphics
					{...args}
					draw={(graphics) => {
						graphics.rect(args.x, args.y, 150, 150);
						graphics.fill(0xde3249);
					}}
				/>

				<Graphics
					draw={(graphics) => {
						graphics.circle(250, 250, 50);
						graphics.fill(0x650a5a);
						graphics.stroke({ width: 2, color: 0xfeeb77, alpha: 1 });
					}}
				/>
		
				<Graphics
					draw={(graphics) => {
						graphics.rect(200, 50, 100, 100);
						graphics.fill(0x650a5a);
						graphics.stroke({ width: 2, color: 0xfeeb77, alpha: 1 });
					}}
				/>
		
				<Graphics
					draw={(graphics) => {
						graphics.rect(350, 50, 100, 100);
						graphics.fill(0xc34288);
						graphics.stroke({ width: 10, color: 0xffbd01, alpha: 1 });
					}}
				/>

				<Graphics
					draw={(graphics) => {
						graphics.circle(400, 250, 50);
						graphics.fill({ color: 0xc34288, alpha: 1 });
						graphics.stroke({ width: 10, color: 0xffbd01, alpha: 1 });
					}}
				/>
			</Container>

			<Graphics
				draw={(graphics) => {
					graphics.rect(530, 50, 140, 100);
					graphics.fill(0xaa4f08);
					graphics.stroke({ width: 2, color: 0xffffff, alpha: 1 });
				}}
			/>

			<Graphics
				draw={(graphics) => {
					graphics.ellipse(600, 250, 80, 50);
					graphics.fill({ color: 0xaa4f08, alpha: 1 });
					graphics.stroke({ width: 2, color: 0xffffff, alpha: 1 });
				}}
			/>

			<Graphics
				draw={(graphics) => {
					graphics.roundRect(50, 440, 100, 100, 16);
					graphics.fill({ color: 0x650a5a, alpha: 0.25 });
					graphics.stroke({ width: 2, color: 0xff00ff, alpha: 1 });
				}}
			/>

			<Graphics
				draw={(graphics) => {
					const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];
					graphics.poly(path);
					graphics.fill(0x3500fa);
				}}
			/>
		</StoryPixiApp>
	{/snippet}
</Story>

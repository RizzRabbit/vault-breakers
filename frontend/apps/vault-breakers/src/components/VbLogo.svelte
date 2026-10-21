<script lang="ts">
	// Vault Breakers wordmark: code-drawn vault door + gold/teal lettering on navy. Original art.
	type G = { [k: string]: any };
	import { Container, Graphics, Text } from 'pixi-svelte';

	type Props = { x?: number; y?: number; scale?: number };
	const { x = 0, y = 0, scale = 1 }: Props = $props();

	const NAVY = 0x0d1a2b;
	const GOLD = 0xd6a028;
	const GOLD_HI = 0xffd75a;
	const TEAL = 0x00e5d4;
	const STEEL = 0x8fa3b8;

	// door centred at (-150, 0), radius 70; wordmark to its right
	const drawDoor = (g: G) => {
		g.clear();
		g.circle(-150, 0, 74).fill(NAVY).stroke({ color: GOLD, width: 8 });
		g.circle(-150, 0, 60).stroke({ color: TEAL, width: 3 });
		for (let i = 0; i < 12; i++) {
			const a = (i / 12) * Math.PI * 2;
			g.circle(-150 + Math.cos(a) * 67, Math.sin(a) * 67, 3).fill(GOLD_HI);
		}
		for (let i = 0; i < 3; i++) {
			const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
			g.moveTo(-150, 0).lineTo(-150 + Math.cos(a) * 46, Math.sin(a) * 46).stroke({ color: STEEL, width: 8, cap: 'round' });
			g.circle(-150 + Math.cos(a) * 46, Math.sin(a) * 46, 7).fill(GOLD);
		}
		g.circle(-150, 0, 16).fill(GOLD).stroke({ color: NAVY, width: 4 });
		// bolt bar from the door into the wordmark
		g.roundRect(-82, -5, 50, 10, 4).fill(STEEL);
		// teal underline
		g.roundRect(-30, 46, 330, 6, 3).fill(TEAL);
	};
	const word = (size: number, fill: number) => ({
		fontFamily: 'proxima-nova',
		fontWeight: '900' as const,
		fontSize: size,
		fill,
		stroke: { color: NAVY, width: 8 },
		letterSpacing: 4,
	});
</script>

<Container {x} {y} {scale}>
	<Graphics draw={drawDoor} />
	<Text x={-28} y={-62} text="VAULT" style={word(56, GOLD_HI)} />
	<Text x={-28} y={-8} text="BREAKERS" style={word(46, TEAL)} />
</Container>

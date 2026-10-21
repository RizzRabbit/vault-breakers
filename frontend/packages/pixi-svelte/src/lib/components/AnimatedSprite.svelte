<script lang="ts" module>
	import * as PIXI from 'pixi.js';

	import type { OverwriteCursor } from '../types';

	export type Props = OverwriteCursor<PIXI.AnimatedSpriteOptions> & {
		animationSpeed?: PIXI.AnimatedSprite['animationSpeed'];
		loop?: PIXI.AnimatedSprite['loop'];
		play?: boolean;
	};
</script>

<script lang="ts">
	import { propsSyncEffect } from '../utils.svelte';
	import { getContextParent } from '../context.svelte';

	const props: Props = $props();

	const parentContext = getContextParent();
	const animatedSprite = new PIXI.AnimatedSprite(props.textures ?? []);

	propsSyncEffect({ props, target: animatedSprite, ignore: ['play'] });

	$effect(() => {
		if (props.play) {
			animatedSprite.gotoAndPlay(0);
		} else {
			animatedSprite.gotoAndStop(0);
		}
	});

	parentContext.addToParent(animatedSprite);
</script>

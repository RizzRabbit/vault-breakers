<script lang="ts" module>
	import * as SPINE_PIXI from '@esotericsoftware/spine-pixi-v8';

	export type Props = Partial<SPINE_PIXI.Bone> & {
		boneName: Parameters<SPINE_PIXI.Spine['skeleton']['findBone']>[0];
	};
</script>

<script lang="ts">
	import { propsSyncEffect } from '../utils.svelte';
	import { getContextSpine } from '../context.svelte';

	const props: Props = $props();
	const spine = getContextSpine();
	const bone = spine.skeleton.findBone(props.boneName);

	propsSyncEffect({ props, target: bone, ignore: ['boneName', 'y'] });
	$effect(() => {
		if (bone && props.y !== undefined) bone.y = -props.y;
	});
</script>

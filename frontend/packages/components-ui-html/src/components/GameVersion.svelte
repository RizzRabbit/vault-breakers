<script lang="ts">
	import { PUBLIC_SITE_MODE } from 'envs';

	type Props = {
		version: string; // "major.feature.patch"
	};

	const props: Props = $props();
</script>

{PUBLIC_SITE_MODE}
{props.version}

<script lang="ts">
	import { type Snippet } from 'svelte';
	import { GlobalStyle } from 'components-ui-html';
	import { Authenticate, LoaderStakeEngine, LoadI18n } from 'components-shared';
	import Game from '../components/Game.svelte';
	import { setUiSkin } from 'components-ui-pixi';
	import VbUiPlate from '../components/VbUiPlate.svelte';
	import '../vb-theme.css';
	import { setContext } from '../game/context';

	import messagesMap from '../i18n/messagesMap';
	import { registerMockRgs } from '../mock/mockRgs';
	import { applyMeta } from '../game/meta';

	// Offline mode: ?mock=true or no rgs_url -> serve real published math books (src/mock/books) locally.
	registerMockRgs();
	applyMeta();

	type Props = { children: Snippet };

	const props: Props = $props();

	const loaderUrlStakeEngine = new URL('../../stake-engine-loader.gif', import.meta.url).href;

	setContext();
	// Vault Breakers skin for the shared SDK UI (bet bar, buttons, buy menu)
	setUiSkin({ plate: VbUiPlate, buttonText: 0xffd75a, labelText: 0x7ff7ec, valueText: 0xffffff });
</script>

<GlobalStyle>
	<Authenticate>
		<LoadI18n {messagesMap}>
			<Game />
		</LoadI18n>
	</Authenticate>
</GlobalStyle>

<LoaderStakeEngine src={loaderUrlStakeEngine} />


{@render props.children()}
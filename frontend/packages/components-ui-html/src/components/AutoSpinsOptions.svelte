<script lang="ts">
	import { getContextLayout } from 'utils-layout';
	import { stateUi, AUTO_SPINS_TEXT_OPTIONS } from 'state-shared';
	import { OptionsGrid } from 'components-shared';

	import BaseIcon from './BaseIcon.svelte';
	import BaseButtonContent from './BaseButtonContent.svelte';

	const { stateLayoutDerived } = getContextLayout();
	const AUTO_SPINS_TEXT_OPTIONS_PORTRAIT = AUTO_SPINS_TEXT_OPTIONS.filter(
		(value) => value !== '1000',
	);

	const options = $derived(
		stateLayoutDerived.layoutType() === 'landscape'
			? AUTO_SPINS_TEXT_OPTIONS_PORTRAIT
			: AUTO_SPINS_TEXT_OPTIONS,
	);
</script>

<OptionsGrid
	value={stateUi.autoSpinsText}
	{options}
	onchange={(value) => (stateUi.autoSpinsText = value)}
>
	{#snippet option({ option })}
		<BaseIcon
			width="100%"
			height="2rem"
			border={option === stateUi.autoSpinsText ? '2px white solid' : '2px black solid'}
		/>
		<BaseButtonContent>
			<span style="font-size: 1rem;" class:infinity={option === '∞'} data-test="round-options">
				{option}
			</span>
		</BaseButtonContent>
	{/snippet}
</OptionsGrid>

<style lang="scss">
	.infinity {
		font-size: 1.5rem;
		line-height: 1rem;
		margin-top: 0.3rem;
	}
</style>

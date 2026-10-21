<script lang="ts" generics="TValue extends string | number">
	import type { Snippet } from 'svelte';

	type Props = {
		value: TValue;
		options: Readonly<TValue[]>;
		onchange: (value: TValue) => void;
		children: Snippet<
			[
				{
					disabledDown: boolean;
					disabledUp: boolean;
					toggleDown: () => any;
					toggleUp: () => any;
				},
			]
		>;
	};

	const props: Props = $props();

	const valueIndex = $derived(props.options.findIndex((option) => option === props.value));
	const disabledDown = $derived(valueIndex === 0);
	const disabledUp = $derived(valueIndex === props.options.length - 1);

	const toggleDown = () => props.onchange(props.options[valueIndex - 1]);
	const toggleUp = () => props.onchange(props.options[valueIndex + 1]);
</script>

{@render props.children({
	disabledDown,
	disabledUp,
	toggleDown,
	toggleUp,
})}

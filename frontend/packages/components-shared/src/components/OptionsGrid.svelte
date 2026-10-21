<script lang="ts" generics="TValue extends string | number">
	import type { Snippet } from 'svelte';

	import Button from './Button.svelte';

	type Props = {
		value: TValue;
		options: Readonly<TValue[]>;
		miniSize?: boolean;
		onchange: (value: TValue) => void;
		option: Snippet<[{ option: TValue; index: number }]>;
	};

	const props: Props = $props();
</script>

<div class="wrap">
	<div class="content-wrap">
		<div class="grid" class:miniSize={props.miniSize}>
			{#each props.options as option, index (option)}
				<Button
					onclick={() => {
						props.onchange(option);
					}}
				>
					{@render props.option({ option, index })}
				</Button>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		min-width: 20rem;
	}

	// Minimum width in portrait is 320px
	@media (orientation: portrait) {
		@media (min-width: 320px) and (max-width: 370px) {
			.wrap {
				min-width: 17rem;
			}
		}
	}

	// Minimum height in portrait is 255px
	@media (orientation: landscape) {
		@media (min-height: 255px) and (max-height: 480px) {
			.wrap {
				min-width: 23rem;
			}
		}
	}

	.content-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.grid {
		display: grid;
		gap: 0.75rem;
		place-content: center;
		grid-template-columns: repeat(3, 1fr);
	}

	@media (max-height: 480px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.miniSize {
		@media (max-width: 500px) {
			grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
		}
		@media (max-height: 500px) {
			grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
		}
	}
</style>

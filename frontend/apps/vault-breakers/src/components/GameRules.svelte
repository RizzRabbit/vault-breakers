<script lang="ts">
	import { stateBet } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';

	import {
		RULES_MD,
		parseRules,
		PAYTABLE,
		PAYTABLE_SIZES,
		FS_PAY_NOTE,
		SCATTER_TABLE,
		fillPlaceholders,
	} from '../game/rulesStrings';

	type Props = { view: 'rules' | 'paytable' };
	const props: Props = $props();
	const blocks = parseRules(RULES_MD);
	const bet = $derived(stateBet.betAmount);
</script>

<div class="vb-info">
	{#if props.view === 'paytable'}
		<h2>Paytable</h2>
		<p class="note">
			Payouts shown for the current bet of <b>{numberToCurrencyString(bet)}</b> (value x bet), by cluster
			size.
		</p>
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Symbol</th>
						{#each PAYTABLE_SIZES as size}<th>{size}</th>{/each}
					</tr>
				</thead>
				<tbody>
					{#each PAYTABLE as row (row.id)}
						<tr data-symbol={row.id}>
							<td class="sym">{row.name}</td>
							{#each row.pays as pay}
								<td title={`${pay}x bet`}>{numberToCurrencyString(pay * bet)}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="note">One paytable for all modes.</p>
		<table class="scatter">
			<thead><tr><th>VAULTs</th><th>Award (base game and Ante)</th></tr></thead>
			<tbody>
				{#each SCATTER_TABLE as row (row.count)}<tr><td>{row.count}</td><td>{fillPlaceholders(row.award)}</td></tr>{/each}
			</tbody>
		</table>
		{#if FS_PAY_NOTE}<p class="note">{fillPlaceholders(FS_PAY_NOTE)}</p>{/if}
	{:else}
		{#each blocks as block}
			{#if block.heading}
				{#if block.level === 1}<h2>{block.heading}</h2>{:else}<h3>{block.heading}</h3>{/if}
			{/if}
			{#if block.items.length}
				<ul>
					{#each block.items as item}<li>{item}</li>{/each}
				</ul>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.vb-info {
		max-width: 52rem;
		text-align: left;
		color: #e8f6ff;
		font-family: sans-serif;
	}
	h2 {
		color: #ffd75a;
		margin: 0.5rem 0 0.75rem;
	}
	h3 {
		color: #00e5d4;
		margin: 1rem 0 0.25rem;
	}
	ul {
		margin: 0;
		padding-left: 1.2rem;
		line-height: 1.45;
	}
	.note {
		opacity: 0.85;
		margin: 0.5rem 0;
	}
	.table-wrap {
		overflow-x: auto;
	}
	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.9rem;
	}
	th,
	td {
		border: 1px solid #2a3c5c;
		padding: 0.3rem 0.45rem;
		text-align: right;
	}
	th {
		color: #ffd75a;
		background: #0e1a30;
	}
	.sym {
		text-align: left;
		color: #00e5d4;
		font-weight: 700;
	}
</style>

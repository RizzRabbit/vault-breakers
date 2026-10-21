<script lang="ts">
	type G = { [k: string]: any };
	import { Graphics } from 'pixi-svelte';

	// Vault Breakers skin for the shared Pixi UI plates (registered via setUiSkin in +layout).
	// key 'bet' = spin button as a round vault dial; 'base_ticker' = recessed readout bar;
	// everything else = riveted steel plate. Code-drawn, original art.
	const {
		key,
		uiHover = false,
		uiPressed = false,
		width,
		height,
		anchor,
		backgroundColor,
		borderWidth,
		borderRadius: _r,
		backgroundAlpha: _a,
		borderColor: _c,
		borderAlpha: _ba,
		...rest
	}: Record<string, any> = $props();

	const NAVY = 0x0d1a2b;
	const DEEP = 0x07101f;
	const GOLD = 0xd6a028;
	const TEAL = 0x00e5d4;
	const STEEL = 0x8fa3b8;

	const disabled = $derived(backgroundColor === 0xaaaaaa);
	const active = $derived(!!borderWidth);
	const ax = $derived(typeof anchor === 'number' ? anchor : (anchor?.x ?? 0));
	const ay = $derived(typeof anchor === 'number' ? anchor : (anchor?.y ?? 0));

	const draw = (g: G) => {
		const w = width as number;
		const h = height as number;
		const x0 = -ax * w;
		const y0 = -ay * h;
		const glow = uiHover && !disabled ? 1 : 0;
		const press = uiPressed && !disabled ? 1 : 0;
		if (key === 'bet') {
			const r = Math.min(w, h) / 2;
			const cx = x0 + w / 2;
			const cy = y0 + h / 2;
			g.circle(cx, cy, r).fill({ color: disabled ? 0x3a4250 : GOLD });
			g.circle(cx, cy, r * 0.9).fill({ color: disabled ? 0x1e2633 : press ? DEEP : NAVY });
			g.circle(cx, cy, r * 0.78).stroke({ color: disabled ? 0x55606e : TEAL, width: r * (glow ? 0.07 : 0.05), alpha: 0.9 });
			for (let i = 0; i < 12; i++) {
				const a = (i / 12) * Math.PI * 2;
				g.moveTo(cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82)
					.lineTo(cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.88)
					.stroke({ color: disabled ? 0x55606e : GOLD, width: r * 0.03 });
			}
			return;
		}
		if (key === 'base_ticker') {
			const rad = h * 0.28;
			g.roundRect(x0, y0, w, h, rad).fill({ color: DEEP, alpha: 0.92 });
			g.roundRect(x0, y0, w, h, rad).stroke({ color: TEAL, width: 3, alpha: 0.75 });
			g.roundRect(x0 + 6, y0 + 6, w - 12, h * 0.18, rad * 0.5).fill({ color: 0xffffff, alpha: 0.05 });
			return;
		}
		const rad = Math.min(w, h) * 0.2;
		g.roundRect(x0, y0, w, h, rad).fill({ color: disabled ? 0x1e2633 : press ? DEEP : NAVY, alpha: disabled ? 0.85 : 1 });
		g.roundRect(x0 + 5, y0 + 5, w - 10, h - 10, rad * 0.75).stroke({ color: disabled ? 0x3a4250 : STEEL, width: 2, alpha: 0.5 });
		g.roundRect(x0, y0, w, h, rad).stroke({
			color: disabled ? 0x55606e : active || glow ? TEAL : GOLD,
			width: active ? 6 : glow ? 5 : 3,
		});
		if (w > 40 && h > 40) {
			const inset = rad * 0.55;
			for (const [px, py] of [[x0 + inset, y0 + inset], [x0 + w - inset, y0 + inset], [x0 + inset, y0 + h - inset], [x0 + w - inset, y0 + h - inset]])
				g.circle(px, py, Math.min(w, h) * 0.035).fill({ color: disabled ? 0x55606e : GOLD });
		}
	};
</script>

<Graphics {...rest} {draw} />

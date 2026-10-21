// Vault Breakers asset manifest. All art lives in static/assets/sprites/vaultBreakers/.
// ---- swap points -------------------------------------------------------------------------
// FONTS: BMFont .xml (+ page). Face names used in code: gold, goldblur, silver, purple.
// Files come from the fonts/audio drop (vb-release/art-audio-fonts, Oswald OFL); swap here.
const FONT_FILES = {
	gold: new URL('../../assets/fonts/vb/vb_gold.xml', import.meta.url).href,
	goldblur: new URL('../../assets/fonts/vb/vb_goldblur.xml', import.meta.url).href,
	silver: new URL('../../assets/fonts/vb/vb_silver.xml', import.meta.url).href,
	purple: new URL('../../assets/fonts/vb/vb_purple.xml', import.meta.url).href,
};
// AUDIO: howler sprite manifest (synthesized audio from the same drop).
const AUDIO_MANIFEST = new URL('../../assets/audio/vb_sounds.json', import.meta.url).href;
// --------------------------------------------------------------------------------------------

export default {
	vb_h1: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/h1.png', import.meta.url).href },
	vb_h2: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/h2.png', import.meta.url).href },
	vb_h3: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/h3.png', import.meta.url).href },
	vb_h4: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/h4.png', import.meta.url).href },
	vb_l1: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/l1.png', import.meta.url).href },
	vb_l2: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/l2.png', import.meta.url).href },
	vb_l3: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/l3.png', import.meta.url).href },
	vb_l4: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/l4.png', import.meta.url).href },
	vb_w: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/w.png', import.meta.url).href },
	vb_s: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/s.png', import.meta.url).href },
	vb_cell_frame: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/cell_frame.png', import.meta.url).href },
	vb_vault_meter_frame: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/vault_meter_frame.png', import.meta.url).href },
	vb_board_frame: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/board_frame.png', import.meta.url).href },
	vb_plaque: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/plaque.png', import.meta.url).href },
	vb_mult_x2: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/mult_x2.png', import.meta.url).href },
	vb_mult_x4: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/mult_x4.png', import.meta.url).href },
	vb_mult_x8: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/mult_x8.png', import.meta.url).href },
	vb_mult_x16: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/mult_x16.png', import.meta.url).href },
	vb_mult_x32: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/mult_x32.png', import.meta.url).href },
	vb_mult_x64: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/mult_x64.png', import.meta.url).href },
	vb_mult_x128: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/mult_x128.png', import.meta.url).href },
	vb_logo: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/logo.png', import.meta.url).href, preload: true },
	vb_bg_landscape: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/bg_landscape.jpg', import.meta.url).href, preload: true },
	vb_bg_portrait: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/bg_portrait.jpg', import.meta.url).href, preload: true },
	vb_progress_bg: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/progress_bg.png', import.meta.url).href, preload: true },
	vb_progress_bar: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/progress_bar.png', import.meta.url).href, preload: true },
	vb_progress_frame: { type: 'sprite', src: new URL('../../assets/sprites/vaultBreakers/progress_frame.png', import.meta.url).href, preload: true },
	vb_font_gold: { type: 'font', src: FONT_FILES.gold, preload: true },
	vb_font_goldblur: { type: 'font', src: FONT_FILES.goldblur, preload: true },
	vb_font_silver: { type: 'font', src: FONT_FILES.silver, preload: true },
	vb_font_purple: { type: 'font', src: FONT_FILES.purple, preload: true },
	coins: { type: 'spriteSheet', src: new URL('../../assets/sprites/vaultBreakers/coins.json', import.meta.url).href },
	sound: {
		type: 'audio',
		src: AUDIO_MANIFEST,
		preload: true,
	},
} as const;

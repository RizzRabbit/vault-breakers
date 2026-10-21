// Vault Breakers game numbers: the ONLY place to fill in figures from the final math checklist.
// Final values from the math checklist (math ac60a6d, math-fix-unique-upgrade; MATH_RELEASE_NOTES: 96.200% all modes, 10,000x cap). null = not final yet; renders as [PLACEHOLDER NAME] in the rules/paytable screens.
export const GAME_NUMBERS: Record<string, string | null> = {
	RTP_BASE: '96.20',
	RTP_ANTE: '96.20',
	RTP_BONUS: '96.20',
	RTP_SUPER: '96.20',
	MAX_WIN: '10,000',
	ANTE_COST: '1.25',
	BONUS_COST: '100',
	SUPER_COST: '400',
	// free-spin tiers (locked spec): every tier awards FS_SPINS; retrigger adds RETRIGGER_SPINS, same tier
	FS_SPINS: '10',
	RETRIGGER_SPINS: '5',
	SUPER_START: '2',
	EPIC_START: '4',
	EPIC_MIN_WIN: '200',
};

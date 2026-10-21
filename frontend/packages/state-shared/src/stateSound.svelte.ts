const DEFAULT_VOLUME_VALUE = 75;

export const stateSound = $state({
	volumeValueMaster: DEFAULT_VOLUME_VALUE,
	volumeValueMusic: DEFAULT_VOLUME_VALUE,
	volumeValueSoundEffect: DEFAULT_VOLUME_VALUE,
});

export const stateSoundDerived = {
	volumeMaster: () => stateSound.volumeValueMaster / 100,
	volumeMusic: () => (stateSound.volumeValueMusic / 100) * stateSoundDerived.volumeMaster(),
	volumeSoundEffect: () =>
		(stateSound.volumeValueSoundEffect / 100) * stateSoundDerived.volumeMaster(),
};

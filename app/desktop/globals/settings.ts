import { DEFAULT_MODERATION_LABELER } from '~/api/globals/defaults.ts';
import { PreferenceWarn } from '~/api/moderation/enums.ts';
import type { ModerationOpts } from '~/api/moderation/types.ts';

import { createReactiveLocalStorage } from '~/utils/storage.ts';

import { PaneSize, type PaneConfig } from './panes.ts';

export interface Deck {
	readonly id: string;
	name: string;
	emoji: string;
	panes: PaneConfig[];
}

export interface PreferencesSchema {
	$version: 1;
	/** Onboarding mode */
	onboarding: boolean;
	/** Deck configuration */
	decks: Deck[];
	/** UI configuration */
	ui: {
		/** Application theme */
		theme: 'auto' | 'dark' | 'light';
		/** Default pane size */
		defaultPaneSize: PaneSize;
	};
	/** Content moderation */
	moderation: {
		/** Global filter preferences */
		globals: ModerationOpts['globals'];
		/** User-level filter preferences */
		users: ModerationOpts['users'];
		/** Labeler-level filter preferences */
		labelers: ModerationOpts['labelers'];
		/** Keyword filters */
		keywords: ModerationOpts['keywords'];
	};
}

const PREF_KEY = 'rantai_prefs';

export const preferences = createReactiveLocalStorage<PreferencesSchema>(PREF_KEY, (version, prev) => {
	if (version === 0) {
		return {
			$version: 1,
			onboarding: true,
			decks: [],
			ui: {
				theme: 'auto',
				defaultPaneSize: PaneSize.MEDIUM,
			},
			moderation: {
				globals: {
					groups: {
						sexual: PreferenceWarn,
						violence: PreferenceWarn,
						intolerance: PreferenceWarn,
						rude: PreferenceWarn,
						spam: PreferenceWarn,
						misinfo: PreferenceWarn,
					},
					labels: {},
				},
				users: {},
				labelers: {
					[DEFAULT_MODERATION_LABELER]: {
						groups: {},
						labels: {},
					},
				},
				keywords: [],
			},
		};
	}

	return prev;
});

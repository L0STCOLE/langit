import '@pkg/solid-query';

import type { ModerationOptions } from './moderation';
import type { LanguagePreferences } from './types';

declare module '@pkg/solid-query' {
	interface Register {
		queryMeta: {
			batched?: boolean;
			timelineOpts?: {
				moderation: ModerationOptions;
				language: LanguagePreferences;
			};
		};
	}
}

import { createContext, useContext } from 'solid-js';

import type { DID } from '~/api/atp-schema.ts';

// Root
export const VIEW_ACCOUNTS = 0;
export const VIEW_APPEARANCE = 1;
export const VIEW_LANGAUGE = 2;
export const VIEW_CONTENT_FILTERS = 3;
export const VIEW_KEYWORD_FILTERS = 4;
export const VIEW_ACCESSIBILITY = 5;

// Keyword filters
export const VIEW_KEYWORD_FILTER_FORM = 6;

// Content filters
export const VIEW_HIDDEN_REPOSTERS = 7;
export const VIEW_LABEL_CONFIG = 8;
export const VIEW_SUBSCRIBED_LABELERS = 9;
export const VIEW_TEMPORARY_MUTES = 10;

// Languages
export const VIEW_ADDITIONAL_LANGUAGE = 11;

export type ViewType =
	| typeof VIEW_ACCESSIBILITY
	| typeof VIEW_ACCOUNTS
	| typeof VIEW_ADDITIONAL_LANGUAGE
	| typeof VIEW_APPEARANCE
	| typeof VIEW_CONTENT_FILTERS
	| typeof VIEW_HIDDEN_REPOSTERS
	| typeof VIEW_KEYWORD_FILTER_FORM
	| typeof VIEW_KEYWORD_FILTERS
	| typeof VIEW_LABEL_CONFIG
	| typeof VIEW_LANGAUGE
	| typeof VIEW_SUBSCRIBED_LABELERS
	| typeof VIEW_TEMPORARY_MUTES;

export type View =
	// Root
	| { type: typeof VIEW_ACCOUNTS }
	| { type: typeof VIEW_APPEARANCE }
	| { type: typeof VIEW_LANGAUGE }
	| { type: typeof VIEW_CONTENT_FILTERS }
	| { type: typeof VIEW_KEYWORD_FILTERS }
	| { type: typeof VIEW_ACCESSIBILITY }
	// Content filters
	| { type: typeof VIEW_HIDDEN_REPOSTERS }
	| { type: typeof VIEW_LABEL_CONFIG; kind: 'global' }
	| { type: typeof VIEW_LABEL_CONFIG; kind: 'labeler'; did: DID }
	| { type: typeof VIEW_SUBSCRIBED_LABELERS }
	| { type: typeof VIEW_TEMPORARY_MUTES }
	// Keyword filter form
	| { type: typeof VIEW_KEYWORD_FILTER_FORM; id: string | undefined }
	// Language
	| { type: typeof VIEW_ADDITIONAL_LANGUAGE };

export type ViewParams<T extends ViewType, V = View> = V extends { type: T } ? Omit<V, 'type'> : never;

export interface RouterState {
	readonly current: View;
	move: (next: View) => void;
}

export const RouterContext = createContext<RouterState>();

export const useViewRouter = () => {
	return useContext(RouterContext)!;
};

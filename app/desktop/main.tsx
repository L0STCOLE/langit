import { createRenderEffect, lazy } from 'solid-js';
import { render } from 'solid-js/web';

import { Router, configureRouter } from '@pkg/solid-page-router';
import { QueryClientProvider } from '@pkg/solid-query';

import { multiagent } from '~/api/globals/agent';

import type { ModerationOptions } from '~/api/moderation';

import { useMediaQuery } from '~/utils/media-query';

import { ModalProvider } from '~/com/globals/modals';
import * as shared from '~/com/globals/shared';

import { MetaProvider } from '~/com/lib/meta';

import ComposerContextProvider from './components/composer/ComposerContextProvider';

import { preferences } from './globals/settings';
import { queryClient } from './globals/query';

import './styles/tailwind.css';

import('./lib/moderation/update');

const App = () => {
	createRenderEffect(() => {
		// Sets up the multiagent labeler header
		multiagent.services.value = preferences.moderation.services.map((service) => ({
			did: service.did,
			redact: service.redact,
		}));
	});

	createRenderEffect(() => {
		const theme = preferences.ui.theme;

		const cl = document.documentElement.classList;

		if (theme === 'auto') {
			const isDark = useMediaQuery('(prefers-color-scheme: dark)');

			createRenderEffect(() => {
				cl.toggle('is-dark', isDark());
			});
		} else {
			cl.toggle('is-dark', theme === 'dark');
		}
	});

	return (
		<QueryClientProvider client={queryClient}>
			<MetaProvider>
				<ComposerContextProvider>
					<Router />
					<ModalProvider />
				</ComposerContextProvider>
			</MetaProvider>
		</QueryClientProvider>
	);
};

// Set up the router
configureRouter([
	{
		path: '/',
		component: lazy(() => import('./views/Layout')),
		children: [
			{
				path: '/',
				component: lazy(() => import('./views/EmptyView')),
			},
			{
				path: '/decks/:deck',
				component: lazy(() => import('./views/DecksView')),
			},
		],
	},
]);

// Set up common preferences
{
	const moderation = preferences.moderation;
	const createModerationOptions = (): ModerationOptions => {
		return {
			labels: moderation.labels,
			services: moderation.services,
			keywords: moderation.keywords,
			hideReposts: moderation.hideReposts,
			tempMutes: moderation.tempMutes,
		};
	};

	shared.setLanguagePreferences(preferences.language);
	shared.setModerationOptions(createModerationOptions());
	shared.setTranslationPreferences(preferences.translation);

	shared.setBustModerationListener(() => {
		shared.setModerationOptions({ ...shared.getModerationOptions(), ...createModerationOptions() });
	});
}

// The scroll restoration that Firefox does makes it broken, there's nothing to
// actually restore scroll position on anyway.
history.scrollRestoration = 'manual';

render(() => <App />, document.body);

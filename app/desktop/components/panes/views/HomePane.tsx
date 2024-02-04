import { type JSX, createSignal } from 'solid-js';

import type { HomePaneConfig } from '../../../globals/panes.ts';

import { IconButton } from '~/com/primitives/icon-button.ts';

import TimelineList from '~/com/components/lists/TimelineList.tsx';

import SettingsIcon from '~/com/icons/baseline-settings.tsx';

import { usePaneContext } from '../PaneContext.tsx';
import Pane from '../Pane.tsx';
import PaneAside from '../PaneAside.tsx';
import PaneBody from '../PaneBody.tsx';
import PaneHeader from '../PaneHeader.tsx';

import GenericPaneSettings from '../settings/GenericPaneSettings.tsx';
import HomePaneSettings from '../settings/HomePaneSettings.tsx';

const HomePane = () => {
	const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);

	const { pane } = usePaneContext<HomePaneConfig>();

	return [
		<Pane>
			<PaneHeader title="Home">
				<button
					title="Column settings"
					onClick={() => setIsSettingsOpen(!isSettingsOpen())}
					class={/* @once */ IconButton({ edge: 'right', color: 'muted' })}
				>
					<SettingsIcon class="place-self-center" />
				</button>
			</PaneHeader>

			<PaneBody>
				<TimelineList
					uid={pane.uid}
					params={{
						type: 'home',
						algorithm: 'reverse-chronological',
						showReplies: pane.showReplies,
						showReposts: pane.showReposts,
						showQuotes: pane.showQuotes,
					}}
				/>
			</PaneBody>
		</Pane>,
		() => {
			if (isSettingsOpen()) {
				return (
					<PaneAside onClose={() => setIsSettingsOpen(false)}>
						<HomePaneSettings />
						<GenericPaneSettings />
					</PaneAside>
				);
			}
		},
	] as unknown as JSX.Element;
};

export default HomePane;

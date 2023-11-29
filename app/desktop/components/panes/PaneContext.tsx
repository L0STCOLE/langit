import { type Accessor, type JSX, For, Suspense, createContext, createSignal, useContext } from 'solid-js';

import { createSortable, transformStyle } from '@thisbeyond/solid-dnd';

import { type Signal, signal } from '~/utils/signals.ts';

import CircularProgress from '~/com/components/CircularProgress.tsx';

import type { BasePaneConfig, DeckConfig } from '../../globals/panes.ts';

import { PaneLinkingContextProvider } from './PaneLinkingContext.tsx';

export type Sortable = ReturnType<typeof createSortable>;

export type PaneModalComponent = () => JSX.Element;

export interface PaneModalOptions {}

interface PaneModalState {
	id: number;
	render: PaneModalComponent;
	disableBackdropClose: Signal<boolean>;
}

export interface PaneModalContextObject {
	readonly id: number;
	readonly depth: number;
	disableBackdropClose: Signal<boolean>;
	close: () => void;
	reset: () => void;
}

export const PaneModalContext = createContext<PaneModalContextObject>();

/*#__NO_SIDE_EFFECTS__*/
export const usePaneModalState = () => {
	return useContext(PaneModalContext)!;
};

export interface PaneContextObject<T extends BasePaneConfig = BasePaneConfig> {
	deck: DeckConfig;
	pane: T;
	index: Accessor<number>;
	sortable: Sortable;
	deletePane(): void;
	openModal(fn: PaneModalComponent, options?: PaneModalOptions): void;
}

export const PaneContext = createContext<PaneContextObject>();

/*#__NO_SIDE_EFFECTS__*/
export const usePaneContext = <T extends BasePaneConfig = BasePaneConfig>() => {
	return useContext(PaneContext) as PaneContextObject<T>;
};

export interface PaneContextProviderProps {
	/** Expected to be static */
	deck: DeckConfig;
	/** Expected to be static */
	pane: BasePaneConfig;
	/** Expected to be static */
	index: Accessor<number>;
	/** Expected to be static */
	onDelete: () => void;
	children?: JSX.Element;
}

export const PaneContextProvider = (props: PaneContextProviderProps) => {
	let _id = 0;

	const { deck, pane, index } = props;

	const [modals, setModals] = createSignal<PaneModalState[]>([]);

	const openModal: PaneContextObject['openModal'] = (fn, _options) => {
		const next = modals().concat({
			id: _id++,
			render: fn,
			disableBackdropClose: signal(false),
		});

		setModals(next);
	};

	const resetModals = () => {
		setModals([]);
	};

	const sortable = createSortable(pane.id);

	const paneContext: PaneContextObject = {
		deck: deck,
		pane: pane,
		index: index,
		sortable: sortable,
		deletePane: props.onDelete,
		openModal: openModal,
	};

	return (
		<PaneContext.Provider value={paneContext}>
			<PaneLinkingContextProvider>
				<div
					ref={sortable.ref}
					class="relative"
					classList={{
						[`z-10 cursor-grabbing shadow-lg shadow-primary dark:shadow-background`]:
							sortable.isActiveDraggable,
					}}
					style={transformStyle(sortable.transform)}
				>
					<div class="flex h-full" prop:inert={sortable.isActiveDraggable || modals().length > 0}>
						{props.children}
					</div>

					<For each={modals()}>
						{(modal, index) => {
							const context: PaneModalContextObject = {
								id: modal.id,
								get depth() {
									return index();
								},
								disableBackdropClose: modal.disableBackdropClose,
								close: () => {
									const next = modals().slice();
									const index = next.indexOf(modal);

									if (index !== -1) {
										next.splice(index, 1);
										setModals(next);
									}
								},
								reset: resetModals,
							};

							return (
								<div
									onClick={(ev) => {
										if (ev.target === ev.currentTarget && !modal.disableBackdropClose.value) {
											resetModals();
										}
									}}
									class="absolute inset-0 z-10 flex flex-col overflow-hidden bg-black/50 pt-13 dark:bg-hinted/50"
									prop:inert={sortable.isActiveDraggable || modals().length - 1 !== index()}
								>
									<PaneModalContext.Provider value={context}>
										<Suspense
											fallback={
												<div class="pointer-events-none grid grow place-items-center">
													<CircularProgress />
												</div>
											}
										>
											{modal.render()}
										</Suspense>
									</PaneModalContext.Provider>
								</div>
							);
						}}
					</For>
				</div>
			</PaneLinkingContextProvider>
		</PaneContext.Provider>
	);
};

declare module 'solid-js' {
	namespace JSX {
		interface ExplicitProperties {
			inert?: boolean;
		}
	}
}

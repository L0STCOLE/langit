import { createSignal } from 'solid-js';

import { closeModal } from '~/com/globals/modals.tsx';

import { Button } from '~/com/primitives/button.ts';
import { DialogBody, DialogHeader, DialogRoot, DialogTitle } from '~/com/primitives/dialog.ts';
import { IconButton } from '~/com/primitives/icon-button.ts';

import DialogOverlay from '~/com/components/dialogs/DialogOverlay.tsx';

import CloseIcon from '~/com/icons/baseline-close.tsx';
import ContentCopyIcon from '~/com/icons/baseline-content-copy.tsx';
import CheckIcon from '~/com/icons/baseline-check.tsx';

const brandName = import.meta.env.VITE_APP_BRAND_NAME;

const DonationDialog = () => {
	return (
		<DialogOverlay>
			<div class={/* @once */ DialogRoot({ size: 'lg' })}>
				<div class={/* @once */ DialogHeader({ divider: true })}>
					<button title="Close dialog" onClick={closeModal} class={/* @once */ IconButton({ edge: 'left' })}>
						<CloseIcon />
					</button>

					<h1 class={/* @once */ DialogTitle()}>Donate to {brandName}</h1>
				</div>

				<div
					class={
						/* @once */ DialogBody({ padded: false, scrollable: true, class: 'flex flex-col gap-4 p-4' })
					}
				>
					<div class="flex min-w-0 items-center gap-4">
						<img src="https://github.com/mary-ext.png" class="h-16 w-16 shrink-0 rounded-full bg-muted-fg" />

						<div class="text-sm leading-6">
							Hey! I'm Mary, I develop {brandName} on my free time and while I'm happy to work on it for
							people to keep enjoying the app, unfortunately it doesn't really benefit me financially.
						</div>
					</div>

					<p class="text-sm leading-6">
						I'm sorry that I can't offer any direct donation links here, as a transfem living in hiding,
						offering PayPal, Patreon, Ko-fi, Liberapay or any other services like it is simply not a choice
						for me out of concerns for my personal safety. It's a bit unfortunate that cryptocurrencies gets a
						bad rep due to the many grifts surrounding it, but at the same time it's the only option that I
						can provide due to the anonymity guarantee that some currencies has.
					</p>

					<p class="text-sm leading-6">
						If you have any ideas on how I could solve this dilemma, feel free to reach out to me via Bluesky{' '}
						<span class="font-bold">@mary.my.id</span>, but otherwise I'll be providing my addresses below:
					</p>

					<hr class="my-1 border-divider" />

					<div class="flex flex-col">
						<p class="mb-1 block text-sm font-medium leading-6 text-primary">Monero (preferred)</p>
						<AddressInput value="46USqE6Pymu6UCBDv4ssSciHUxMGy4LfpRrou9bHK81zEbsBrjLrZC1Qag8iouMHixfF5W2DeqH18dXYFjyWmqZx5X7rVPA" />
					</div>

					<div class="flex flex-col">
						<p class="mb-1 block text-sm font-medium leading-6 text-primary">Solana</p>
						<AddressInput value="ExPxSeTfn8egctFpXNQhgVKqPhCL9AY2FmYDG6f7R4db" />
					</div>

					<div class="flex flex-col">
						<p class="mb-1 block text-sm font-medium leading-6 text-primary">Ethereum / Polygon</p>
						<AddressInput value="0x2926AD052F0C7A0C61aD10DaD60612453FAd7aFd" />
					</div>
				</div>
			</div>
		</DialogOverlay>
	);
};

export default DonationDialog;

const AddressInput = (props: { value: string }) => {
	const [copied, setCopied] = createSignal(false);

	return (
		<div class="flex min-w-0 justify-between gap-4">
			<span class="mt-2 flex cursor-text flex-wrap gap-1 break-all font-mono text-sm tracking-wider text-muted-fg">
				{props.value}
			</span>

			<button
				title="Copy address"
				onClick={() => {
					navigator.clipboard.writeText(props.value).then(() => {
						if (!copied()) {
							setCopied(true);
							setTimeout(() => setCopied(false), 500);
						}
					});
				}}
				class={/* @once */ Button({ variant: 'outline' })}
			>
				{(() => {
					if (copied()) {
						return <CheckIcon class="-mx-1.5 text-lg" />;
					}

					return <ContentCopyIcon class="-mx-1.5 text-lg" />;
				})()}
			</button>
		</div>
	);
};

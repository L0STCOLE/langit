import { type JSX, Show, createSignal } from 'solid-js';

import type { DID } from '~/api/atp-schema.ts';
import type { SignalizedPost } from '~/api/stores/posts.ts';

import { CauseLabel, CauseMutedKeyword } from '~/api/moderation/action.ts';
import { getPostModMaker } from '~/api/moderation/decisions/post.ts';

import { useSharedPreferences } from '../SharedPreferences.tsx';

export interface PostWarningProps {
	post: SignalizedPost;
	timelineDid?: DID;
	permalink?: boolean;
	children?: JSX.Element;
}

const PostWarning = (props: PostWarningProps) => {
	return (
		<Show
			when={(() => {
				const post = props.post;
				const permalink = props.permalink;
				const timelineDid = props.timelineDid;

				const maker = getPostModMaker(post, useSharedPreferences().moderation);
				const decision = maker();

				if (decision) {
					if (permalink) {
						if (decision.b && decision.s.t === CauseLabel) {
							return decision;
						}

						return;
					}

					if (
						decision.b &&
						(!timelineDid ||
							decision.s.t === CauseLabel ||
							decision.s.t === CauseMutedKeyword ||
							timelineDid !== post.author.did)
					) {
						return decision;
					}
				}
			})()}
			fallback={props.children}
			keyed
		>
			{(decision) => {
				const [show, setShow] = createSignal(false);

				const source = decision.s;

				const title =
					source.t === CauseLabel
						? `Content warning: ${source.l.val}`
						: source.t === CauseMutedKeyword
						  ? `Filtered: ${source.n}`
						  : `You've muted this user`;

				return (
					<>
						<div
							class="mt-3 flex items-stretch justify-between gap-3 overflow-hidden rounded-md border border-divider"
							classList={{ 'mb-3': show() }}
						>
							<p class="m-3 text-sm text-muted-fg">{title}</p>

							<button
								onClick={() => setShow(!show())}
								class="px-4 text-sm font-medium hover:bg-secondary hover:text-hinted-fg"
							>
								{show() ? 'Hide' : 'Show'}
							</button>
						</div>

						<Show when={show()}>{props.children}</Show>
					</>
				);
			}}
		</Show>
	);
};

export default PostWarning;

import { type JSX } from 'solid-js';

import type { AppBskyEmbedRecord, AppBskyFeedPost } from '~/api/atp-schema';
import { getRecordId } from '~/api/utils/misc';

import {
	type ModerationCause,
	ContextContentList,
	ContextContentMedia,
	getModerationUI,
} from '~/api/moderation';
import { decideQuote } from '~/api/moderation/entities/quote';

import { clsx } from '~/utils/misc';

import { getModerationOptions } from '../../globals/shared';

import { Interactive } from '../../primitives/interactive';

import { LINK_POST, Link } from '../Link';
import TimeAgo from '../TimeAgo';

import DefaultAvatar from '../../assets/default-user-avatar.svg?url';

import ContentWarning from '../moderation/ContentWarning';
import EmbedImage from './EmbedImage';

type EmbeddedPostRecord = AppBskyEmbedRecord.ViewRecord;
type PostRecord = AppBskyFeedPost.Record;

export interface EmbedQuoteProps {
	record: EmbeddedPostRecord;
	causes?: ModerationCause[];
	/** Whether it should show a large UI for image embeds */
	large?: boolean;
}

export interface EmbedQuoteContentProps extends EmbedQuoteProps {}

const getPostImages = (post: EmbeddedPostRecord) => {
	const embeds = post.embeds;

	if (embeds && embeds.length > 0) {
		const val = embeds[0];

		if (val.$type === 'app.bsky.embed.images#view') {
			return val.images;
		} else if (val.$type === 'app.bsky.embed.recordWithMedia#view') {
			const media = val.media;

			if (media.$type === 'app.bsky.embed.images#view') {
				return media.images;
			}
		}
	}
};

const embedQuoteInteractive = Interactive({ variant: 'muted', class: `w-full rounded-md`, userSelect: true });

export const EmbedQuoteContent = (props: EmbedQuoteContentProps, interactive?: boolean) => {
	return (() => {
		const post = props.record;
		const causes = props.causes;
		const large = props.large;

		const author = post.author;
		const val = post.value as PostRecord;

		const text = val.text;
		const images = getPostImages(post);

		const showLargeImages = images && (large || !text);
		const shouldBlurImage = images && causes && !!getModerationUI(causes, ContextContentMedia).b[0];

		return (
			<div
				class={
					/* @once */ clsx([
						`overflow-hidden rounded-md border border-divider`,
						interactive && `hover:bg-secondary/10`,
					])
				}
			>
				<div class="mx-3 mt-3 flex min-w-0 text-sm text-muted-fg">
					<div class="mr-2 h-5 w-5 shrink-0 overflow-hidden rounded-full bg-muted-fg">
						<img src={/* @once */ author.avatar || DefaultAvatar} class="h-full w-full" />
					</div>

					<span class="flex max-w-full gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
						<bdi class="overflow-hidden text-ellipsis">
							<span class="font-bold text-primary">{author.displayName || author.handle}</span>
						</bdi>
						<span class="block overflow-hidden text-ellipsis whitespace-nowrap">@{author.handle}</span>
					</span>

					<span class="px-1">·</span>

					<span class="whitespace-nowrap">
						<TimeAgo value={/* @once */ val.createdAt}>
							{(relative, _absolute) => relative as unknown as JSX.Element}
						</TimeAgo>
					</span>
				</div>

				{text ? (
					<div class="flex items-start">
						{images && !large && (
							<div class="mb-3 ml-3 mt-2 grow basis-0">
								<EmbedImage images={images} blur={shouldBlurImage} />
							</div>
						)}

						<div class="mx-3 mb-3 mt-1 line-clamp-6 min-w-0 grow-4 basis-0 whitespace-pre-wrap break-words text-sm empty:hidden">
							{text}
						</div>
					</div>
				) : (
					<div class="mt-3"></div>
				)}

				{showLargeImages && <EmbedImage images={images} borderless blur={shouldBlurImage} />}
			</div>
		);
	}) as unknown as JSX.Element;
};

const EmbedQuote = (props: EmbedQuoteProps) => {
	return (() => {
		const post = props.record;
		const author = post.author;

		const causes = decideQuote(post, getModerationOptions());

		return (
			<ContentWarning ui={getModerationUI(causes, ContextContentList)} innerClass="mt-2">
				<Link
					to={{ type: LINK_POST, actor: author.did, rkey: getRecordId(post.uri) }}
					class={embedQuoteInteractive}
				>
					{/* @once */ EmbedQuoteContent({ ...props, causes }, true)}
				</Link>
			</ContentWarning>
		);
	}) as unknown as JSX.Element;
};

export default EmbedQuote;

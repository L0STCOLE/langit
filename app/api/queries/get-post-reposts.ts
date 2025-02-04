import type { QueryFunctionContext as QC } from '@pkg/solid-query';

import type { At } from '../atp-schema';
import { multiagent } from '../globals/agent';

import { mergeProfile } from '../stores/profiles';

import { moderateProfileList } from '../moderation/utils';

export const getPostRepostsKey = (uid: At.DID, uri: string, limit = 25) => {
	return ['getPostReposts', uid, uri, limit] as const;
};
export const getPostReposts = async (ctx: QC<ReturnType<typeof getPostRepostsKey>, string | undefined>) => {
	const [, uid, uri, limit] = ctx.queryKey;

	const agent = await multiagent.connect(uid);

	const response = await agent.rpc.get('app.bsky.feed.getRepostedBy', {
		signal: ctx.signal,
		params: {
			uri: uri,
			limit: limit,
			cursor: ctx.pageParam,
		},
	});

	const data = response.data;

	return {
		cursor: data.cursor,
		profiles: moderateProfileList(
			data.repostedBy.map((actor) => mergeProfile(uid, actor)),
			ctx.meta?.moderation,
		),
	};
};

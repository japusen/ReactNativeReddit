const parseCommentTree = (thread) => {
	const comments = new Array();

	parseCommentThread(thread, comments);

	return comments;
};

const parseCommentThread = (thread, commentsArray) => {
	thread.forEach((element) => {
		const kind = element.kind;
		const data = element.data;

		if (kind === "t1") {
			const comment = parseComment(data);
			commentsArray.push(comment);

			if (comment.replies) {
				parseCommentThread(comment.replies, commentsArray);
			}
		} else {
			const more = parseMore(data);
			commentsArray.push(more);
		}
	});
};

const parseComment = (data) => {
	return {
		type: "comment",
		id: data.id,
		parentID: data.parent_id,
		author: data.author,
		time: data.created_utc,
		score: data.score,
		text: data.body,
		html: data.body_html,
		stickied: data.stickied || data.pinned,
		isSubmitter: data.is_submitter,
		isLocked: data.locked,
		hasScoreHidden: data.score_hidden,
		isRemoved: data.no_follow,
		replies: data.replies !== "" ? data.replies.data.children : null,
		depth: data.depth,
	};
};

const parseMore = (data) => {
	return {
		type: "more",
		id: data.id,
		replies: data.children,
	};
};

export default parseCommentTree;

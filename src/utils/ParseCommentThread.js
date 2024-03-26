import formatNumberInThousands from "./FormatNumberInThousands";
import formatTime from "./FormatTime";

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
		time: formatTime(data.created_utc),
		score: formatNumberInThousands(data.score, "point"),
		text: data.body,
		html: data.body_html,
		isStickied: data.stickied || data.pinned,
		isSubmitter: data.is_submitter,
		isLocked: data.locked,
		hasScoreHidden: data.score_hidden,
		isRemoved: data.no_follow,
		replies: data.replies !== "" ? data.replies.data.children : null,
		depth: data.depth,
		distinguished: data.distinguished,
		commentFlair: parseFlair(
			data.author_flair_type,
			data.author_flair_text,
			data.author_flair_richtext,
			data.author_flair_background_color,
			data.author_flair_text_color
		),
	};
};

const parseMore = (data) => {
	return {
		type: "more",
		id: data.id,
		parentID: data.parent_id.split("_")[1],
		replies: data.children,
		depth: data.depth,
	};
};

export default parseCommentTree;

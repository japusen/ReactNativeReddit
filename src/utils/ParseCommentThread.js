import formatNumberInThousands from "./FormatNumberInThousands";
import formatTime from "./FormatTime";
import parseFlair from "./ParseFlair";

const parseCommentTree = (thread, hideComments = false, depthHidden = null) => {
	const comments = new Array();

	parseCommentThread(thread, comments, hideComments, depthHidden);

	return comments;
};

const parseCommentThread = (
	thread,
	commentsArray,
	hideComments,
	depthToHide
) => {
	thread.forEach((element) => {
		const kind = element.kind;
		const data = element.data;

		if (kind === "t1") {
			const comment = parseComment(data, hideComments, depthToHide);
			commentsArray.push(comment);

			if (data.replies !== "") {
				parseCommentThread(
					data.replies.data.children,
					commentsArray,
					hideComments,
					depthToHide
				);
			}
		} else {
			const more = parseMore(data, hideComments, depthToHide);
			commentsArray.push(more);
		}
	});
};

const parseComment = (data, hideComments, depthToHide) => {
	return {
		type: "comment",
		id: data.id,
		parentID: data.parent_id.split("_")[1],
		childrenIDs:
			data.replies !== ""
				? data.replies.data.children.map((reply) => reply.data.id)
				: null,
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
		depth: data.depth,
		visible: hideComments ? data.depth < depthToHide : true,
		repliesHidden: data.replies !== "" && data.depth > 0,
		distinguished: data.distinguished,
		flair: parseFlair(
			data.author_flair_type,
			data.author_flair_text,
			data.author_flair_richtext,
			data.author_flair_background_color,
			data.author_flair_text_color
		),
	};
};

const parseMore = (data, hideComments, depthToHide) => {
	return {
		type: "more",
		id: data.id,
		parentID: data.parent_id.split("_")[1],
		childrenIDs: data.children,
		depth: data.depth,
		visible: hideComments ? data.depth < depthToHide : true,
	};
};

export default parseCommentTree;

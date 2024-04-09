import formatNumberInThousands from "./FormatNumberInThousands";
import formatTime from "./FormatTime";
import parseFlair from "./ParseFlair";

const parseMoreList = (thread, parentID) => {
	const comments = new Array();

	thread.forEach((element) => {
		const kind = element.kind;
		const data = element.data;

		if (kind === "t1") {
			const comment = parseMoreComment(data);
			comments.push(comment);
		} else {
			if (data.children.length > 0) {
				const more = parseMore(data);
				comments.push(more);
			}
		}
	});

	return comments;
};

const parseMoreComment = (data) => {
	return {
		type: "comment",
		id: data.id,
		parentID: data.parent_id.split("_")[1],
		childrenIDs: null,
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

const parseMore = (data) => {
	return {
		type: "more",
		id: data.id,
		parentID: data.parent_id.split("_")[1],
		childrenIDs: data.children,
		depth: data.depth,
	};
};

export default parseMoreList;

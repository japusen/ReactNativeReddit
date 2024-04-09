import formatNumberInThousands from "./FormatNumberInThousands";
import formatTime from "./FormatTime";
import parseFlair from "./ParseFlair";

const parseMoreList = (thread, parentID) => {
	const newComments = new Array();
	const newChildrenIDs = new Array();

	const addChildID = (pID, childID) => {
		if (pID === parentID) {
			newChildrenIDs.push(childID);
		} else {
			const parent = newComments.find((comment) => comment.id === pID);
			if (parent) {
				parent.childrenIDs = parent.childrenIDs
					? parent.childrenIDs.concat(childID)
					: [childID];
			}
		}
	};

	thread.forEach((element) => {
		const kind = element.kind;
		const data = element.data;

		if (kind === "t1") {
			const comment = parseMoreComment(data);
			newComments.push(comment);
			addChildID(comment.parentID, comment.id);
		} else if (kind === "more" && data.children.length > 0) {
			//ignore empty more objects
			const more = parseMore(data);
			newComments.push(more);
			addChildID(more.parentID, more.id);
		}
	});

	return { newComments, newChildrenIDs };
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

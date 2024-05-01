import { formatScore } from "./FormatNumberInThousands";
import formatTime from "./FormatTime";

const parseProfileComment = (comment) => {
	return {
		id: comment.id,
		title: comment.link_title,
		subreddit: comment.subreddit,
		author: comment.author,
		time: formatTime(comment.created_utc),
		score: formatScore(comment.score),
		body: comment.body,
	};
};

export default parseProfileComment;

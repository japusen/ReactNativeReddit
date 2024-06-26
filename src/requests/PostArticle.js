import axios from "axios";
import parsePost from "../utils/ParsePost";
import parseCommentTree from "../utils/ParseCommentTree";

export const getPostArticle = async (
	token,
	article,
	subreddit,
	sort,
	specificComment
) => {
	const endpoint = `https://oauth.reddit.com/r/${subreddit}/comments/${article}`;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: {
			sort,
			// showedits: true,
			// showmedia: true,
			// showmore: true,
			// showtitle: true,
			comment: specificComment,
			context: specificComment ? 1 : null,
			raw_json: 1,
		},
	};

	try {
		const response = await axios.get(endpoint, config);
		const postData = response.data[0].data.children[0].data;
		const commentsData = response.data[1].data.children;
		return {
			post: parsePost(postData),
			comments: parseCommentTree(commentsData),
		};
	} catch (error) {
		console.log(error);
		throw new Error("Article could not be loaded");
	}
};

import axios from "axios";

export const getPostArticle = async (token, article, subreddit, sort) => {
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
			raw_json: 1,
		},
	};

	try {
		const response = await axios.get(endpoint, config);
		return {
			post: response.data[0].data.children[0].data,
			comments: response.data[1].data.children,
		};
	} catch (error) {
		console.log(error);
		throw new Error("Article could not be loaded");
	}
};

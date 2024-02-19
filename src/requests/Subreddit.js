import axios from "axios";

export const getSubreddit = async (
	token,
	subreddit,
	sort,
	topSort = null,
	after = null
) => {
	const endpoint = `https://oauth.reddit.com/r/${subreddit}/${sort}`;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: {
			t: topSort,
			after,
			raw_json: 1,
		},
	};

	console.log("endpoint", endpoint);
	// console.log("headers", config.headers);
	// console.log("params", config.params);

	try {
		const response = await axios.get(endpoint, config);
		return response.data.data;
	} catch (error) {
		console.log(error);
		throw new Error("Subreddit could not be loaded");
	}
};

import axios from "axios";

const getUserContent = async (
	token,
	username,
	kind,
	sort,
	topSort = null,
	pageParam
) => {
	const endpoint = `https://oauth.reddit.com/user/${username}/${kind}`;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: {
			sort,
			t: topSort,
			type: kind === "submitted" ? "links" : kind,
			after: pageParam,
			raw_json: 1,
		},
	};

	try {
		const response = await axios.get(endpoint, config);
		return response.data.data;
	} catch (error) {
		console.log(error);
		throw new Error("Subreddit could not be loaded");
	}
};

export const getUserSubmissions = async (
	token,
	username,
	sort,
	topSort = null,
	pageParam
) => {
	return getUserContent(
		token,
		username,
		"submitted",
		sort,
		topSort,
		pageParam
	);
};

export const getUserComments = async (
	token,
	username,
	sort,
	topSort = null,
	pageParam
) => {
	return getUserContent(
		token,
		username,
		"comments",
		sort,
		topSort,
		pageParam
	);
};

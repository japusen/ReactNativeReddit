import axios from "axios";

export const getSubredditAutocomplete = async (token, query) => {
	const endpoint = "https://oauth.reddit.com//api/subreddit_autocomplete";
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: {
			query,
			include_over_18: true,
			include_profiles: true,
			raw_json: 1,
		},
	};

	try {
		const response = await axios.get(endpoint, config);
		return response.data.subreddits;
	} catch (error) {
		console.log(error);
		throw new Error("Search could not be completed");
	}
};

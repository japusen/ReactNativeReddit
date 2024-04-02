import axios from "axios";
import parseCommentTree from "../utils/ParseCommentTree";

export const getMoreComments = async (token, linkID, children, sort) => {
	const endpoint = `https://oauth.reddit.com/api/morechildren/`;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: {
			api_type: "json",
			link_id: linkID,
			children,
			sort,
			limit_children: false,
			raw_json: 1,
		},
	};

	try {
		const response = await axios.get(endpoint, config);
		const things = response.data.json.data.things;
		return parseCommentTree(things);
	} catch (error) {
		console.log(error);
		throw new Error("More comments could not be loaded");
	}
};

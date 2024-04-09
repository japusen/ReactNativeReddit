import axios from "axios";
import parseMoreList from "../utils/ParseMoreList";

export const getMoreComments = async (
	token,
	linkID,
	parentID,
	children,
	sort
) => {
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
		return parseMoreList(things, parentID);
	} catch (error) {
		console.log(error);
		return null;
		// throw new Error("More comments could not be loaded");
	}
};

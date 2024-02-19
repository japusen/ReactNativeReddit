import axios from "axios";
import Constants from "expo-constants";
import { encode } from "base-64";

const tokenURL = "https://www.reddit.com/api/v1/access_token";

export const getAccessToken = async () => {
	const credentials = encode(`${Constants.expoConfig.extra.clientID}:`);

	const fields = {
		grant_type: "https://oauth.reddit.com/grants/installed_client",
		device_id: "DO_NOT_TRACK_THIS_DEVICE",
	};

	const config = {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${credentials}`,
		},
	};

	try {
		const response = await axios.post(tokenURL, fields, config);
		return response.data.access_token;
	} catch (error) {
		throw new Error("Access Token could not be fetched");
	}
};

import { useQuery } from "@tanstack/react-query";
import { getMoreComments } from "../requests/MoreComments";
import parseCommentTree from "../utils/ParseCommentThread";

export const useMoreComments = (token, linkID, childrenIDs, sort, depth) => {
	const children = childrenIDs.join(", ");

	const { refetch } = useQuery({
		queryKey: ["getMore", linkID, childrenIDs],
		queryFn: () => getMoreComments(token, linkID, children, sort),
	});

	const fetch = async () => {
		try {
			const { data, isError } = await refetch();

			if (isError) {
				console.log("request for more comments failed");
				return null;
			}

			return parseCommentTree(data, true, depth + 2);
		} catch {
			console.log("error loading more comments");
			return null;
		}
	};

	return fetch;
};

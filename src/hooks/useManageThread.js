import { useReducer } from "react";

import commentsReducer from "../reducers/CommentsReducer";

const threadWithVisibleProp = (thread, maxDepth) => {
	return thread.map((item) => {
		if (item.type === "comment") {
			return {
				...item,
				visible: item.depth <= maxDepth,
				repliesHidden: item.depth >= maxDepth,
			};
		} else {
			return { ...item, visible: item.depth <= maxDepth };
		}
	});
};

export const useManageThread = (initialThread, lastVisibleDepth = 1) => {
	const [thread, dispatch] = useReducer(
		commentsReducer,
		threadWithVisibleProp(initialThread, lastVisibleDepth)
	);

	const handleShowReplies = (parentID, childrenIDs) => {
		dispatch({
			type: "showReplies",
			parentID,
			childrenIDs,
		});
	};

	const handleHideReplies = (parentID, startingDepth) => {
		dispatch({
			type: "hideReplies",
			parentID,
			startingDepth,
		});
	};

	const handleFetchMore = (
		id,
		moreDepth,
		newComments,
		parentID,
		newChildrenIDs
	) => {
		dispatch({
			type: "fetchMore",
			id,
			newComments: threadWithVisibleProp(
				newComments,
				moreDepth + lastVisibleDepth
			),
			parentID,
			newChildrenIDs,
		});
	};

	return {
		thread: thread.filter((item) => item.visible),
		handleShowReplies,
		handleHideReplies,
		handleFetchMore,
	};
};

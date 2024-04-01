import { useState } from "react";

export const useManageThread = (intialThread) => {
	const [managedThread, setManagedThread] = useState(intialThread);

	const showReplies = (parentID, childrenIDs) => {
		const updatedThread = managedThread.map((comment) => {
			if (comment.id === parentID) {
				return { ...comment, repliesHidden: false };
			}
			if (childrenIDs.includes(comment.id)) {
				return { ...comment, visible: true };
			}
			return comment;
		});
		setManagedThread(updatedThread);
	};

	const findTerminatingIndex = (start, depth) => {
		const arrayEnd = managedThread.length;
		while (start < arrayEnd) {
			if (managedThread[start].depth === depth) return start;
			start += 1;
		}
		return arrayEnd;
	};

	const hideReplies = (parentID, startingDepth) => {
		const parentIndex = managedThread.findIndex((e) => e.id === parentID);
		const endIndex = findTerminatingIndex(parentIndex + 1, startingDepth);

		const updatedThread = managedThread.map((item, index) => {
			if (index === parentIndex) {
				return { ...item, repliesHidden: true };
			}
			if (index > parentIndex && index < endIndex) {
				if (item.type === "comment" && item.visible) {
					return {
						...item,
						visible: false,
						repliesHidden: true,
					};
				} else if (item.type === "more" && item.visible) {
					return { ...item, visible: false };
				}
			}
			return item;
		});

		setManagedThread(updatedThread);
	};

	const replaceMore = (id, newComments) => {
		const index = managedThread.findIndex((item) => item.id === id);

		if (index === -1) {
			console.log("more comment was not found");
			return;
		}

		const updatedThread = managedThread.slice();
		updatedThread.splice(index, 1, ...newComments);

		setManagedThread(updatedThread);
	};

	return {
		thread: managedThread,
		showReplies,
		hideReplies,
		replaceMore,
	};
};

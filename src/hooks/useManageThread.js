import { useState } from "react";

export const useManageThread = () => {
	const lastVisibleDepth = 1;

	const [managedThread, setManagedThread] = useState([]);

	const initializeThread = (initialThread) => {
		setManagedThread(
			threadWithVisibleProp(initialThread, lastVisibleDepth)
		);
	};

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

	const replaceMore = (id, newComments, parentID, newChildrenIDs) => {
		const index = managedThread.findIndex((item) => item.id === id);

		if (index === -1) {
			console.log("more comment was not found");
			return;
		}

		const moreDepth = managedThread.at(index).depth;
		const maxDepth = moreDepth + lastVisibleDepth;
		const newVisibleComments = threadWithVisibleProp(newComments, maxDepth);

		let updatedThread = managedThread.slice();
		updatedThread.splice(index, 1, ...newVisibleComments);

		updatedThread = updatedThread.map((item) => {
			if (item.id === parentID) {
				return {
					...item,
					childrenIDs: item.childrenIDs
						.slice(0, -1)
						.concat(newChildrenIDs),
				};
			}
			return item;
		});

		setManagedThread(updatedThread);
	};

	return {
		thread: managedThread.filter((item) => item.visible),
		initializeThread,
		showReplies,
		hideReplies,
		replaceMore,
	};
};

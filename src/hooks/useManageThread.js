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

	return {
		thread: managedThread,
		showReplies,
	};
};

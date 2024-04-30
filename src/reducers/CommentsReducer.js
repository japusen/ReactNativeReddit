const commentsReducer = (thread, action) => {
	switch (action.type) {
		case "showReplies":
			return thread.map((comment) => {
				if (comment.id === action.parentID) {
					return { ...comment, repliesHidden: false };
				}
				if (action.childrenIDs.includes(comment.id)) {
					return { ...comment, visible: true };
				}
				return comment;
			});
		case "hideReplies":
			const findTerminatingIndex = (start, depth) => {
				const arrayEnd = thread.length;
				while (start < arrayEnd) {
					if (thread[start].depth === depth) return start;
					start += 1;
				}
				return arrayEnd;
			};

			const parentIndex = thread.findIndex(
				(e) => e.id === action.parentID
			);

			const endIndex = findTerminatingIndex(
				parentIndex + 1,
				action.startingDepth
			);

			return thread.map((item, index) => {
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
		case "fetchMore":
			const index = thread.findIndex((item) => item.id === action.id);

			if (index === -1) {
				console.log("more comment was not found");
				return;
			}

			let updatedThread = thread.slice();
			updatedThread.splice(index, 1, ...action.newComments);

			return updatedThread.map((item) => {
				if (item.id === action.parentID) {
					return {
						...item,
						childrenIDs: item.childrenIDs
							.slice(0, -1)
							.concat(action.newChildrenIDs),
					};
				}
				return item;
			});
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
};

export default commentsReducer;

const truncatedSubredditName = (subreddit) => {
	return subreddit.length >= 25 ? subreddit.slice(0, 24) + "..." : subreddit;
};

export default truncatedSubredditName;

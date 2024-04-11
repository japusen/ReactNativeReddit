import SortMenu from "./SortMenu";

const CommentSortMenu = ({ setSort }) => {
	const sorts = [
		{
			name: "confidence",
			title: "Best",
			icon: "star-four-points",
		},
		{ name: "top", title: "Top", icon: "arrow-up-bold-hexagon-outline" },
		{ name: "new", title: "New", icon: "new-box" },
		{ name: "old", title: "Old", icon: "clock-outline" },
		{ name: "qa", title: "Q&A", icon: "forum" },
		{
			name: "controversial",
			title: "Controversial",
			icon: "exclamation",
		},
	];

	return <SortMenu sorts={sorts} setSort={setSort} />;
};

export default CommentSortMenu;

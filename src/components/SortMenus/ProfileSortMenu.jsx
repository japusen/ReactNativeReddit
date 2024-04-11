import SortMenu from "./SortMenu";

const ProfileSortMenu = ({ setType }) => {
	const sorts = [
		{ name: "submitted", title: "Submissions", icon: "post-outline" },
		{ name: "comments", title: "Comments", icon: "comment-outline" },
	];

	return <SortMenu sorts={sorts} setSort={setType} icon="menu-swap" />;
};

export default ProfileSortMenu;

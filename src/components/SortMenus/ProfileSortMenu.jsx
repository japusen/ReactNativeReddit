import SortMenu from "./SortMenu";

const ProfileSortMenu = ({ setSort }) => {
	const sorts = [
		{ name: "submitted", title: "Submissions", icon: "post-outline" },
		{ name: "comments", title: "Comments", icon: "comment" },
	];

	return <SortMenu sorts={sorts} setSort={setSort} />;
};

export default ProfileSortMenu;

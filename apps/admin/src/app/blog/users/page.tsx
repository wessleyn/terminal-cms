import { Metadata } from "next";
import fetchUsers from "./_actions/fetchUsers";
import { UsersTable } from "./_components/UsersTable/index";

export const metadata: Metadata = {
    title: "Users",
    description: "Manage your blog users.",
};

export default async function BlogUsersPage() {
    const users = await fetchUsers() 
    return (
       <UsersTable users={users} />
    );
}
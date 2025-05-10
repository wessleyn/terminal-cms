import fetchUsers from "./_actions/fetchUsers";
import { UsersTable } from "./_components/UsersTable/index";

export default async function BlogUsersPage() {
    const users = await fetchUsers() 
    return (
       <UsersTable users={users} />
    );
}
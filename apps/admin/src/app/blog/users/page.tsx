import fetchUsers from "./_actions/fetchUsers";
import { UsersTable } from "./_components/UsersTable";

export default async function BlogUsersPage() {
    const users = await fetchUsers() 
    return (
       <UsersTable users={users} />
    );
}
import { getAllUsers } from './actions';
import { UserManagementTable } from '@/components/UserManagementTable';

export const revalidate = 0; // <--- ADD THIS LINE

export default async function ManageUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <UserManagementTable users={users} />
    </div>
  );
}

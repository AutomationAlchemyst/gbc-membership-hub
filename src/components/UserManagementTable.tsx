'use client';

import * as React from 'react';
import { updateUserRole } from '@/app/admin/manage-users/actions';
import { useToast } from '@/hooks/use-toast';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

type User = {
  uid: string;
  email: string;
  isAdmin: boolean;
};

export function UserManagementTable({ users }: { users: User[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const handleRoleChange = (uid: string, newIsAdmin: boolean) => {
    startTransition(async () => {
      const result = await updateUserRole(uid, newIsAdmin);
      if (result.success) {
        toast({ title: 'Success', description: 'User role updated successfully.' });
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
    });
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'isAdmin',
      header: 'Role',
      cell: ({ row }) => {
        const isAdmin = row.getValue('isAdmin');
        return isAdmin ? <Badge>Admin</Badge> : <Badge variant="secondary">Member</Badge>;
      },
    },
    {
      id: 'adminStatus',
      header: 'Admin Status',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Switch
            checked={user.isAdmin}
            onCheckedChange={(newIsAdmin) => handleRoleChange(user.uid, newIsAdmin)}
            disabled={isPending}
            aria-label="Admin status"
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

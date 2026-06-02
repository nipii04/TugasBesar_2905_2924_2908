import { UserCircle, Shield, Edit2, Trash2, Mail, Lock, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getUsers, deleteUser } from "./actions";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";
import { prisma } from "@/lib/prisma";

export default async function ManageAccounts(props: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;

  // Calculate dynamic stats
  const [totalAccounts, totalCaptains, totalCustomers, totalAdmins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'Captain' } }),
    prisma.user.count({ where: { role: 'Customer' } }),
    prisma.user.count({ where: { role: 'Admin' } }),
  ]);

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">MANAGE ACCOUNTS</h1>
          <p className="text-gray-500 font-mono text-sm">System users, crew members, and client access</p>
        </div>
        <Link href="/accounts/add" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-bold tracking-widest border border-green-500/30 transition-colors">
          <Plus size={16} />
          ADD USER
        </Link>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#14151a] border border-white/5 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><UserCircle size={16} /></div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">Total Accounts</p>
          </div>
          <p className="text-2xl font-bold">{totalAccounts}</p>
        </div>
        <div className="bg-[#14151a] border border-white/5 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Shield size={16} /></div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">Captains</p>
          </div>
          <p className="text-2xl font-bold">{totalCaptains}</p>
        </div>
        <div className="bg-[#14151a] border border-white/5 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><Lock size={16} /></div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">Customers</p>
          </div>
          <p className="text-2xl font-bold">{totalCustomers}</p>
        </div>
        <div className="bg-[#14151a] border border-white/5 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg"><Shield size={16} /></div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">Admins</p>
          </div>
          <p className="text-2xl font-bold">{totalAdmins}</p>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111115]">
          <h2 className="text-lg font-bold tracking-wider">SYSTEM USERS</h2>
          <SearchInput placeholder="Search users by name, username, role..." />
        </div>

        <Suspense key={query + currentPage} fallback={<AccountsTableSkeleton />}>
          <AccountsTable query={query} currentPage={currentPage} />
        </Suspense>

      </div>

    </div>
  );
}

async function AccountsTable({ query, currentPage }: { query: string, currentPage: number }) {
  // Tambahan delay buatan agar animasi Suspense terlihat saat demo
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { users, total, totalPages } = await getUsers(query, currentPage, 10);

  return (
    <div className="flex-1 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-white/5 bg-[#17181f]/40">
              <th className="font-semibold p-4">User</th>
              <th className="font-semibold p-4">Role</th>
              <th className="font-semibold p-4">Contact</th>
              <th className="font-semibold p-4">Registered</th>
              <th className="font-semibold p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-300">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 font-bold border border-white/5">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-200 text-sm">{user.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">@{user.username}</p>
                  </div>
                </td>
                
                <td className="p-4">
                  {user.role === "Admin" ? (
                    <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded border border-red-500/20 tracking-wider uppercase font-mono">{user.role}</span>
                  ) : user.role === "Captain" ? (
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded border border-purple-500/20 tracking-wider uppercase font-mono">{user.role}</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-[10px] font-bold rounded border border-gray-500/20 tracking-wider uppercase font-mono">{user.role}</span>
                  )}
                </td>
                
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={12} className="text-gray-500"/> {user.username}@primelog.com
                  </div>
                </td>
                
                <td className="p-4 text-gray-500 font-mono text-[10px]">
                  {user.createdAt.toLocaleDateString()}
                </td>

                <td className="p-4 text-right">
                  <div className="flex flex-row justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/accounts/${user.id}/edit`} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                      <Edit2 size={14}/>
                    </Link>
                    <form action={deleteUser.bind(null, user.id)}>
                      <button type="submit" className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-mono text-sm">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/5">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

function AccountsTableSkeleton() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#a155f7]/30 border-t-[#a155f7] rounded-full animate-spin"></div>
      <p className="text-[#a155f7] font-mono font-bold tracking-widest text-sm animate-pulse">MEMUAT DATA AKUN...</p>
    </div>
  );
}

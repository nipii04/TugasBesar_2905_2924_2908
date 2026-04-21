"use client";

import { UserCircle, Shield, MoreVertical, Edit2, Trash2, Mail, Phone, Lock, Plus } from "lucide-react";

export default function ManageAccounts() {
  
  const users = [
    { id: "USR001", name: "Capt. Ahmad Yusuf", email: "ahmad.yusuf@primelog.com", role: "Fleet Superintendent", status: "Active", lastLogin: "2 min ago" },
    { id: "USR002", name: "Sarah Lee", email: "sarah.lee@primelog.com", role: "Captain", status: "Active", lastLogin: "3 hours ago" },
    { id: "USR003", name: "David Wong", email: "dwong.marine@primelog.com", role: "Captain", status: "In Mission", lastLogin: "1 day ago" },
    { id: "USR004", name: "Budi Santoso", email: "budi.s@primelog.com", role: "Dock Operator", status: "Active", lastLogin: "Just now" },
    { id: "USR005", name: "PT. Mega Cargo", email: "logistics@megacargo.com", role: "Customer", status: "Active", lastLogin: "5 hours ago" },
    { id: "USR006", name: "Admin System", email: "admin@primelog.com", role: "Administrator", status: "Active", lastLogin: "Online" },
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-wider mb-1">MANAGE ACCOUNTS</h1>
          <p className="text-gray-500 font-mono text-sm">System users, crew members, and client access</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-bold tracking-widest border border-green-500/30 transition-colors">
          <Plus size={16} />
          ADD USER
        </button>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#14151a] border border-white/5 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><UserCircle size={16} /></div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">Total Accounts</p>
          </div>
          <p className="text-2xl font-bold">142</p>
        </div>
        <div className="bg-[#14151a] border border-white/5 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Shield size={16} /></div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">Captains</p>
          </div>
          <p className="text-2xl font-bold">38</p>
        </div>
        <div className="bg-[#14151a] border border-white/5 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><Lock size={16} /></div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">Customers</p>
          </div>
          <p className="text-2xl font-bold">85</p>
        </div>
        <div className="bg-[#14151a] border border-white/5 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg"><Shield size={16} /></div>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">Admins</p>
          </div>
          <p className="text-2xl font-bold">4</p>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-[#14151a] border border-white/5 rounded-xl overflow-hidden">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111115]">
          <h2 className="text-lg font-bold tracking-wider">SYSTEM USERS</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-[#17181f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-mono border-b border-white/5 bg-[#17181f]/40">
                 <th className="font-semibold p-4">User</th>
                 <th className="font-semibold p-4">Role</th>
                 <th className="font-semibold p-4">Contact</th>
                 <th className="font-semibold p-4">Status</th>
                 <th className="font-semibold p-4">Last Login</th>
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
                       <p className="text-[10px] text-gray-500 font-mono">{user.id}</p>
                     </div>
                   </td>
                   
                   <td className="p-4">
                     {user.role === "Administrator" ? (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded border border-red-500/20 tracking-wider uppercase font-mono">{user.role}</span>
                     ) : user.role === "Captain" ? (
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded border border-purple-500/20 tracking-wider uppercase font-mono">{user.role}</span>
                     ) : (
                        <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-[10px] font-bold rounded border border-gray-500/20 tracking-wider uppercase font-mono">{user.role}</span>
                     )}
                   </td>
                   
                   <td className="p-4">
                     <div className="flex items-center gap-2 text-gray-400">
                       <Mail size={12} className="text-gray-500"/> {user.email}
                     </div>
                   </td>
                   
                   <td className="p-4">
                     <div className="flex items-center gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' || user.status === 'Online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                       <span className="font-mono text-[10px] uppercase tracking-wider">{user.status}</span>
                     </div>
                   </td>

                   <td className="p-4 text-gray-500 font-mono text-[10px]">
                     {user.lastLogin}
                   </td>

                   <td className="p-4 text-right">
                     <div className="flex flex-row justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><Edit2 size={14}/></button>
                        <button className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

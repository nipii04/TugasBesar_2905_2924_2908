import { updateVessel } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Ship } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditVesselPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const vessel = await prisma.vessel.findUnique({ where: { id: params.id } });

  if (!vessel) {
    notFound();
  }

  const updateVesselWithId = updateVessel.bind(null, vessel.id);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/fleet" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">EDIT VESSEL</h1>
          <p className="text-gray-500 font-mono text-xs">Update vessel details: {vessel.name}</p>
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl p-6 shadow-xl">
        <form action={updateVesselWithId} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">VESSEL NAME</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={vessel.name}
              required
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">VESSEL TYPE</label>
              <select 
                name="type" 
                defaultValue={vessel.type}
                required
                className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
              >
                <option value="Container Ship">Container Ship</option>
                <option value="Bulk Carrier">Bulk Carrier</option>
                <option value="Oil Tanker">Oil Tanker</option>
                <option value="General Cargo">General Cargo</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">STATUS</label>
              <select 
                name="status" 
                defaultValue={vessel.status}
                required
                className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="DOCKED">DOCKED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">CAPACITY (UNITS/TEU)</label>
              <input 
                type="number" 
                name="capacity" 
                defaultValue={vessel.capacity}
                required
                min="0"
                className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">BUILD YEAR</label>
              <input 
                type="number" 
                name="buildYear" 
                defaultValue={vessel.buildYear || ''}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">ASSIGNED KEY (OPTIONAL)</label>
            <input 
              type="text" 
              name="assignedKey" 
              defaultValue={vessel.assignedKey || ''}
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/fleet"
              className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors"
            >
              CANCEL
            </Link>
            <button 
              type="submit"
              className="flex items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
            >
              <Ship size={16} />
              UPDATE VESSEL
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

import { updatePort } from "../../actions";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditPortPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const port = await prisma.port.findUnique({ where: { id: params.id } });

  if (!port) {
    notFound();
  }

  const updatePortWithId = updatePort.bind(null, port.id);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/ports" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">EDIT PORT</h1>
          <p className="text-gray-500 font-mono text-xs">Update details for: {port.name}</p>
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl p-6 shadow-xl">
        <form action={updatePortWithId} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">PORT NAME</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={port.name}
              required
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 tracking-wider">PORT CODE</label>
            <input 
              type="text" 
              name="code" 
              defaultValue={port.code}
              required
              maxLength={5}
              className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors uppercase"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">CITY</label>
              <input 
                type="text" 
                name="city" 
                defaultValue={port.city}
                required
                className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">COUNTRY</label>
              <input 
                type="text" 
                name="country" 
                defaultValue={port.country}
                required
                className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/ports"
              className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors"
            >
              CANCEL
            </Link>
            <button 
              type="submit"
              className="flex items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
            >
              <MapPin size={16} />
              UPDATE PORT
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

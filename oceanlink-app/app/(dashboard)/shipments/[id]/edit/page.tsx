import { Package, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { updateShipment } from "../../actions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditShipmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      transactionGoods: true,
      originPort: true,
      destinationPort: true
    }
  });

  if (!transaction) {
    notFound();
  }

  const updateShipmentWithId = updateShipment.bind(null, transaction.id);
  
  // Format dates for input type="date"
  const estArrivalStr = transaction.estArrival.toISOString().split('T')[0];
  const weight = transaction.transactionGoods?.[0]?.weight || '';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <Link href="/shipments" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-1">EDIT SHIPMENT</h1>
          <p className="text-gray-500 font-mono text-sm">Update tracking info for {transaction.trackingNumber}</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-[#111115] border border-white/5 rounded-xl p-6 sm:p-8">
        
        <form action={updateShipmentWithId} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-xs font-bold text-gray-400 tracking-wider">STATUS</label>
              <select 
                id="status"
                name="status"
                defaultValue={transaction.status}
                required
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors appearance-none"
              >
                <option value="PORT CLEARANCE">PORT CLEARANCE</option>
                <option value="ON SCHEDULE">ON SCHEDULE</option>
                <option value="IN TRANSIT">IN TRANSIT</option>
                <option value="DELAYED">DELAYED</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label htmlFor="weight" className="text-xs font-bold text-gray-400 tracking-wider">WEIGHT (KG)</label>
              <input 
                id="weight"
                name="weight" 
                type="number"
                step="0.01" 
                defaultValue={weight}
                placeholder="0.00" 
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Estimated Arrival */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="estArrival" className="text-xs font-bold text-gray-400 tracking-wider">ESTIMATED ARRIVAL (ETA)</label>
              <input 
                id="estArrival"
                name="estArrival" 
                type="date" 
                defaultValue={estArrivalStr}
                required
                className="w-full bg-[#14151a] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none transition-colors style-date-picker"
              />
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/shipments"
              className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors"
            >
              CANCEL
            </Link>
            <button 
              type="submit" 
              className="flex justify-center items-center gap-2 bg-[#a155f7] hover:bg-purple-600 text-white px-8 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <CheckCircle size={18} />
              UPDATE SHIPMENT
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

import GlassCard from "../ui/GlassCard";

export default function SupplierCard({ supplier, onClick }) {
  return (
    <GlassCard
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{supplier.name}</p>
          <p className="text-xs text-gray-500">
            {supplier.billsCount} bills
          </p>
        </div>

        <p className="text-xs text-gray-500">
          Last: {supplier.lastDate}
        </p>
      </div>
    </GlassCard>
  );
}

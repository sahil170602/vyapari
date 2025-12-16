import BottomNav from "../components/BottomNav";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen pb-16">
      {children}
      <BottomNav />
    </div>
  );
}

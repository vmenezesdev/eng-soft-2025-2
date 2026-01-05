export function Navbar() {
  return (
    <header className="flex items-center justify-between h-16 px-8 border-b border-[#23303e] bg-[#1a2632] sticky top-0 z-20">
      {/* BREADCRUMB */}
      <div className="hidden md:flex items-center text-sm text-gray-400">
        <span className="hover:text-white cursor-pointer">Dashboard</span>
        <span className="mx-2">/</span>
        <span className="text-white font-medium">Atividades</span>
      </div>
    </header>
  );
}

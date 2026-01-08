import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 h-screen bg-card-dark border-r border-[#23303e] flex-col shrink-0 flex-nowrap overflow-hidden">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-[#23303e] shrink-0">
        <div className="flex items-center gap-3 text-white">
          <div className="size-8 !text-primary flex-shrink-0">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 4C25.78 14.21 33.78 22.22 44 24C33.78 25.78 25.78 33.78 24 44C22.22 33.78 14.22 25.78 4 24C14.22 22.22 22.22 14.21 24 4Z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">ToDo List</h2>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <SidebarItem
          icon="format_list_bulleted"
          label="Todas as Atividades"
          active
        ></SidebarItem>
      </nav>
    </aside>
  );
}

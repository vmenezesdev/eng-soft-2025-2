import { Icon } from "./Icon";

type SidebarItemProps = {
  icon: string;
  label: string;
  active?: boolean;
};

export function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <a
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
        active
          ? "bg-[#2b8cee] text-white rounded-lg shadow-lg shadow-blue-500/20"
          : "text-gray-400 hover:text-white hover:bg-[#23303e] rounded-lg transition-colors"
      }`}
    >
      <Icon name={icon} size="base" />
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}

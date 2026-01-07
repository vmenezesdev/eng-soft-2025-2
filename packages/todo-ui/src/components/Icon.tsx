import * as React from "react";

type IconName = string;

type IconProps = {
  name: IconName;
  className?: string;
  size?: "sm" | "base" | "lg";
  title?: string; // se vier, o ícone vira acessível (role="img")
};

const sizeMap: Record<NonNullable<IconProps["size"]>, string> = {
  sm: "size-4",
  base: "size-5",
  lg: "size-6",
};

// Base de ícones (stroke consistente)
type SvgIconProps = React.SVGProps<SVGSVGElement>;

function createIcon(
  render: (props: SvgIconProps) => React.ReactElement
): React.FC<SvgIconProps> {
  return function IconImpl(props) {
    return render(props);
  };
}

const ListIcon = createIcon((props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </svg>
));

const CalendarIcon = createIcon((props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
));

const EditIcon = createIcon((props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
  </svg>
));

const TrashIcon = createIcon((props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
));

const CalendarTodayIcon = createIcon((props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
    <circle cx="12" cy="14" r="2" />
  </svg>
));

const icons: Record<string, React.ComponentType<SvgIconProps>> = {
  list: ListIcon,
  calendar: CalendarIcon,
  edit: EditIcon,
  trash: TrashIcon,
  calendar_today: CalendarTodayIcon,
  delete: TrashIcon,
};

export function Icon({ name, className = "", size = "base", title }: IconProps) {
  const IconComponent = icons[name];
  if (!IconComponent) {
    return null; // Return null if icon not found to prevent crash
  }
  const sizeClass = sizeMap[size];

  // Acessibilidade:
  // - sem title: decorativo (aria-hidden)
  // - com title: role=img + <title/>
  const a11yProps = title
    ? { role: "img" as const, "aria-label": title, "aria-hidden": undefined }
    : { "aria-hidden": true as const, role: undefined, "aria-label": undefined };

  return (
    <IconComponent
      className={`inline-block ${sizeClass} ${className}`}
      focusable="false"
      {...a11yProps}
    >
      {title ? <title>{title}</title> : null}
    </IconComponent>
  );
}

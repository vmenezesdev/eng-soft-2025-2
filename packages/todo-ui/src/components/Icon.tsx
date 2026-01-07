type IconProps = {
  name: string;
  className?: string;
};

const iconMap: Record<string, string> = {
  format_list_bulleted: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M120-120v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Zm60-210v-60h660v60H180Z"/></svg>`,
  calendar_today: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h100v-60h80v60h340v-60h80v60h100q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-370H180v370Zm0-430h600v-190h-60v60h-80v-60H260v60h-80v-60H120v190Zm0 0v-190 190Z"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M200-200h44l443-443-44-44L200-244v44Zm-20 60q-24 0-42-18t-18-42v-60h60v40h520v-360H260v40h-60v-100q0-24 18-42t42-18h520q24 0 42 18t18 42v360q0 24-18 42t-42 18H180Z"/></svg>`,
  delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h120v-40h440v40h120v80h-40v520q0 33-23.5 56.5T680-120H280Zm100-160h80v-360h-80v360Zm200 0h80v-360h-80v360Z"/></svg>`,
};

export function Icon({ name, className = "" }: IconProps) {
  const svg = iconMap[name];

  if (!svg) {
    return <span>{name}</span>;
  }

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

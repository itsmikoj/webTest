import Image from "next/image";

interface AppIconProps {
  logo?: string | null;
  name: string;
  size?: number;
  className?: string;
  gradient?: string;
  onClick?: () => void;
}

export function AppIcon({
  logo,
  name,
  size = 10,
  className = "",
  gradient = "from-blue-500 to-indigo-600",
  onClick
}: AppIconProps) {
  const sizeClass = `w-${size} h-${size}`;

  return (
    <div
      className={`
        ${sizeClass} 
        rounded-lg 
        bg-gradient-to-br 
        ${gradient}
        flex 
        items-center 
        justify-center 
        text-white 
        font-semibold 
        text-lg
        overflow-hidden
        ${className}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
      `}
      onClick={onClick}
    >
      {logo ? (
        <Image
          className="w-full h-full object-cover rounded-lg"
          src={logo}
          alt={name || "logo"}
          width={size * 4}
          height={size * 4}
        />
      ) : (
        <span>{name?.charAt(0)?.toUpperCase() || "?"}</span>
      )}
    </div>
  );
}

interface LogoProps {
  variant?: "full" | "icon" | "compact";
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({
  variant = "full",
  className = "",
  size = "md",
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: "w-8 h-8", text: "text-base" },
    md: { icon: "w-10 h-10", text: "text-xl" },
    lg: { icon: "w-14 h-14", text: "text-2xl" },
  };

  const currentSize = sizeClasses[size];

  // Logo Icon - Combines sun rays with water flow
  const LogoIcon = () => (
    <div
      className={`${currentSize.icon} relative flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient
            id="waterGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Sun rays (background) */}
        <g opacity="0.3">
          <path
            d="M50 10 L50 20"
            stroke="url(#sunGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M50 80 L50 90"
            stroke="url(#sunGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M10 50 L20 50"
            stroke="url(#sunGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M80 50 L90 50"
            stroke="url(#sunGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M20 20 L27 27"
            stroke="url(#sunGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M73 73 L80 80"
            stroke="url(#sunGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M20 80 L27 73"
            stroke="url(#sunGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M73 27 L80 20"
            stroke="url(#sunGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Central sun circle (top half - yellow) */}
        <circle cx="50" cy="45" r="20" fill="url(#sunGradient)" opacity="0.9" />

        {/* Water droplet/flow (bottom half - blue) */}
        <path
          d="M35 50 Q35 70 50 70 Q65 70 65 50"
          fill="url(#waterGradient)"
          opacity="0.9"
        />

        {/* Flow lines - representing movement */}
        <path
          d="M30 55 Q40 58 50 55 Q60 52 70 55"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M33 62 Q43 64 50 62 Q57 60 67 62"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        {/* Center highlight - energy point */}
        <circle cx="50" cy="50" r="5" fill="white" opacity="0.8" />
        <circle cx="50" cy="50" r="3" fill="url(#flowGradient)" />
      </svg>
    </div>
  );

  if (variant === "icon") {
    return <LogoIcon />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon />
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold text-gray-900 ${currentSize.text} leading-none`}
          >
            HelioSol Flow
          </span>
          {variant === "full" && (
            <span className="text-xs text-gray-500 mt-0.5">DePIN Network</span>
          )}
        </div>
      )}
    </div>
  );
}

// Alternative minimal logo for very small spaces
export function LogoMinimal({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-blue-600 flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
      >
        <circle cx="12" cy="10" r="4" fill="white" opacity="0.9" />
        <path d="M8 12 Q8 18 12 18 Q16 18 16 12" fill="white" opacity="0.8" />
        <circle cx="12" cy="12" r="2" fill="white" />
      </svg>
    </div>
  );
}

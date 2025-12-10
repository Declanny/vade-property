import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'colored';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  showText?: boolean;
  showTagline?: boolean;
}

export default function Logo({
  className = '',
  variant = 'colored',
  size = 'md',
  showIcon = true,
  showText = true,
  showTagline = false
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const taglineSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const iconColors = {
    light: { 
      primary: '#ffffff', 
      accent: '#B87333',
      house: 'rgba(255, 255, 255, 0.95)',
      check: '#ffffff'
    },
    dark: { 
      primary: '#0B3D2C', 
      accent: '#B87333',
      house: '#B87333',
      check: '#ffffff'
    },
    colored: { 
      primary: '#0B3D2C', 
      accent: '#B87333',
      house: '#B87333',
      check: '#ffffff'
    }
  };

  const textColors = {
    light: 'text-white',
    dark: 'text-primary',
    colored: 'text-primary'
  };

  const colors = iconColors[variant];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {showIcon && (
        <svg
          className={`${sizeClasses[size]} flex-shrink-0`}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Background with Gradient Effect */}
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={variant === 'light' ? '#ffffff' : '#0F5240'} />
              <stop offset="100%" stopColor={colors.primary} />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.accent} />
              <stop offset="100%" stopColor={variant === 'light' ? '#CA8E56' : '#CA8E56'} />
            </linearGradient>
          </defs>
          
          {/* Shield Shape - More Modern */}
          <path
            d="M28 4L10 11V22C10 33.5 17.5 43 28 52C38.5 43 46 33.5 46 22V11L28 4Z"
            fill={variant === 'light' ? 'url(#shieldGradient)' : colors.primary}
            stroke={variant === 'light' ? 'rgba(255, 255, 255, 0.3)' : colors.primary}
            strokeWidth="0.5"
          />
          
          {/* Inner Shield Highlight */}
          <path
            d="M28 7L13 13V22C13 31.5 19.5 39.5 28 47C36.5 39.5 43 31.5 43 22V13L28 7Z"
            fill="none"
            stroke={variant === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}
            strokeWidth="1"
          />

          {/* Modern House Icon */}
          <g transform="translate(16, 18)">
            {/* House Base */}
            <path
              d="M12 8L6 13V24H10V18H14V24H18V13L12 8Z"
              fill={variant === 'light' ? colors.house : colors.house}
              stroke={variant === 'light' ? 'rgba(255, 255, 255, 0.3)' : colors.accent}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Roof */}
            <path
              d="M12 8L6 13L12 13L18 13L12 8Z"
              fill={variant === 'light' ? 'rgba(184, 115, 51, 0.3)' : colors.accent}
            />
            {/* Door */}
            <rect
              x="10"
              y="20"
              width="4"
              height="4"
              fill={variant === 'light' ? 'rgba(255, 255, 255, 0.4)' : colors.primary}
              rx="0.5"
            />
            {/* Window */}
            <rect
              x="13.5"
              y="15"
              width="3"
              height="3"
              fill={variant === 'light' ? 'rgba(255, 255, 255, 0.4)' : colors.primary}
              rx="0.5"
            />
          </g>

          {/* Verification Checkmark Badge */}
          <circle
            cx="42"
            cy="16"
            r="6"
            fill={colors.accent}
            stroke={variant === 'light' ? '#ffffff' : '#ffffff'}
            strokeWidth="1.5"
          />
          <path
            d="M39 16L41.5 18.5L45 14"
            stroke={colors.check}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}

      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif font-bold ${textSizeClasses[size]} ${textColors[variant]} tracking-tight leading-tight`}>
            Tru<span className={variant === 'colored' || variant === 'dark' ? 'text-accent' : ''}>Vade</span>
          </span>
          {showTagline && (
            <span className={`${taglineSizeClasses[size]} ${variant === 'light' ? 'text-gray-200' : 'text-gray-600'} -mt-0.5 leading-tight`}>
              Verified by Lawyers
            </span>
          )}
        </div>
      )}
    </div>
  );
}

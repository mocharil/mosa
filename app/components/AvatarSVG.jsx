"use client";

import { useMemo } from 'react';
import { AVATAR_COLORS, AVATAR_DIMENSIONS, ANIMATION_CONFIG } from '@/app/lib/avatarConfig';

export default function AvatarSVG({
  mouthOpenness = 0,
  isBlinking = false,
  mode = 'jkn',
  emotion = 'neutral',
  className = '',
}) {
  const colors = useMemo(() => ({
    background: mode === 'jkn' ? AVATAR_COLORS.background.jkn : AVATAR_COLORS.background.curhat,
    mouth: mode === 'jkn' ? AVATAR_COLORS.mouth.jkn : AVATAR_COLORS.mouth.curhat,
    badge: mode === 'jkn' ? AVATAR_COLORS.badge.jkn : AVATAR_COLORS.badge.curhat,
  }), [mode]);

  // Calculate mouth dimensions based on openness
  const mouthRx = ANIMATION_CONFIG.mouth.minWidth + (mouthOpenness * (ANIMATION_CONFIG.mouth.maxWidth - ANIMATION_CONFIG.mouth.minWidth));
  const mouthRy = ANIMATION_CONFIG.mouth.minHeight + (mouthOpenness * (ANIMATION_CONFIG.mouth.maxHeight - ANIMATION_CONFIG.mouth.minHeight));

  // Eye scale for blinking
  const eyeScaleY = isBlinking ? 0.1 : 1.0;

  return (
    <svg
      viewBox={AVATAR_DIMENSIONS.viewBox}
      className={`${className}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Definitions */}
      <defs>
        {/* Background Gradient */}
        <radialGradient id={`bgGradient-${mode}`}>
          <stop offset="0%" stopColor={colors.background.start} />
          <stop offset="100%" stopColor={colors.background.end} />
        </radialGradient>

        {/* Face Shadow */}
        <filter id="faceShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Badge Shadow */}
        <filter id="badgeShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="0" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background Circle */}
      <circle
        cx="150"
        cy="150"
        r="145"
        fill={`url(#bgGradient-${mode})`}
      />

      {/* Face/Head */}
      <ellipse
        cx={AVATAR_DIMENSIONS.face.cx}
        cy={AVATAR_DIMENSIONS.face.cy}
        rx={AVATAR_DIMENSIONS.face.rx}
        ry={AVATAR_DIMENSIONS.face.ry}
        fill={AVATAR_COLORS.skin.light}
        filter="url(#faceShadow)"
      />

      {/* Hijab */}
      <path
        d="M 75 140 Q 75 80, 150 60 Q 225 80, 225 140 L 225 200 Q 150 190, 75 200 Z"
        fill={AVATAR_COLORS.hair.black}
        opacity="0.9"
      />

      {/* Face highlight (forehead) */}
      <ellipse
        cx="150"
        cy="140"
        rx="60"
        ry="50"
        fill={AVATAR_COLORS.skin.light}
      />

      {/* Cheeks (blush) */}
      <ellipse
        cx="110"
        cy="175"
        rx="15"
        ry="10"
        fill="#FFB6C1"
        opacity="0.3"
      />
      <ellipse
        cx="190"
        cy="175"
        rx="15"
        ry="10"
        fill="#FFB6C1"
        opacity="0.3"
      />

      {/* Eyes Group */}
      <g id="eyes">
        {/* Left Eye */}
        <ellipse
          cx={AVATAR_DIMENSIONS.leftEye.cx}
          cy={AVATAR_DIMENSIONS.leftEye.cy}
          rx={AVATAR_DIMENSIONS.leftEye.rx}
          ry={AVATAR_DIMENSIONS.leftEye.ry}
          fill={AVATAR_COLORS.eyes.brown}
          style={{
            transform: `scaleY(${eyeScaleY})`,
            transformOrigin: `${AVATAR_DIMENSIONS.leftEye.cx}px ${AVATAR_DIMENSIONS.leftEye.cy}px`,
            transition: 'transform 150ms ease-in-out',
          }}
        />

        {/* Left Eye Highlight */}
        {!isBlinking && (
          <circle
            cx={AVATAR_DIMENSIONS.leftHighlight.cx}
            cy={AVATAR_DIMENSIONS.leftHighlight.cy}
            r={AVATAR_DIMENSIONS.leftHighlight.r}
            fill="white"
            opacity="0.8"
          />
        )}

        {/* Right Eye */}
        <ellipse
          cx={AVATAR_DIMENSIONS.rightEye.cx}
          cy={AVATAR_DIMENSIONS.rightEye.cy}
          rx={AVATAR_DIMENSIONS.rightEye.rx}
          ry={AVATAR_DIMENSIONS.rightEye.ry}
          fill={AVATAR_COLORS.eyes.brown}
          style={{
            transform: `scaleY(${eyeScaleY})`,
            transformOrigin: `${AVATAR_DIMENSIONS.rightEye.cx}px ${AVATAR_DIMENSIONS.rightEye.cy}px`,
            transition: 'transform 150ms ease-in-out',
          }}
        />

        {/* Right Eye Highlight */}
        {!isBlinking && (
          <circle
            cx={AVATAR_DIMENSIONS.rightHighlight.cx}
            cy={AVATAR_DIMENSIONS.rightHighlight.cy}
            r={AVATAR_DIMENSIONS.rightHighlight.r}
            fill="white"
            opacity="0.8"
          />
        )}
      </g>

      {/* Eyebrows */}
      <path
        d="M 120 140 Q 130 138, 140 140"
        stroke={AVATAR_COLORS.hair.black}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 160 140 Q 170 138, 180 140"
        stroke={AVATAR_COLORS.hair.black}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* Nose - simple curved line */}
      <path
        d="M 150 160 Q 148 168, 150 170"
        stroke={AVATAR_COLORS.skin.medium}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Mouth */}
      <ellipse
        cx={AVATAR_DIMENSIONS.mouth.cx}
        cy={AVATAR_DIMENSIONS.mouth.cy}
        rx={mouthRx}
        ry={mouthRy}
        fill={colors.mouth}
        style={{
          transition: `all ${ANIMATION_CONFIG.mouth.transitionDuration} ease-out`,
        }}
      />

      {/* Tongue (visible when mouth is open) */}
      {mouthOpenness > 0.5 && (
        <ellipse
          cx="150"
          cy="190"
          rx="10"
          ry="5"
          fill={AVATAR_COLORS.mouth.tongue}
          opacity={mouthOpenness * 0.8}
        />
      )}

      {/* Teeth (visible when mouth is open wide) */}
      {mouthOpenness > 0.6 && (
        <rect
          x="140"
          y="180"
          width="20"
          height="3"
          fill="white"
          rx="1"
          opacity={mouthOpenness}
        />
      )}

      {/* Badge BPJS/JKN */}
      <g id="badge" filter="url(#badgeShadow)">
        <circle
          cx={AVATAR_DIMENSIONS.badge.cx}
          cy={AVATAR_DIMENSIONS.badge.cy}
          r={AVATAR_DIMENSIONS.badge.r}
          fill={colors.badge}
        />
        <text
          x={AVATAR_DIMENSIONS.badge.cx}
          y={AVATAR_DIMENSIONS.badge.cy + 6}
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          JKN
        </text>
      </g>

      {/* Optional: Speaking indicator rings */}
      {mouthOpenness > 0.3 && (
        <>
          <circle
            cx="150"
            cy="150"
            r="130"
            fill="none"
            stroke={colors.badge}
            strokeWidth="2"
            opacity={0.2 * mouthOpenness}
            className="animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke={colors.badge}
            strokeWidth="1"
            opacity={0.1 * mouthOpenness}
            className="animate-ping"
            style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}
          />
        </>
      )}
    </svg>
  );
}

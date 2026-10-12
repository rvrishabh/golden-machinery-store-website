import { gearPath } from '../lib/gear'

const GEAR = gearPath({ cx: 50, cy: 52, outer: 44, root: 36, teeth: 10, top: 0.36, flank: 0.12 })

// Vector rebuild of the Golden Machinery mark: gear outline, rising bars, ground arc.
export default function Logo({ size = 44, className = '' }) {
  return (
    <svg className={`logo-mark ${className}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <clipPath id="logo-clip">
          <rect x="0" y="0" width="100" height="78" />
        </clipPath>
      </defs>
      <g clipPath="url(#logo-clip)" fill="none" stroke="var(--accent)" strokeWidth="3.2" strokeLinejoin="round">
        <path d={GEAR} />
        <circle cx="50" cy="52" r="26" />
      </g>
      <g fill="currentColor">
        <rect x="35" y="56" width="7" height="17" />
        <rect x="46" y="40" width="7" height="33" />
        <rect x="57" y="48" width="7" height="25" />
        <path d="M14 86 Q50 62 86 86 Q50 76 14 86Z" />
      </g>
    </svg>
  )
}

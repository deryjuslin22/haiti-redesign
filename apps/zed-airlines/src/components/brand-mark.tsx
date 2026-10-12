type BrandMarkProps = {
  size?: number;
  className?: string;
  /** Recadre sur le carré, sans la marge du viewBox 24. */
  crop?: boolean;
};

export function BrandMark({ size, className, crop = false }: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={crop ? "3 3 18 18" : "0 0 24 24"}
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#1d1d1f" />
      <path
        d="M10 8h4l-4 8h4"
        stroke="#f5f5f7"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

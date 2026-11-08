type Props = {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
};

export default function Sparkline({ values, width = 96, height = 28, className }: Props) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);

  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / span) * (height - 3) - 1.5;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const rising = values[values.length - 1] >= values[0];
  const stroke = rising ? "var(--color-up)" : "var(--color-down)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

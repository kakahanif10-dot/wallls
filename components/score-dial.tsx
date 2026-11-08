type Props = {
  score: number;
  stance: string;
  confidence: number;
};

export default function ScoreDial({ score, stance, confidence }: Props) {
  const radius = 74;
  const circumference = Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color = score >= 66 ? "#3ecf8e" : score >= 47 ? "#d8ab5a" : "#f0645f";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 118" className="w-full max-w-[220px]">
        <path
          d="M 26 100 A 74 74 0 0 1 174 100"
          fill="none"
          stroke="#242a35"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 26 100 A 74 74 0 0 1 174 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
        <text x="100" y="82" textAnchor="middle" className="fill-bone" style={{ fontSize: 40, fontWeight: 600 }}>
          {score}
        </text>
        <text x="100" y="102" textAnchor="middle" className="fill-[#9aa4b4]" style={{ fontSize: 11, letterSpacing: 2 }}>
          TREND SCORE
        </text>
      </svg>
      <div className="mt-2 text-center">
        <p className="font-display text-lg text-bone">{stance}</p>
        <p className="text-xs text-muted">{confidence}% conviction</p>
      </div>
    </div>
  );
}

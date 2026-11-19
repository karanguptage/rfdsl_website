// Five large gold stars that pop one after another, on a loop: each star
// grows, tilts slightly and glows, then settles back to its normal size.
// One cycle is 3s; the stars start 0.25s apart (always the same gap), so the
// pop runs left to right in about 1.5s, rests, then repeats.
// Visitors who prefer reduced motion see the stars without the animation.

const CYCLE_S = 3;
const STEP_S = 0.25;

const CSS = `
@keyframes rfdsl-star-pop {
  0%, 16%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 10px rgb(251 191 36 / 0.45)); }
  6% { transform: scale(1.45) rotate(-10deg); filter: drop-shadow(0 0 22px rgb(251 191 36 / 0.95)); }
  11% { transform: scale(0.92) rotate(3deg); }
}
.rfdsl-star-pop {
  transform-origin: center;
  filter: drop-shadow(0 0 10px rgb(251 191 36 / 0.45));
  animation: rfdsl-star-pop ${CYCLE_S}s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .rfdsl-star-pop { animation: none; }
}
`;

const STAR_PATH = "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z";

export default function PopStars({ className }: { className?: string }) {
  return (
    <div role="img" aria-label="Rated 5 out of 5 stars" className={`flex gap-2 sm:gap-3 ${className ?? ""}`}>
      <style>{CSS}</style>
      {/* Shared gold gradient (light gold at the top, deep amber at the bottom). */}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="rfdsl-star-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="rfdsl-star-pop size-12 sm:size-14 lg:size-16"
          style={{ animationDelay: `${i * STEP_S}s` }}
        >
          <path d={STAR_PATH} fill="url(#rfdsl-star-gold)" stroke="#fde68a" strokeWidth={0.6} strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

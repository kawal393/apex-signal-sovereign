/**
 * Lightweight CSS-only ambient particle field.
 * Zero JS animation loops — pure CSS keyframes + GPU compositing.
 */
const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 1.5 + Math.random() * 1.5,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 6,
  isGold: i % 3 !== 0,
}));

export default function AmbientParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            backgroundColor: p.isGold
              ? 'hsl(42 100% 70%)'
              : 'hsl(0 0% 80%)',
            opacity: 0.25 + Math.random() * 0.15,
            boxShadow: p.isGold
              ? '0 0 6px hsl(42 100% 60% / 0.6)'
              : '0 0 4px hsl(0 0% 70% / 0.4)',
            animation: `float-particle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

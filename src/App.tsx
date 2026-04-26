import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ─── nav items ─────────────────────────────────────────── */
const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
];

/* ─── gallery images ─────────────────────────────────────── */
const galleryItems = [
  { image: "/images/city-boy.jpg", label: "City at Dusk" },
  { image: "/images/shrine-girl.jpg", label: "Morning at the Shrine" },
  { image: "/images/hero-skyfall.jpg", label: "Falling Through the Sky" },
  { image: "/images/rural-contact.jpg", label: "The Far-Away Town" },
];

/* ─── review stars ───────────────────────────────────────── */
const reviews = [
  {
    name: "Aiko M.",
    stars: 5,
    text: "An absolutely breathtaking film. The visuals and soundtrack left me speechless — I cried three times!",
  },
  {
    name: "James R.",
    stars: 5,
    text: "One of the most beautiful love stories ever animated. A masterpiece that will stay with you forever.",
  },
  {
    name: "Priya S.",
    stars: 5,
    text: "Stunning cinematography, emotional depth, and an unforgettable score. A must-watch for everyone.",
  },
];

/* ─── animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

/* ─── star helpers ───────────────────────────────────────── */
function Stars({ count, size = "text-base" }: { count: number; size?: string }) {
  return (
    <span className={`${size} tracking-wide text-amber-400`} aria-label={`${count} out of 5 stars`}>
      {"★".repeat(count)}
      <span className="text-zinc-600">{"★".repeat(5 - count)}</span>
    </span>
  );
}

/* ─── floating star canvas ───────────────────────────────── */
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nextMeteorAt = 120;

    type Meteor = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      life: number;
      maxLife: number;
    };

    let meteor: Meteor | null = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 190;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.25,
      speed: Math.random() * 0.035 + 0.012,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() * 0.8 + 0.2,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;
      for (const s of stars) {
        const pulse = Math.abs(Math.sin(t * s.speed + s.phase));
        const alpha = 0.18 + 0.82 * pulse;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.shadowBlur = 10 * s.glow * pulse;
        ctx.shadowColor = "rgba(255, 210, 255, 0.85)";
        ctx.fillStyle = `rgba(255,235,255,${alpha})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      if (!meteor && t > nextMeteorAt) {
        meteor = {
          x: Math.random() * canvas.width * 0.45 + canvas.width * 0.35,
          y: -30,
          vx: -(Math.random() * 7 + 7),
          vy: Math.random() * 4 + 5,
          length: Math.random() * 140 + 180,
          life: 0,
          maxLife: Math.random() * 22 + 42,
        };
        nextMeteorAt = t + Math.random() * 260 + 260;
      }

      if (meteor) {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life += 1;

        const fade = 1 - meteor.life / meteor.maxLife;
        const angle = Math.atan2(meteor.vy, meteor.vx);
        const tailX = meteor.x - Math.cos(angle) * meteor.length;
        const tailY = meteor.y - Math.sin(angle) * meteor.length;
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255,255,255,${Math.max(fade, 0)})`);
        gradient.addColorStop(0.25, `rgba(255,180,230,${Math.max(fade * 0.8, 0)})`);
        gradient.addColorStop(1, "rgba(120,80,255,0)");

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = 3.2;
        ctx.lineCap = "round";
        ctx.shadowBlur = 22;
        ctx.shadowColor = "rgba(255, 160, 220, 0.95)";
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(fade, 0)})`;
        ctx.fill();
        ctx.restore();

        if (meteor.life > meteor.maxLife || meteor.x < -meteor.length || meteor.y > canvas.height + 60) {
          meteor = null;
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40 opacity-75"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

/* ─── Nav ────────────────────────────────────────────────── */
function Nav() {
  return (
    <motion.header
      initial={{ y: -84, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 bg-[#0d0d0d]/95 text-white backdrop-blur-sm"
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* logo */}
        <a
          href="#home"
          className="jp-display bg-gradient-to-r from-fuchsia-500 via-pink-400 to-rose-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl"
        >
          Your Name
        </a>

        {/* nav links */}
        <div className="hidden items-center gap-10 text-base font-semibold tracking-widest text-zinc-200 sm:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              className="relative transition hover:text-pink-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-pink-400 after:transition-all hover:after:w-full"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-cover bg-center pt-20 text-white"
      style={{ backgroundImage: "url('/images/hero-skyfall.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#0b0d14]/80" />

      {/* animated red thread */}
      <motion.svg
        aria-hidden="true"
        className="absolute left-1/2 top-[18%] h-[58vh] w-[120vw] -translate-x-1/2 opacity-80"
        viewBox="0 0 1200 520"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      >
        <motion.path
          d="M80 350C260 240 353 405 507 303C650 208 665 78 763 151C860 222 846 374 1000 297C1089 252 1140 173 1174 79"
          stroke="url(#threadGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.55, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="threadGradient" x1="80" x2="1174" y1="350" y2="79">
            <stop stopColor="#9b123d" />
            <stop offset="0.5" stopColor="#ff6659" />
            <stop offset="1" stopColor="#f9b45b" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* hero text */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-end px-5 pb-16 sm:px-8 lg:pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.5em] text-pink-200">
            A red thread across time
          </p>
          <h1 className="jp-display bg-gradient-to-r from-fuchsia-500 via-pink-400 to-rose-300 bg-clip-text text-7xl font-black leading-none tracking-[-0.06em] text-transparent sm:text-8xl md:text-9xl">
            Your Name
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <Stars count={5} size="text-xl" />
            <span className="text-sm text-zinc-300">Rated 5/5 by fans worldwide</span>
          </div>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-100 sm:text-lg">
            A city boy and a country girl swap bodies across space and time, bound by a glowing
            red thread neither can explain. A cinematic fan tribute to one of the greatest
            animated films ever made.
          </p>
          <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold tracking-[0.16em]">
            <a
              className="bg-pink-700 px-7 py-3 text-white transition hover:bg-pink-600"
              href="#gallery"
            >
              View Gallery
            </a>
            <a
              className="border-b-2 border-pink-400 px-1 py-3 text-pink-100 transition hover:text-white"
              href="#about"
            >
              Meet the Characters →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Character Section ──────────────────────────────────── */
function CharacterSection({
  id,
  image,
  name,
  role,
  copy,
  align = "right",
  dark = true,
}: {
  id?: string;
  image: string;
  name: string;
  role: string;
  copy: string;
  align?: "left" | "right";
  dark?: boolean;
}) {
  const isRight = align === "right";

  return (
    <motion.section
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative -mt-10 min-h-[720px] overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url('${image}')`,
        clipPath: isRight
          ? "polygon(0 7%, 100% 0, 100% 93%, 0 100%)"
          : "polygon(0 0, 100% 7%, 100% 100%, 0 93%)",
      }}
    >
      <div className={dark ? "absolute inset-0 bg-black/60" : "absolute inset-0 bg-rose-50/58"} />
      <div
        className={`relative mx-auto flex min-h-[720px] max-w-6xl items-center px-5 py-28 sm:px-8 ${
          isRight ? "justify-end" : "justify-start"
        }`}
      >
        <div className={`max-w-xl ${dark ? "text-white" : "text-zinc-900"}`}>
          {/* character name */}
          <h2 className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-rose-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl">
            {name}
          </h2>
          {/* role badge */}
          <p className="mt-2 inline-block rounded-full border border-pink-500/50 bg-pink-900/30 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-pink-300">
            {role}
          </p>
          {/* star rating */}
          <div className="mt-4 flex items-center gap-2">
            <Stars count={5} size="text-lg" />
            <span className={`text-xs ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
              Fan favourite character
            </span>
          </div>
          {/* description */}
          <p className={`mt-6 text-sm leading-8 tracking-wide sm:text-base ${dark ? "text-zinc-200" : "text-zinc-800"}`}>
            {copy}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/* ─── Reviews ────────────────────────────────────────────── */
function Reviews() {
  return (
    <section className="relative z-10 bg-[#0b0d14] px-5 py-24 sm:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-5xl"
      >
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em] text-pink-500">
          What Fans Say
        </p>
        <h2 className="text-center text-4xl font-black tracking-tight text-white sm:text-5xl">
          Fan Reviews <span className="text-amber-400">★★★★★</span>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur"
            >
              <Stars count={r.stars} size="text-lg" />
              <p className="mt-3 text-sm leading-7 text-zinc-300">"{r.text}"</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-pink-400">
                — {r.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Gallery ────────────────────────────────────────────── */
function Gallery() {
  return (
    <section
      id="gallery"
      className="relative -mt-4 overflow-hidden bg-cover bg-center px-5 py-32 text-white sm:px-8"
      style={{
        backgroundImage: "url('/images/gallery-night.jpg')",
        clipPath: "polygon(0 4%, 100% 0, 100% 96%, 0 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[#070813]/80" />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-pink-400">
            Scene Stills
          </p>
          <h2 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
            Gallery
          </h2>
          <div className="mt-2 flex justify-center">
            <Stars count={5} size="text-2xl" />
          </div>
        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {galleryItems.map((item, index) => (
            <motion.figure
              key={item.label}
              initial={{ opacity: 0, y: 44, rotate: index % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -3 : 3 }}
              whileHover={{ y: -8, scale: 1.03 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              className="group relative aspect-[16/9] cursor-pointer overflow-hidden [clip-path:polygon(9%_0,100%_0,91%_100%,0_100%)]"
            >
              <img
                src={item.image}
                alt={item.label}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <figcaption className="absolute inset-x-10 bottom-6 text-sm font-bold tracking-[0.22em] text-white opacity-0 transition group-hover:opacity-100">
                {item.label}
              </figcaption>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#0d0d0f] px-5 py-10 text-center">
      <p className="text-sm font-semibold tracking-[0.28em] text-zinc-300">Fan Site by Samm</p>
    </footer>
  );
}

/* ─── App ────────────────────────────────────────────────── */
export default function App() {
  return (
    <main className="relative min-h-screen bg-[#0b0d14]">
      {/* floating star canvas */}
      <StarField />

      <Nav />
      <Hero />

      <CharacterSection
        id="about"
        image="/images/city-boy.jpg"
        name="Taki Tachibana"
        role="Male Protagonist"
        align="right"
        dark
        copy="A 17-year-old high school student living in Tokyo. He spends his days hanging out with friends and working part-time at an Italian restaurant, dreaming of becoming an architect. When he begins waking up in the body of a girl in a rural mountain town, his ordinary life is turned upside down."
      />

      <CharacterSection
        image="/images/shrine-girl.jpg"
        name="Mitsuha Miyamizu"
        role="Female Protagonist"
        align="left"
        dark={false}
        copy="A 17-year-old girl from the small town of Itomori. She lives with her grandmother and younger sister and participates in the traditional shrine rituals of her family. Longing for the excitement of city life, she prays to be reborn as a handsome Tokyo boy — and her wish comes true in the most unexpected way."
      />

      <Reviews />
      <Gallery />
      <Footer />
    </main>
  );
}

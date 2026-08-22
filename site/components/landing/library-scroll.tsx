"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const PLATES = [
  { id: "lib1", label: "Reading room", src: "/backgrounds/lib1.jpg" },
  { id: "lib2", label: "Study desk", src: "/backgrounds/lib2.jpg" },
  { id: "lib3", label: "Grand hall", src: "/backgrounds/lib3.jpg" },
  { id: "lib4", label: "The stacks", src: "/backgrounds/lib4.jpg" },
  { id: "lib5", label: "Scholar's nook", src: "/backgrounds/lib5.jpg" },
  { id: "lib6", label: "Archive shelf", src: "/backgrounds/lib6.jpg" },
  { id: "underscore", label: "Quiet corner", src: "/backgrounds/underscore.jpeg" },
  { id: "sketchbook", label: "The sketchbook", src: "/backgrounds/readingimage.jpeg" },
  { id: "storyshelf", label: "The story shelf", src: "/backgrounds/readingroom2.jpg" },
];

function Plate({
  plate,
  index,
}: {
  plate: (typeof PLATES)[number];
  index: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -10, rotate: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      style={{ rotate: index % 2 === 0 ? "-1.5deg" : "1.5deg" }}
      className="group relative w-[240px] shrink-0 text-left sm:w-[300px]"
    >
      <div className="rounded-[1.6rem] bg-white p-2.5 shadow-[0_25px_70px_-30px_rgba(22,19,16,0.45)] ring-1 ring-ink/8 transition-shadow duration-500 ease-out-expo group-hover:shadow-[0_35px_80px_-30px_rgba(36,64,201,0.45)]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-paper">
          <Image
            src={plate.src}
            alt={plate.label}
            fill
            unoptimized
            sizes="320px"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-between px-2 pt-3 pb-1.5">
          <p className="text-[13px] font-medium text-ink">{plate.label}</p>
          <p className="font-mono text-[9.5px] tracking-[0.18em] text-mist uppercase">
            Plate {String(index + 1).padStart(2, "0")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function LibraryScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      setShift(
        Math.max(
          0,
          trackRef.current.scrollWidth -
            document.documentElement.clientWidth +
            24,
        ),
      );
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref });
  // spring-smoothed so the walk glides instead of tracking the wheel 1:1
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
  });
  const x = useTransform(smooth, [0, 1], [0, -shift]);
  const glowX = useTransform(smooth, [0, 1], ["20%", "70%"]);

  return (
    <section id="library" ref={ref} className="relative h-[280vh] bg-background">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        {/* drifting cobalt glow that follows scroll */}
        <motion.div
          aria-hidden
          style={{ left: glowX }}
          className="absolute top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-cobalt/[0.07] blur-[120px]"
        />

        <div className="relative mb-10 px-6 sm:px-12">
          <span className="font-mono text-[10px] tracking-[0.22em] text-mist uppercase">
            The reading rooms · scroll to walk the stacks
          </span>
          <h2 className="mt-4 max-w-xl font-serif text-[clamp(2.1rem,4.5vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.01em] text-ink text-balance">
            Pick a room to <em className="text-cobalt italic">read in.</em>
          </h2>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative flex w-max items-start gap-7 pr-[10vw] pl-6 sm:gap-10 sm:pl-12"
        >
          {PLATES.map((plate, i) => (
            <Plate key={plate.id} plate={plate} index={i} />
          ))}

          {/* end card */}
          <div className="flex h-[340px] w-[220px] shrink-0 items-center justify-center sm:h-[420px] sm:w-[270px]">
            <a
              href="#beautify"
              className="group flex flex-col items-center gap-4 rounded-[1.6rem] border border-dashed border-ink/20 px-8 py-10 text-center transition-colors duration-500 ease-out-expo hover:border-cobalt hover:bg-cobalt/[0.04]"
            >
              <span className="font-mono text-[10px] tracking-[0.22em] text-mist uppercase">
                Or bring your own
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink transition-all duration-500 ease-out-expo group-hover:bg-cobalt group-hover:text-paper">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 12V2m0 0L2.5 6.5M7 2l4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </motion.div>

        {/* progress rail */}
        <div className="relative mx-6 mt-12 h-px bg-ink/10 sm:mx-12">
          <motion.div
            style={{ scaleX: smooth }}
            className="h-full origin-left bg-cobalt"
          />
        </div>
      </div>
    </section>
  );
}

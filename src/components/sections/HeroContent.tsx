import { motion } from "framer-motion";

export function HeroContent() {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="space-y-2">
        <motion.p
          variants={item}
          className="text-2xl md:text-3xl font-medium text-[#FF6B2D]/90 tracking-[0.09em]"
        >
          PABLO SALUT
        </motion.p>

        <motion.p
          variants={item}
          className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400"
        >
          Full Stack Developer
        </motion.p>
        
        <motion.h1
          variants={item}
          className="mb-4 max-w-4xl text-2xl font-semibold leading-tight md:text-4xl"
        >
          Diseño y desarrollo productos digitales con criterio, foco en la experiencia y solidez técnica.
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg"
        >
          Desde la arquitectura hasta la experiencia, cada decisión tiene intención.
        </motion.p>
      </div>
    </motion.div>
  );
}
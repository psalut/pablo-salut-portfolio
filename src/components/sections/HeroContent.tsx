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
          className="text-3xl md:text-4xl font-medium text-[#FF6B2D]/90 tracking-[0.09em]"
        >
          PABLO SALUT
        </motion.p>

        <motion.p
          variants={item}
          className="mb-8 text-sm uppercase tracking-[0.3em] text-slate-400"
        >
          Full Stack Developer
        </motion.p>
        
        <motion.h1
          variants={item}
          className="mb-4 max-w-7xl text-3xl font-semibold leading-tight md:text-5xl"
        >
          Diseño y desarrollo de productos digitales sólidos, centrados en el usuario.
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-2xl text-base leading-7 text-slate-300 md:text-xl"
        >
          Desde la arquitectura hasta la experiencia, cada decisión tiene intención.
        </motion.p>

      </div>
    </motion.div>
  );
}
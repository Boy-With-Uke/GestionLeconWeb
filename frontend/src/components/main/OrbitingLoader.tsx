import { motion } from "framer-motion";

export default function OrbitingLoader() {
  return (
    <div className="flex">
      <motion.div
        className="flex"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="mx-1 h-4 w-4 rounded-full bg-primary"
          animate={{ scale: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        <motion.div
          className="mx-1 h-4 w-4 rounded-full bg-primary"
          animate={{ scale: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        ></motion.div>
        <motion.div
          className="mx-1 h-4 w-4 rounded-full bg-primary"
          animate={{ scale: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        ></motion.div>
      </motion.div>
    </div>
  );
}

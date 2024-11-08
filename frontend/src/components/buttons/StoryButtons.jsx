import React from "react";
import { motion } from "framer-motion";

export default function StoryButtonMenu({
  handleBack,
  handleSetEasy,
  handleSetMed,
  handleSetHard,
  handleSetBonus,
  disableMedium,
  disableHard,
  disableBonus,
}) {
  // Animation variant to define the initial and animate states
  const buttonVariants = {
    hidden: { x: "10vw", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  return (
    <div className="menu-container mt-18 pr-8">
      <motion.a
        onClick={handleBack}
        className="cursor-pointer relative block group"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        style={{ width: "fit-content", position: "relative" }}
      >
        <img
          src="/buttonbg.png"
          className="block w-160 h-32 transform transition-transform duration-300 group-hover:scale-110"
        />
        <span className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl transition-transform duration-300 group-hover:scale-110">
          BACK
        </span>
      </motion.a>

      <motion.a
        onClick={handleSetEasy}
        className="cursor-pointer relative block group"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        style={{ width: "fit-content", position: "relative" }}
      >
        <img
          src="/buttonbg.png"
          className="block w-160 h-32 transform transition-transform duration-300 group-hover:scale-110"
        />
        <span className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl transition-transform duration-300 group-hover:scale-110">
          EASY
        </span>
      </motion.a>
      <motion.a
        onClick={disableMedium ? (e) => e.preventDefault() : handleSetMed}
        className="cursor-pointer relative block group"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        style={{ width: "fit-content", position: "relative" }}
      >
        <img
          src={disableMedium ? "/buttonalt.png" : "/buttonbg.png"}
          className="block w-160 h-32 transform transition-transform duration-300 group-hover:scale-110"
        />
        <span className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl transition-transform duration-300 group-hover:scale-110">
          MEDIUM
        </span>
      </motion.a>

      <motion.a
        onClick={disableHard ? (e) => e.preventDefault() : handleSetHard}
        className="cursor-pointer relative block group"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.7 }}
        style={{ width: "fit-content", position: "relative" }}
      >
        <img
          src={disableHard ? "/buttonalt.png" : "/buttonbg.png"}
          className="block w-160 h-32 transform transition-transform duration-300 group-hover:scale-110"
        />
        <span className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl transition-transform duration-300 group-hover:scale-110">
          HARD
        </span>
      </motion.a>
      <motion.a
        onClick={disableBonus ? (e) => e.preventDefault() : handleSetBonus}
        className="cursor-pointer relative block group"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.9 }}
        style={{ width: "fit-content", position: "relative" }}
      >
        <img
          src={disableBonus ? "/buttonalt.png" : "/buttonbg.png"}
          className="block w-160 h-32 transform transition-transform duration-300 group-hover:scale-110"
        />
        <span className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl transition-transform duration-300 group-hover:scale-110">
          Bonus
        </span>
      </motion.a>
    </div>
  );
}

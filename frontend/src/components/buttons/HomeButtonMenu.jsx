import React from 'react';
import { motion } from 'framer-motion';

export default function HomeButtonMenu({ handleGetLeaderboard, handleBlitz, handleSetGame }) {
  // Animation variant to define the initial and animate states
  const buttonVariants = {
    hidden: { x: '10vw', opacity: 0 },
    visible: {
      x: 0, // On-screen position
      opacity: 1,
    }
  };

  return (
    <div className="menu-container mt-20 pr-8">
      <motion.a
        onClick={handleGetLeaderboard}
        className="cursor-pointer relative block group"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        style={{ width: 'fit-content', position: 'relative' }}
      >
        <img
          src="/buttonbg.png"
          className="block w-160 h-36 transform transition-transform duration-300 group-hover:scale-110" 
        />
        <span
          className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
        >
          LEADERBOARD
        </span>
      </motion.a>

      <motion.a
        onClick={handleBlitz}
        className="cursor-pointer relative block group"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        style={{ width: 'fit-content', position: 'relative' }} 
      >
        <img
          src="/buttonbg.png"
          className="block w-180 h-36 transform transition-transform duration-300 group-hover:scale-110" 
        />
        <span
          className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl transition-transform duration-300 group-hover:scale-110"
        >
          BLITZ
        </span>
      </motion.a>

      <motion.a
        onClick={handleSetGame}
        className="cursor-pointer relative block group" 
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        style={{ width: 'fit-content', position: 'relative' }} 
      >
        <img
          src="/buttonbg.png"
          className="block w-160 h-36 transform transition-transform duration-300 group-hover:scale-110"
        />
        <span
          className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
        >
          STORY
        </span>
      </motion.a>
    </div>
  );
}
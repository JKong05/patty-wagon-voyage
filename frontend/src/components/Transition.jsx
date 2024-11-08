import React from "react";
import { motion } from "framer-motion";
import loadingGif from "../assets/transition.gif";

export default function Transition() {
  return (
    <motion.div
      className="transition-overlay"
      key="modal"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        backgroundColor: "#57b9ff",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={loadingGif}
        alt="Loading..."
        draggable={false}
        style={{ width: "30vw", height: "30vh" }}
      />
    </motion.div>
  );
}

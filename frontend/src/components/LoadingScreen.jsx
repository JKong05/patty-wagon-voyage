import React from "react";
import loadingGif from "../assets/transition.gif";

function LoadingScreen() {
  return (
    <div
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
    </div>
  );
}

export default LoadingScreen;

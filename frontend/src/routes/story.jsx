import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import sound from "../assets/transition-sound.mp3";
import { useNavigate, useOutletContext } from "react-router-dom";
import Transition from "../components/Transition";
import axios from "axios";
import StoryButtonMenu from "../components/buttons/StoryButtons";

export default function Story() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const [completedDifficulties, setCompletedDifficulties] = useState([]);
  const [bonusVideo, setBonusVideo] = useState(false);
  const { setHomeButtons } = useOutletContext();

  const handleBack = () => {
    setHomeButtons(true);
    navigate("/");
  };

  const transitionSound = new Howl({
    src: [sound],
  });

  const handleStartQuiz = async (diff) => {
    try {
      await axios.post(
        "http://localhost:5000/setgame",
        { numQuestion: 10, difficulty: diff },
        { withCredentials: true },
      );

      setIsRedirecting(true);
      setTimeout(() => {
        transitionSound.play();
      }, 250);
      setTimeout(() => {
        navigate("/trivia");
      }, 5000);
    } catch (e) {
      console.error("Internal error", e);
    }
  };

  // helper functions to help change conditionals for video loading and showing
  const handleSetBonus = async () => {
    setBonusVideo(true);
  };
  const handleVideoEnd = () => {
    setBonusVideo(false);
  };

  useEffect(() => {
    const getCompletedDifficulties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getcompleted", {
          withCredentials: true,
        });
        setCompletedDifficulties(response.data.completedDifficulties);
      } catch (error) {
        console.error("Error fetching completed difficulties", error);
      }
    };

    getCompletedDifficulties();
  }, []);

  return (
    <div>
      {bonusVideo && (
        <div className="video-container">
          <video
            src="/src/assets/bonus.mp4"
            autoPlay
            onEnded={handleVideoEnd}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}

      <StoryButtonMenu
        handleBack={handleBack}
        handleSetEasy={() => handleStartQuiz("easy")}
        handleSetMed={() => handleStartQuiz("medium")}
        handleSetHard={() => handleStartQuiz("hard")}
        handleSetBonus={handleSetBonus}
        disableMedium={!completedDifficulties.includes("easy")}
        disableHard={!completedDifficulties.includes("medium")}
        disableBonus={!completedDifficulties.includes("hard")}
      />
      {isRedirecting && <Transition />}
    </div>
  );
}
// we are setting states for the difficulties to ensure that it loads like a normal story game

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { setHomeButtons } = useOutletContext();

  // Fetch leaderboard data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/leaderboard");
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch leaderboard");
      }
    };
    fetchData();
  }, []);

  const handleBack = () => {
    setHomeButtons(true);
    navigate("/");
  };

  const buttonVariants = {
    hidden: { x: "10vw", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  return (
    <div>
      <ul>
        {data.length > 0 ? (
          data.map((player, index) => (
            <li key={player._id} className="leaderboard-item">
              <span>
                {index + 1}. {player.name}
              </span>{" "}
              - <span>{player.score}</span>
            </li>
          ))
        ) : (
          <li>No leaderboard data available</li>
        )}
      </ul>
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
      </div>
    </div>
  );
}

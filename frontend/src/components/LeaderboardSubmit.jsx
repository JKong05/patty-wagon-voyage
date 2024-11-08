import { useNavigate } from 'react-router-dom'; 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function LeaderboardSubmit({ score }) {
    // Setting up state variables for leaderboard submission information such as name and score
    const [playerName, setPlayerName] = useState('');
    const navigate = useNavigate();
    const handleHome = () => {
        navigate('/');
    };

    const handleLeaderboardSubmission = async () => {
        try {
            await axios.post(
                'http://localhost:5000/postleaderboard',
                { userName: playerName, score: score }
            );
        } catch (e) {
            console.error("Error submitting data:", e);
        }
    }


    return (
        <motion.div
            className="flex flex-col justify-center items-center p-8 w-96 h-max"
            initial={{ y: '50vh' }}
            animate={{ y: 0 }} //
            transition={{ type: 'spring', stiffness: 60, duration: 2 }}>
            <h1 className='font-bold'>Score: {score}</h1>
            <img src="/src/assets/end.png"></img>
            <div className="leaderboard-form-container mb-16">
                <form onSubmit={handleLeaderboardSubmission} className="flex flex-col">
                    <label htmlFor="playerName" className="mb-2">Enter Your Name:</label>
                    <input
                        id="playerName"
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
                </form>
            </div>
            <button
                onClick={handleHome}
                className="cursor-pointer relative block group"
                style={{ width: 'fit-content', position: 'relative' }}
            >
                <img
                    src="/buttonbg.png"
                    className="block w-160 h-36 transform transition-transform duration-300 group-hover:scale-110"
                />
                <span
                    className="menu-label absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl transition-transform duration-300 group-hover:scale-110"
                >
                    HOME
                </span>
            </button>
        </motion.div>
    )
}
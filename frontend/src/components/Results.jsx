import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Results({ score, minScore, numCorrect, difficulty }) {
    const navigate = useNavigate();
    const [videoEnded, setVideoEnded] = useState(false);
    const [showVideo, setShowVideo] = useState(true);
    const handleHome = () => {
        navigate('/');
    }
    const handleRetry = () => {
        window.location.reload();
    };

    const handleVideoEnd = () => {
        setVideoEnded(true);
        setShowVideo(false);
    };

    return (
        <div className={`${difficulty}-wrapper mx-auto flex items-center justify-center h-screen`}>
            {score >= minScore || numCorrect >= 7 ? (
                <div>
                    {showVideo && (
                        <video autoPlay={true} controls={false} onEnded={handleVideoEnd} className="w-full h-auto">
                            <source src={`/src/assets/${difficulty}-end.mp4`} type="video/mp4" />
                        </video>
                    )}

                    {videoEnded && (
                        <motion.div
                            className="flex flex-col justify-center items-center p-8 w-96 h-max"
                            initial={{ y: '50vh' }}
                            animate={{ y: 0 }} //
                            transition={{ type: 'spring', stiffness: 60, duration: 2 }}>
                            <img src="/src/assets/end.png"></img>
                            <div className="text-3xl font-bold text-900 mb-6">
                                Score: {score}
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
                    )}
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center p-8 w-96 h-max'>
                    <button
                        onClick={handleRetry}
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
                            TRY AGAIN
                        </span>
                    </button>
                </div>

            )}
        </div>

    );
}

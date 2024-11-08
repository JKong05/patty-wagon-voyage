import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TransitionReverse from './TransitionReverse';
import QuestionAttributes from './QuestionAttributes';
import AnswerChoice from './AnswerChoice';
import LoadingScreen from './LoadingScreen';
import Conch from './ConchHint';

export default function Quiz({
    difficulty,
    correctAnswer,
    progress,
    loading,
    isQuizComplete,
    currentQuestion,
    error,
    shuffledAnswers,
    selectedAnswer,
    handleSubmitAnswer,
    answered,
    score,
    handleHint,
    numHints,
    hint,
}) {
    const [videoEnded, setVideoEnded] = useState(false);
    const [showVideo, setShowVideo] = useState(true);

    const handleVideoEnd = () => {
        setVideoEnded(true);
        setShowVideo(false);
    };

    return (
        <div className={`${difficulty}-wrapper trivia-container mx-auto flex flex-col justify-center items-center h-screen`}>
            {loading && <LoadingScreen />}
            {!loading && <TransitionReverse />}
            {!loading && !isQuizComplete && currentQuestion && (
                <div>
                    {showVideo && (
                        <video autoPlay={true} controls={false} onEnded={handleVideoEnd} className="w-full h-auto">
                            <source src={`/src/assets/${difficulty}.mp4`} type="video/mp4" />
                        </video>
                    )}

                    {videoEnded && (
                        <motion.div
                            className="flex flex-col mx-auto text-center justify-center items-center"
                            initial={{ y: '50vh' }} // Start off-screen
                            animate={{ y: 0 }} // Animate to its normal position
                            transition={{ type: 'spring', stiffness: 120, duration: 2 }}
                        >
                            <div className="flex flex-col w-full justify-center items-center">
                                <h1>{score} Points</h1>
                                <div className="w-3/4 bg-gray-300 rounded-full h-4 mt-8 mb-4 mx-auto">  {/* Add mx-auto here */}
                                    <div
                                        className="bg-blue-500 h-4 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flew px-16 pb-8">
                                    <h1><QuestionAttributes question={currentQuestion} /></h1>
                                </div>

                                {error ? (
                                    <p>{error}</p>
                                ) : (
                                    <div className='flex flex-col pb-4'>
                                        <AnswerChoice
                                            correctAnswer={correctAnswer}
                                            shuffledAnswers={shuffledAnswers}
                                            selectedAnswer={selectedAnswer}
                                            handleAnswerSelection={handleSubmitAnswer}
                                            answered={answered} />
                                        <div className="flex flex-col items-center w-full pr-2">
                                            <div className="flex">
                                                <div><Conch handleHint={handleHint} /></div>
                                                {hint && <p className="mt-2 text-purple-600 text-center break-words w-5/6">{hint}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import BlitzGame from '../components/BlitzGame';
import LoadingScreen from '../components/LoadingScreen';
import LeaderboardSubmit from '../components/LeaderboardSubmit';

export default function Blitz() {
    const [questions, setQuestions] = useState([]);
    const [currIndex, setCurrIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [answered, setIsAnswered] = useState(false);
    const [complete, setComplete] = useState(false);
    

    // Fetch questions data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const questionResponse = await axios.get('http://localhost:5000/question', {
                    withCredentials: true,
                });
                setQuestions(questionResponse.data.questionData);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data from the backend');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Shuffle answers when the current question changes
    useEffect(() => {
        if (questions.length > 0) {
            const currentQuestion = questions[currIndex];
            const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
            const shuffled = allAnswers.sort(() => Math.random() - 0.5);
            setShuffledAnswers(shuffled);
        }
    }, [currIndex, questions]);

    // Go to the next question or complete the game
    const handleNextQuestion = () => {
        if (currIndex + 1 < questions.length) {
            setCurrIndex(currIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setComplete(true); // Set the game as complete
        }
    };

    // Handle answer submission
    const handleSubmitAnswer = async (answer) => {
        if (!answered) {
            setSelectedAnswer(answer);
            try {
                const response = await axios.post(
                    'http://localhost:5000/answer',
                    { questionIndex: currIndex, answer: answer },
                    { withCredentials: true }
                );
                const { isCorrect, score: newScore, numCorrect: newNum } = response.data;

                if (isCorrect) {
                    setScore(newScore);
                }

                setIsAnswered(true);

                setTimeout(() => {
                    handleNextQuestion();
                }, 1000);
            } catch (e) {
                console.error('Error submitting answer:', e);
            }
        }
    };
    // Declare current question
    const currentQuestion = questions[currIndex];

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.01 }} className='blitz-wrapper mx-auto flex items-center justify-center h-screen'>
            {!complete ? (
                <BlitzGame
                    loading={loading}
                    correctAnswer={currentQuestion?.correct_answer} // Ensure currentQuestion is available
                    currentQuestion={currentQuestion}
                    error={error}
                    shuffledAnswers={shuffledAnswers}
                    selectedAnswer={selectedAnswer}
                    handleSubmitAnswer={handleSubmitAnswer}
                    answered={answered}
                    score={score}
                />
            ) : (
                <LeaderboardSubmit 
                score={score}
                />
            )}
        </motion.div>
    );
}

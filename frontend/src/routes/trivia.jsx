import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { motion } from 'framer-motion';
import Quiz from '../components/Quiz';
import Results from '../components/results';
import LoadingScreen from '../components/LoadingScreen';

export default function Trivia() {
    const [questions, setQuestions] = useState([]); // set the fetched data to questions
    const [currIndex, setCurrIndex] = useState(0); // update the index of the question from json || array
    const [loading, setLoading] = useState(true); // conditional rendering based on whether page is still fetching data
    const [error, setError] = useState(null); // error handling
    const [selectedAnswer, setSelectedAnswer] = useState(null); // answer submission logic so that user cannot submit mutliple times
    const [score, setScore] = useState(0); // updating and setting the score 
    const [shuffledAnswers, setShuffledAnswers] = useState([]); // load in questions and immediately shuffle the associated answers
    const [answered, setIsAnswered] = useState(false); // check whether question is answered or not to continue with questions
    const [hint, setHint] = useState(''); // AI generated hints
    const [numHints, setNumHints] = useState(5); // number of hints is hardcoded in for now
    const [isQuizComplete, setIsQuizComplete] = useState(false); // conditional rendering of results page
    const [difficulty, setDifficulty] = useState(null); // conditional rendering for quiz templates
    const [numCorrect, setNumCorrect] = useState(0);

    /**
     * Two things need to be accomplished when the quiz is rendered in:
     * 1. Access get endpoint to get desired question difficulties
     * 2. Fetch the difficulty to determine which template to render
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // connect to backend
                const questionResponse = await axios.get('http://localhost:5000/question', {
                    withCredentials: true,
                });
                // set the state of question data to fetched data
                setQuestions(questionResponse.data.questionData);

                // setLoading to false to render in components
                setLoading(false);
            } catch (error) {
                setError('Error fetching data from the backend');
                setLoading(false);
            }
        };

        const fetchDifficulty = async () => {
            try {
                // connect to backend to get the difficulty posted within story.jsx route
                const difficultyResponse = await axios.get('http://localhost:5000/getdifficulty', {
                    withCredentials: true,
                });
                // set the difficulty state for template rendering logic
                setDifficulty(difficultyResponse.data.difficulty);

            } catch (error) {
                setError('Error fetching difficulty');
            }
        };

        fetchData();
        fetchDifficulty();
    }, []);

    // only access this function if current index and questions data changes from backend
    useEffect(() => {
        if (questions.length > 0) {
            const currentQuestion = questions[currIndex];
            const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
            const shuffled = allAnswers.sort(() => Math.random() - 0.5);
            setShuffledAnswers(shuffled);
        }
    }, [currIndex, questions]);


    // function to handle question logic as you answer
    const handleNextQuestion = () => {
        if (currIndex + 1 < questions.length) {
            setCurrIndex(currIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setHint('');
        }
    };

    // function to handle submission of answer logic
    const handleSubmitAnswer = async (answer) => {
        if (!answered) {
            setSelectedAnswer(answer);
            try {
                // post answer to backend and update any variables
                const response = await axios.post(
                    'http://localhost:5000/answer',
                    { questionIndex: currIndex, answer: answer },
                    { withCredentials: true }
                );
                // updated variables
                const { isCorrect, score: newScore, numCorrect: newNum } = response.data;

                // set the state with newscore for template
                if (isCorrect) {
                    setScore(newScore);
                    setNumCorrect(newNum);
                }

                // check with these asynchronous various because other constant variables do not update in time
                if (currIndex + 1 === questions.length) {
                    checkComplete(newScore, newNum);
                }

                // for answer submission logic
                setIsAnswered(true);

                setTimeout(() => {
                    handleNextQuestion();
                }, 1000);
            } catch (e) {
                console.error('Error submitting answer:', e);
            }
        }
    };

    // check whether user obtained a certain number of questions / score value to move them on to next level
    const checkComplete = async (score, numCorrect) => {
        console.log(score);
        if (numCorrect >= 7 || score >= minScore) {
            await updateStory();
        }
        // set this to true to render the results in
        setIsQuizComplete(true);
    };

    // post to backend the difficulty of the level and update number of difficulties acquired
    const updateStory = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/setcompleted',
                { difficulty: questions[0].difficulty },
                { withCredentials: true }
            );
            return response;
        } catch (e) {
            console.error('Error updating story:', e);
        }
    };

    // handling hint logic using AI api
    const handleHint = async () => {
        if (numHints > 0) {
            try {
                const response = await axios.get(
                    'http://localhost:5000/hint',
                    { params: { questionIndex: currIndex }, withCredentials: true }
                );
                setNumHints(response.data.hintsLeft);
                setHint(response.data.hint);
            } catch (e) {
                console.error('Error fetching hint:', e);
            }
        } else {
            setHint('No hints left!');
        }
    };

    // Conditional logic for number of points, same as "if easy, 1000 points is minScore or if medium, etc."
    const minScore = difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 1500 : 2000;

    // Progress bar to indicate how many questions out of the entirety the user has gotten correct
    const progress = (numCorrect / questions.length) * 100;

    // Declare outside functions what current question we are on
    const currentQuestion = questions[currIndex];

    // If we are still loading and waiting on our difficulty (fetching data), load in placeholder component
    if (loading || !difficulty) {
        return <LoadingScreen />;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.01 }}>
            {!isQuizComplete ? (
                <Quiz
                    difficulty={difficulty}
                    correctAnswer={currentQuestion.correct_answer}
                    progress={progress}
                    loading={loading}
                    isQuizComplete={isQuizComplete}
                    currentQuestion={currentQuestion}
                    error={error}
                    shuffledAnswers={shuffledAnswers}
                    selectedAnswer={selectedAnswer}
                    handleSubmitAnswer={handleSubmitAnswer}
                    answered={answered}
                    score={score}
                    handleHint={handleHint}
                    numHints={numHints}
                    hint={hint}
                    currIndex={currIndex}
                />
            ) : (
                <Results 
                score={score}
                minScore={minScore}
                numCorrect={numCorrect}
                difficulty={difficulty}/>
            )}
        </motion.div>
    );
}

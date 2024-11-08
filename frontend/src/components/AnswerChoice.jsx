import React from 'react';

function AnswerChoice({ correctAnswer, shuffledAnswers, selectedAnswer, handleAnswerSelection, isAnswered }) {
    return (
        <div className="answer-label flex flex-col items-center space-y-4">
            <div className="flex flex-row">
                {shuffledAnswers.map((answer) => (
                    <button
                        key={answer} // fixes potential rendering issues maybe?? 
                        onClick={() => handleAnswerSelection(answer)}
                        className={`relative group transition-all duration-200 w-64 h-36
                        ${isAnswered ? 'cursor-not-allowed' : ''}`}
                        disabled={isAnswered}
                    >
                        <img
                            src={selectedAnswer === correctAnswer && selectedAnswer === answer ? '/buttonbg.png' : '/buttonalt.png'}
                            alt="Button Background"
                            className="block w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                        />

                        <span
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white transition-transform duration-300 group-hover:scale-110 break-words"
                        >
                            {answer}
                        </span>

                    </button>
                ))}
            </div>
        </div>
    );
}

export default AnswerChoice;

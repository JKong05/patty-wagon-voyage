import { motion } from "framer-motion";
import TransitionReverse from "./TransitionReverse";
import QuestionAttributes from "./QuestionAttributes";
import AnswerChoice from "./AnswerChoice";
import LoadingScreen from "./LoadingScreen";

export default function BlitzGame({
  loading,
  progress,
  correctAnswer,
  currentQuestion,
  error,
  shuffledAnswers,
  selectedAnswer,
  handleSubmitAnswer,
  answered,
  score,
}) {
  return (
    <div className="blitz-wrapper trivia-container mx-auto flex flex-col justify-center items-center h-screen">
      {loading && <LoadingScreen />}
      {!loading && <TransitionReverse />}

      {!loading && currentQuestion && (
        <motion.div
          className="flex flex-col mx-auto px-10 text-center"
          initial={{ y: "50vh" }} // Start off-screen
          animate={{ y: 0 }} // Animate to its normal position
          transition={{ type: "spring", stiffness: 120, duration: 4 }}
        >
          <div className="flex flex-col w-full justify-center items-center">
            <h1>{score} Points</h1>
            <div className="w-3/4 bg-gray-300 rounded-full h-4 mt-8 mb-4 mx-auto">
              {" "}
              {/* Add mx-auto here */}
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flew px-16 pb-8">
              <h1>
                <QuestionAttributes question={currentQuestion} />
              </h1>
            </div>

            {error ? (
              <p>{error}</p>
            ) : (
              <div className="flex flex-col pb-4">
                <AnswerChoice
                  correctAnswer={correctAnswer}
                  shuffledAnswers={shuffledAnswers}
                  selectedAnswer={selectedAnswer}
                  handleAnswerSelection={handleSubmitAnswer}
                  answered={answered}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

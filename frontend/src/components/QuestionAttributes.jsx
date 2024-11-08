import React from 'react';
import Question from './Question';

function QuestionAttributes({ question }) {
  return (
    <div>
      <Question question={question.question} />
    </div>
  );
};

export default QuestionAttributes;
export default function Question(props) {
  const { question, correct_answer, answers, onClick, given_answer, gameOn } =
    props;

  const answerEls = answers.map((answer, index) => (
    <p
      onClick={gameOn ? onClick : () => {}}
      key={index}
      className={
        gameOn
          ? given_answer === answer
            ? "answer selected"
            : "answer"
          : answer === correct_answer
          ? "answer-checked correct"
          : answer === given_answer
          ? "answer-checked wrong"
          : "answer-checked"
      }
    >
      {answer}
    </p>
  ));

  return (
    <div className="question">
      <h1 className="title">{question}</h1>
      <div className="answers">{answerEls}</div>
    </div>
  );
}

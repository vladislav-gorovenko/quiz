import { useState, useEffect } from "react";
// nanoid is used to generate random ids
import { nanoid } from "nanoid";
// using it to decode HTML entities
import he from "he";
import Confetti from "react-confetti";

// importing assets
import "./App.css";
import blueImg from "./assets/blue.svg";
import yellowImg from "./assets/yellow.svg";

// importing components
import Question from "./components/Question";

export default function App() {
  const [questions, setQuestions] = useState([]);
  // is game on or checking the answers
  const [gameOn, setGameOn] = useState(true);
  // when started quiz - set to false
  const [firstGame, setFirstGame] = useState(true);
  // when starting new game change value to !value
  const [fetchAgain, setFetchAgain] = useState(true);

  // receiving questions from an API on rendering of the page
  useEffect(() => {
    async function getQuestions() {
      const response = await fetch("https://opentdb.com/api.php?amount=5");
      const data = await response.json();
      setQuestions(
        data.results.map((q) => {
          const { question, correct_answer, incorrect_answers } = q;

          return {
            ...q,
            // decoding HTML entities
            question: he.decode(question),
            correct_answer: he.decode(correct_answer),
            answers: [
              he.decode(correct_answer),
              ...incorrect_answers.map((a) => he.decode(a)),
            ].sort(() => Math.random() - 0.5),
            // assigning random id to each question
            id: nanoid(),
            // that's where we will store any provided answer
            given_answer: "",
          };
        })
      );
    }
    getQuestions();
  }, [fetchAgain]);

  function clickHandle(id, e) {
    const answer = e.target.innerHTML;
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        if (question.id === id) {
          return {
            ...question,
            given_answer: answer,
          };
        } else {
          return question;
        }
      });
    });
  }

  function btnHandle() {
    setGameOn(false);
  }

  function initiateGame() {
    setFirstGame(false);
  }

  function restartTheGame() {
    setFetchAgain((prevFetchAgain) => !prevFetchAgain);
    setFirstGame(true);
    setGameOn(true);
  }

  function correctAnswers() {
    return questions.filter(
      (question) => question.correct_answer === question.given_answer
    ).length;
  }

  const questionEls = questions.map((quest) => {
    const {
      question,
      correct_answer,
      incorrect_answers,
      id,
      given_answer,
      answers,
    } = quest;
    return (
      <Question
        key={id}
        given_answer={given_answer}
        question={question}
        correct_answer={correct_answer}
        incorrect_answers={incorrect_answers}
        answers={answers}
        onClick={(e) => {
          clickHandle(id, e);
        }}
        gameOn={gameOn}
      />
    );
  });

  return (
    <main>
      <img
        className="background-img background-img--blue"
        src={blueImg}
        alt="background img of blue color"
      />
      <img
        className="background-img background-img--yellow"
        src={yellowImg}
        alt="background img of yellow color"
      />
      {!gameOn && <Confetti />}
      {!firstGame && <div className="questions">{questionEls}</div>}
      {firstGame && (
        <div className="app">
          <h1 className="app-title">Quizzical</h1>
          <p className="app-description">Some random quiz on various topics</p>
          <button onClick={initiateGame} className="btn">
            Start quiz
          </button>
        </div>
      )}
      {!firstGame && (
        <div className="btm">
          {!gameOn && <p>You scored {correctAnswers()}/5 correct answers</p>}
          <button onClick={gameOn ? btnHandle : restartTheGame} className="btn">
            {gameOn ? "Check answers" : "Play again"}
          </button>
        </div>
      )}
    </main>
  );
}

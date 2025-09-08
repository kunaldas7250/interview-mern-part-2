

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Quizz from "./quiz.json";
import "./CSS/Test.css";

const Question = () => {
  const [questions] = useState(Quizz.questions);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Timer per question
  useEffect(() => {
    setSeconds(0);
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [current]);

  const handleAnswer = (option) => {
    setSelected(option); // only select, don't show answer
  };

  const handleShowAnswer = () => {
  // Only increase score if not already shown and answer is correct
  if (!showAnswer && selected === questions[current].answer) {
    setScore((prev) => prev + 1);
  }
  setShowAnswer(true); // reveal answer
};


  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent((prev) => prev + 1);
  };

  return (
    <div className="quizz">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="questionbox">
          {questions.map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrent(item.id - 1)}
              className={current === item.id - 1 ? "active" : ""}
            >
              Q{item.id}
            </div>
          ))}
        </div>
      </div>

      {/* Main Question */}
      <div className="question">
        <p className="timer">
          Time: {seconds} second{seconds !== 1 ? "s" : ""}
        </p>
        <h3>
          Question {current + 1}: {questions[current].question}
        </h3>
        <hr />
        <div className="answer">
          {questions[current].options.map((option, i) => (
            <label key={i} style={{ display: "block", margin: "5px 0" }}>
              <input
                type="radio"
                name={`q${current}`}
                value={option}
                checked={selected === option}
                onChange={() => handleAnswer(option)}
              />
              {option}
            </label>
          ))}
          <div>
            <button onClick={handleShowAnswer}>Show Answer</button>
          </div>
        </div>

        {showAnswer && (
          <motion.div
            className="correctanswer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>
              Correct Answer:{" "}
              <b style={{ color: "green" }}>{questions[current].answer}</b>
            </p>
            <button
              onClick={handleNext}
              disabled={current === questions.length - 1}
            >
              Next
            </button>
          </motion.div>
        )}

        <div className="score">
          <p>Score: {score}</p>
        </div>
      </div>
    </div>
  );
};

export default Question;

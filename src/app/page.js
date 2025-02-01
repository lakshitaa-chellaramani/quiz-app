"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, Star } from "lucide-react";
import quizData from "@/data/quiz.json";
import { AuroraBackground } from "@/components/AuroraBackground";

const QuizApp = () => {
  const [questions, setQuestions] = useState(quizData.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showStart, setShowStart] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    console.log("Current questions:", questions);
    console.log("Current question index:", currentQuestion);
    console.log("Current question data:", questions[currentQuestion]);
  }, [questions, currentQuestion]);

  useEffect(() => {
    let timer;
    if (!showStart && !showResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(false);  // If time runs out, consider the answer incorrect
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showStart, showResult, timeLeft]);

  const startQuiz = () => {
    setShowStart(false);
    setTimeLeft(30);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCurrentQuestion(0);
    setShowResult(false);
  };

  const handleAnswer = (selectedOption) => {
    const correctOption = selectedOption.is_correct;
    if (correctOption) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      setScore(score + 10 + streak * 2);
    } else {
      setStreak(0);
    }

    setTimeLeft(30);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
        <Card className="w-full max-w-lg p-6 text-center bg-white">
          <div className="animate-pulse">Loading Quiz...</div>
        </Card>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <>
    <AuroraBackground>
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg p-6 bg-white shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
        {showStart ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 animate__animated animate__fadeIn">Welcome to the Quiz!</h1>
            <p className="mb-6 animate__animated animate__fadeIn">Test your knowledge and earn points. Can you achieve the highest score?</p>
            <Button className="w-full" onClick={startQuiz}>
              Start Quiz
            </Button>
          </div>
        ) : showResult ? (
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500 animate__animated animate__fadeIn" />
            <h2 className="text-2xl font-bold mb-4 animate__animated animate__fadeIn">Quiz Completed!</h2>
            <div className="space-y-4">
              <p className="text-lg">Final Score: {score} points</p>
              <p className="text-lg">Max Streak: {maxStreak} questions</p>
              <div className="flex justify-center space-x-4">
                <Button onClick={startQuiz}>Play Again</Button>
              </div>
            </div>
          </div>
        ) : currentQuestionData ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span>Score: {score}</span>
              </div>
              <div className="flex items-center">
                <Timer className="w-5 h-5 mr-1" />
                <span>{timeLeft}s</span>
              </div>
            </div>
            <Progress value={(timeLeft / 30) * 100} className="mb-4" />
            <div className="text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <h2 className="text-xl font-bold mb-4">{currentQuestionData.description}</h2>
            <div className="space-y-2">
              {currentQuestionData.options.map((option, index) => (
                <Button
                  key={index}
                  className="w-full text-left justify-start"
                  variant="outline"
                  onClick={() => handleAnswer(option)}
                >
                  {option.description}
                </Button>
              ))}
            </div>
            {streak > 0 && (
              <div className="mt-4 text-center text-sm text-green-600 animate__animated animate__fadeIn">
                🔥 {streak} Question Streak! Keep going!
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-red-500">Error loading question</div>
        )}
      </Card>
    </div>
    </AuroraBackground>
    </>
  );
};

export default QuizApp;

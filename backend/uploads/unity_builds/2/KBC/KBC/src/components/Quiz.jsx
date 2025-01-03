import { useEffect, useState } from "react";
import socket from "../Socket"; // Import socket instance

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    // Listen for real-time updates
    socket.on("currentQuestionUpdated", (question) => {
      setCurrentQuestion(question);
    });

    return () => socket.off("currentQuestionUpdated");
  }, []);

  if (!currentQuestion) return <h1>Waiting for the next question...</h1>;

  return (
    <div>
      <div className="text-3xl underline  text-center py-10">
        Multiple type Questions
      </div>
      <div className="absolute bottom-[80px] w-[100%] ">
        <div>
          <div className=" bg-green-500 text-white mx-24 mt-28 mb-5 text-center py-5 text-3xl">
            {currentQuestion.question}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 mx-24 ">
          {currentQuestion.options.map((option, idx) => {
            return (
              <div
                key={idx}
                className=" bg-green-500 text-white py-5 px-3 cursor-pointer text-lg"
              >
                {option.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

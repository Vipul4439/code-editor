import React, { useEffect, useState } from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-javascript";
import CorrectAnswer from "./LottieFiles/CorrectAnswer";
import WrongAnswer from "./LottieFiles/WrongAnswer";

export default function CodeEditorHome({
  code,
  onChange,
  handleSubmit,
  handleChangeQuestion,
  questionArr,
  questionBank,
  currentQuestionNumber,
  handleSubmitFinalAnswer,
  checkerFn,
  questionCounter,
  isExecutionStart,
}) {
  const [question, setQuestion] = useState(questionArr);
  const [expandedTestCase, setExpandedTestCase] = useState(0);
  const [showRunBtn, setShowRunBtn] = useState(true);

  const toggleTestCase = (index) => {
    console.log("index", index);
    setExpandedTestCase((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const updateQuestionStatus = () => {
      if (isExecutionStart) {
        setShowRunBtn(false);

        const updatedQuestions = [...question]; // Creating a copy of the state array

        if (questionArr[questionCounter].output === Number(checkerFn)) {
          updatedQuestions[questionCounter].status = true;
          updatedQuestions[questionCounter].yourAnswer = Number(checkerFn);
          console.log("Its a correct answer");
        } else {
          updatedQuestions[questionCounter].status = false;
          updatedQuestions[questionCounter].yourAnswer = Number(checkerFn);
          console.log("Its a wrong answer");
        }

        setQuestion(updatedQuestions); // Updating the state with the modified array

        if (questionCounter == updatedQuestions.length - 1) {
          setShowRunBtn(true);
        }
      } else {
        setShowRunBtn(true);
        setQuestion(questionArr);
      }
    };
    updateQuestionStatus();
  }, [checkerFn, currentQuestionNumber]);

  const testCases = [0, 1, 2];

  const handleSubmitCallback = () => {
    handleSubmit();
  };

  return (
    <div className="flex w-full h-full justify-center items-center flex-row">
      <div>
        <div className="flex w-full h-[25%] justify-center items-center flex-row">
          <div>
            <label
              for="example-select"
              class="block text-sm font-medium text-gray-700"
            >
              Select Langauge
            </label>
          </div>
          <div>
            <select
              id="example-select"
              name="example-select"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>Javscript</option>
            </select>
          </div>
        </div>
        <div className="flex w-full h-[25%] borde flex-col">
          <div>Question: {questionBank[currentQuestionNumber].question}</div>
        </div>

        <div className="flex w-[100%] h-[65%] mt-4">
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={onChange}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            value={code?.dummyInput || ""}
          />
        </div>
        <div className="mt-4 w-full justify-between flex flex-row">
          <div>
            {currentQuestionNumber > 0 && (
              <button
                onClick={() => handleChangeQuestion("-1")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Prev Question
              </button>
            )}
          </div>
          {showRunBtn && (
            <div>
              <button
                onClick={handleSubmitCallback}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Run
              </button>
            </div>
          )}

          <div>
            <button
              onClick={() => handleChangeQuestion("1")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Next Question
            </button>
          </div>
        </div>
      </div>
      <div className="ml-5 w-full">
        <div className="flex w-full flex-row  bg-black color text-white p-5">
          <div className="ml-10">Test Result</div>
        </div>
        <div className="flex w-full flex-row justify-between bg-black color text-white p-5">
          {testCases.map((item) => {
            return (
              <div
                className="flex flex-row w-full justify-center  items-center p-5 cursor-pointer"
                onClick={() => toggleTestCase(item)}
              >
                <div>
                  <h1 className="color text-white">Test Case : {item + 1} </h1>
                </div>
                <div className="ml-5">
                  {question[item].status === true ? (
                    <div className="w-[35px] h-[35px]">
                      <CorrectAnswer />
                    </div>
                  ) : question[item].status === false ? (
                    <div className="w-[35px] h-[35px]">
                      <WrongAnswer />
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row w-full h-full bg-[#272822] justify-center items-center">
          {question.map((item, index) => (
            <div key={index} className="flex w-full flex-col">
              {expandedTestCase === index && (
                <div className="flex w-full flex-col">
                  <div className=" w-full color text-white p-3 m-2">
                    <span>Input</span>
                    <div className=" w-full color text-blue-500">
                      <h2>let input : [{question[index].input}]</h2>
                    </div>
                  </div>
                  <div className=" w-full color text-white p-3 m-2">
                    <span>Output</span>
                    <div className=" w-full color text-blue-500">
                      <h2>{question[index].yourAnswer}</h2>
                    </div>
                  </div>
                  <div className=" w-full color text-white p-3 m-2">
                    <span>Expected</span>
                    <div className=" w-full color text-blue-500">
                      <h2>{question[index].output}</h2>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

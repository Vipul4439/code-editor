import { useCallback, useEffect, useState } from "react";
import "./App.css";
import CodeEditorHome from "./components/CodeEditorHome";
import axios from "axios";

let generatedToken = "";

let socketClient = window.webstomp.over(
  new SockJS("https://api.jdoodle.com/v1/stomp"),
  { heartbeat: false, debug: true }
);

let questionCounter = 0;

function App() {
  var question1TestCases = [
    [
      { input: [1, 2, 3, 4, 5], output: 15, status: "" },
      { input: [1, 2, 3, 4], output: 10, status: "" },
      { input: [1, 2], output: 3, status: "" },
    ],
    [
      { input: [1, 1, 2, 3, 5], output: 1, status: "" },
      { input: [2, 2, 3, 4], output: 2, status: "" },
      { input: [0, 1], output: -1, status: "" },
    ],
    [
      { input: [1, 2, 3, 4, 5], k: 4, output: 3, status: "" },
      { input: [1, 2, 3, 4], k: 2, output: 1, status: "" },
      { input: [1, 2], k: 4, output: -1, status: "" },
    ],
  ];

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [questionBank, setQuestionBank] = useState([
    { question: "Write a program to sum elements in given array" },
    {
      question:
        "Print the number who is duplicate in the given array and if duplicate element not found then return -1",
    },
    {
      question:
        "Write a program print index of given k element and if k element is not present in array then return -1",
    },
  ]);
  const [value, setValue] = useState("");
  const [isExecutionStart, setIsExceuteStart] = useState(false);

  const [code, setCode] = useState([
    {
      dummyInput: "function sum(input){\n\n}\n\nconsole.log(sum(input));",
    },
    {
      dummyInput: "function print(input){\n\n}\n\nconsole.log(print(input))",
    },
    {
      dummyInput:
        "function printIndex(input){\n\n}\n\nconsole.log(printIndex(input))",
    },
  ]);

  function checker(data) {
    setValue(data);
  }

  function onWsConnection() {
    socketClient.subscribe("/user/queue/execute-i", (message) => {
      let msgId = message.headers["message-id"];
      let msgSeq = parseInt(msgId.substring(msgId.lastIndexOf("-") + 1));

      let statusCode = parseInt(message.headers.statusCode);

      if (statusCode === 201) {
        // this.wsNextId = msgSeq + 1
        return;
      }

      let t0;
      try {
        t0 = performance.now();
        while (performance.now() - t0 < 2500 && this.wsNextId !== msgSeq) {}
      } catch (e) {}

      if (statusCode === 204) {
        //executionTime = message.body
      } else if (statusCode === 500 || statusCode === 410) {
        //server error
        console.error("server error");
      } else if (statusCode === 206) {
        //outputFiles = JSON.parse(message.body)
        //returns file list - not supported in this custom api
      } else if (statusCode === 429) {
        //Daily limit reached
        console.error("daily limit reached");
      } else if (statusCode === 400) {
        tokenValid = false;
        //Invalid request - invalid signature or token expired - check the body for details
        console.error("invalid request - invalid signature or token expired");
      } else if (statusCode === 401) {
        //Unauthorised request
        console.error("Unauthorised request");
      } else {
        checker(message.body);
      }
    });
  }

  function onWsConnectionFailed(e) {
    console.error("connection failed");
    console.error(e);
  }

  const handleCodeChange = (newCode) => {
    setCode((prevCode) => {
      const updatedCode = [...prevCode];
      const currentQuestionCode = updatedCode[currentQuestionNumber];

      if (currentQuestionCode) {
        currentQuestionCode.dummyInput = newCode;
      }

      return updatedCode;
    });
  };

  const handleSubmit = () => {
    setIsExceuteStart(true);
    const executeTestCase = (index, token) => {
      const item = question1TestCases[currentQuestionNumber][index];

      if (item && item.input) {
        const stringNumberAdd = `let input = [${item.input}];\n`;
        const finalCode =
          stringNumberAdd + code[currentQuestionNumber]?.dummyInput || "";

        if (socketClient) {
          const data = JSON.stringify({
            script: finalCode,
            language: "nodejs",
            versionIndex: 4,
          });

          socketClient.send("/app/execute-ws-api-token", data, {
            message_type: "execute",
            token: token,
          });
        }

        // Call the next test case after 5 seconds
        if (index < question1TestCases.length - 1) {
          setTimeout(() => {
            executeTestCase(index + 1, token);
            questionCounter++;
          }, 3000);
        }
      } else {
        // console.log("in else");
      }
    };

    if (generatedToken === "") {
      axios
        .post("http://localhost:4000/getAuthToken")
        .then((response) => {
          generatedToken = response.data;
          executeTestCase(0, response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("in else");
      executeTestCase(0, generatedToken);
    }
  };

  const handleChangeQuestion = (value) => {
    questionCounter = 0;
    setIsExceuteStart(false);
    if (value == "-1") {
      setCurrentQuestionNumber((prev) => prev - 1);
    } else {
      if (currentQuestionNumber == question1TestCases.length - 1) {
        return;
      }
      setCurrentQuestionNumber((prev) => prev + 1);
    }
  };

  const handleSubmitFinalAnswer = () => {
    console.log("final answer submit");
  };

  useEffect(() => {
    socketClient.connect({}, () => onWsConnection(), onWsConnectionFailed);
  }, []);

  return (
    <>
      <div>
        <CodeEditorHome
          code={code[currentQuestionNumber]}
          onChange={handleCodeChange}
          handleSubmit={handleSubmit}
          handleChangeQuestion={handleChangeQuestion}
          questionBank={questionBank}
          questionArr={question1TestCases[currentQuestionNumber] || []}
          currentQuestionNumber={currentQuestionNumber}
          handleSubmitFinalAnswer={handleSubmitFinalAnswer}
          checkerFn={value}
          questionCounter={questionCounter}
          isExecutionStart={isExecutionStart}
        />
      </div>
    </>
  );
}

export default App;

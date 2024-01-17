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
  const [question1TestCases, setQuestion1TestCases] = useState([
    { input: [1, 2, 3, 4, 5], output: 15, status: false },
    { input: [1, 2, 3, 4], output: 10, status: false },
    { input: [1, 2], output: 3, status: false },
  ]);

  const [code, setCode] = useState("");

  function checker(data) {
    setQuestion1TestCases((prevTestCases) => {
      const updatedTestCases = [...prevTestCases];
      if (updatedTestCases[questionCounter].output == Number(data)) {
        updatedTestCases[questionCounter].status = true;
      } else {
        console.log("its wrong answer");
      }
      return updatedTestCases;
    });
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
    setCode(newCode);
  };

  const handleSubmit = () => {
    const executeTestCase = (index, token) => {
      const item = question1TestCases[index];

      if (item && item.input) {
        const stringNumberAdd = `let numbers = [${item.input}];\n`;
        const finalCode = stringNumberAdd + code;

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
          }, 5000);
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

  useEffect(() => {
    socketClient.connect({}, () => onWsConnection(), onWsConnectionFailed);
  }, []);

  return (
    <>
      <div>
        <CodeEditorHome
          code={code}
          onChange={handleCodeChange}
          handleSubmit={handleSubmit}
          questionArr={question1TestCases}
        />
      </div>
    </>
  );
}

export default App;

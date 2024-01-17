import React, { useState } from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-javascript";

export default function CodeEditorHome({
  code,
  onChange,
  handleSubmit,
  questionArr,
}) {
  const [question, setQuestion] = useState(questionArr);

  return (
    <div className="flex w-full h-full justify-center items-center flex-row">
      <div>
        <div className="flex w-full h-[25%] borde flex-col">
          <div>
            Question : Please write a program to add sum of given array{" "}
          </div>
          <div>Input : [{question[0].input}]</div>
          <div>Output : {question[0].output}</div>
        </div>
        <div className="flex h-[65%] mt-4">
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={onChange}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            value={code}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Excute
          </button>
        </div>
      </div>

      <div className="flex w-full h-full justify-center items-center flex-col">
        {questionArr.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-row w-full h-full p-5">
              <div className="p-5">
                <h1>Test Case : {index} </h1>
              </div>
              <div className="p-5">
                <h1>Status :{item.status.toString()}</h1>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

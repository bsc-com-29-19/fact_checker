"use client";

import { useState } from "react";
import { MenuSquareIcon, Moon, Sun, Plus } from "lucide-react";
import FactCheckComponent  from "../components/main"
import { Message } from "@copilotkit/runtime-client-gql";
export default function Home() {
  const [darkMode, setDarkMode] = useState(false);


   const factCheckData = {
     claim: "Tom's restaurant closed because of health violations",
     trueStatement: "Tom's restaurant closed.",
     falseStatement: "It closed solely because of health violations",
     wholeTruth:
       "Tom's restaurant did close, and the closure was primarily due to gross mismanagement from Tom's corporate office, as reported. While Tom cited leasing issues as the reason, evidence suggests that the space was secured well into the next spring, making the leasing claim questionable. Financial difficulties and poor management decisions appear to be the main reasons for the restaurant's abrupt closure, leaving staff with no severance and minimal notice.",
   };

  // const handleSend = async (text: string): Promise<Message> => {
  //   console.log("User input:", text);
  //   // Simulate an async operation (e.g., sending a message to a server)
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve({
  //         id: "1",
  //         text: text,
  //         timestamp: new Date(),
  //       });
  //     }, 1000);
  //   });
  // };

  return (
    <>
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {/* Navbar */}
        <nav className="flex justify-between items-center p-4 bg-gray-300 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
              <MenuSquareIcon size={25} />
            </button>
            <button className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
              <Plus size={25} />
            </button>
            <h1 className="text-xl font-bold">Fact Checker</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 rounded-full bg-blue-500 text-white">
              SG
            </button>
          </div>
        </nav>
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center p-4">
          {/* <h1 className="text-2xl font-bold mb-4">What do you want to fact check?</h1>
          <CopilotKit publicApiKey="ck_pub_0638cd0f6d605e5bc03f086a25daab99">
            <CustomInput
              inProgress={false}
              onSend={handleSend}
              isVisible={true}
            />
          </CopilotKit> */}
          <FactCheckComponent
            claim={factCheckData.claim}
            trueStatement={factCheckData.trueStatement}
            falseStatement={factCheckData.falseStatement}
            wholeTruth={factCheckData.wholeTruth}
          />
        </div>
      </div>
    </>
  );
}

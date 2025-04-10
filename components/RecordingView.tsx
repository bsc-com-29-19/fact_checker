"use client";

import { useEffect, useRef, useState } from "react";
import icon8 from "../../icons/icons8-mic-24.png";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}
interface RecordingViewProps {
  onTranscriptChange: (transcript: string) => void;
}

export default function RecordingView({
  onTranscriptChange,
}: RecordingViewProps) {
  const [isRecording, setIsRecording] = useState<Boolean>(false);
  const [recordingComplete, setRecordingComplete] = useState<Boolean>(false);
  const [transcript, setTranscript] = useState<String>("");

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    setIsRecording(true);
    onTranscriptChange("");
    // setTranscript("Some words...");

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event: any) => {
      const { transcript } = event.results[event.results.length - 1][0];
      // setTranscript(transcript);
        onTranscriptChange(transcript);
    };
    recognitionRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop;
      }
    };
  });
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordingComplete(!isRecording);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full ">
      {/* {transcript session } */}
      <div className="w-full">
        {(isRecording || transcript) && (
          <div className="w-1/4 m-auto  bg-white">
            {transcript && (
              <div className="rounded-md mt-4">
                <p className="mb-0">{transcript}</p>
              </div>
            )}
          </div>
        )}
        {/* {button to do the recording } */}
        <div className="flex items-center w-full">
          {isRecording ? (
            <button
              className="rounded-full w-22h-22 mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500"
              onClick={handleToggleRecording}
            >
              {isRecording ? (
                <FaMicrophoneSlash size={24} className="animate-pulse" />
              ) : (
                <FaMicrophone size={24} />
              )}
            </button>
          ) : (
            <button
              className="rounded-full w-22 h-22 mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500"
              onClick={handleToggleRecording}
            >
              {isRecording ? (
                <FaMicrophoneSlash size={24} />
              ) : (
                <FaMicrophone size={24} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { cn } from "@/lib/utils";

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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");

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
        recognitionRef.current.stop();
      }
    };
  }, []);
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
    <div className="flex flex-col items-center justify-center">
      {/* Transcript Session (Responsive Width) */}
      {(isRecording || transcript) && (
        <div className="w-full max-w-md mx-auto rounded-md bg-white dark:bg-gray-800 p-2 text-center shadow-sm mb-4">
          <p className="mb-0 text-gray-700 dark:text-gray-300">
            {transcript || "Listening..."}
          </p>
        </div>
      )}

      {/* Refactored & Responsive Button */}
      <div className="flex items-center w-full justify-center">
        <button
          className={cn(
            "rounded-full flex items-center justify-center transition-colors",
            "w-10 h-10 md:w-12 md:h-12", // Responsive size
            {
              "bg-red-500 hover:bg-red-600": isRecording,
              "bg-[#6766FC] hover:bg-[#6766FC]": !isRecording,
            }
          )}
          onClick={handleToggleRecording}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? (
            <FaMicrophoneSlash size={24} className="text-white animate-pulse" />
          ) : (
            <FaMicrophone size={24} className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
}

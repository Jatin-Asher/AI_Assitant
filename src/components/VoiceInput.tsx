"use client";

import { useEffect, useRef, useState } from "react";

type VoiceInputProps = {
  onTranscript: (text: string) => void;
  disabled?: boolean;
};

export function VoiceInput({ onTranscript, disabled = false }: VoiceInputProps) {
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptRef = useRef("");
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const callbackRef = useRef(onTranscript);
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("brave" in navigator) {
      setFallbackMode(true);
      setStatusMessage("Brave detected. Using audio transcription for more reliable voice input.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (typeof MediaRecorder === "undefined") {
        setIsSupported(false);
        setStatusMessage("Voice input is not supported in this browser. You can keep typing manually.");
        return;
      }

      setFallbackMode(true);
      setStatusMessage("Browser speech recognition is unavailable. Using audio transcription instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage("Listening...");
      resetSilenceTimer();
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = transcriptRef.current;
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) {
          finalTranscript += `${transcript} `;
        } else {
          interimTranscript += transcript;
        }
      }

      transcriptRef.current = finalTranscript.trim();
      callbackRef.current(`${finalTranscript}${interimTranscript}`.trim());
      setStatusMessage("Listening...");
      resetSilenceTimer();
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      clearSilenceTimer();

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setStatusMessage("Microphone permission was denied. Please allow mic access or type manually.");
        return;
      }

      if (event.error === "audio-capture") {
        setStatusMessage("No microphone was detected. Check your device audio settings and try again.");
        return;
      }

      if (event.error === "network") {
        setFallbackMode(true);
        setStatusMessage("Browser speech recognition could not connect. Switching to audio transcription.");
        return;
      }

      if (event.error === "no-speech") {
        setStatusMessage("No speech detected. Tap the mic and try again.");
        return;
      }

      setStatusMessage("Voice input ran into an error. You can continue by typing.");
    };

    recognition.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
      setStatusMessage((current) => current || "Voice input stopped.");
    };

    recognitionRef.current = recognition;

    return () => {
      clearSilenceTimer();
      recognition.stop();
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      recognitionRef.current = null;
      mediaRecorderRef.current = null;
      streamRef.current = null;
    };
  }, []);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      if (fallbackMode) {
        mediaRecorderRef.current?.stop();
      } else {
        recognitionRef.current?.stop();
      }
      setStatusMessage("Stopped listening after 5 seconds of silence.");
    }, 5000);
  };

  const transcribeRecordedAudio = async (audioBlob: Blob) => {
    setStatusMessage("Transcribing audio...");

    const arrayBuffer = await audioBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    const audioBase64 = btoa(binary);

    const response = await fetch("http://localhost:5000/api/tutor/transcribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioBase64,
        mimeType: audioBlob.type || "audio/webm",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to transcribe audio.");
    }

    callbackRef.current(data.transcript || "");
    setStatusMessage("Voice input added to the chat box.");
  };

  const startFallbackRecording = async () => {
    try {
      if (!streamRef.current && navigator.mediaDevices?.getUserMedia) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (!streamRef.current || typeof MediaRecorder === "undefined") {
        setStatusMessage("Audio recording is not supported here. Please type manually.");
        return;
      }

      chunksRef.current = [];
      const recorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = recorder;

      recorder.onstart = () => {
        setIsListening(true);
        setStatusMessage("Listening...");
        resetSilenceTimer();
      };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setIsListening(false);
        clearSilenceTimer();
        setStatusMessage("Recording failed. Please try again or type manually.");
      };

      recorder.onstop = async () => {
        setIsListening(false);
        clearSilenceTimer();

        if (!chunksRef.current.length) {
          setStatusMessage("No audio captured. Please try again.");
          return;
        }

        try {
          const mimeType = chunksRef.current[0]?.type || "audio/webm";
          const audioBlob = new Blob(chunksRef.current, { type: mimeType });
          await transcribeRecordedAudio(audioBlob);
        } catch (error: any) {
          setStatusMessage(error.message || "Audio transcription failed. Please type manually.");
        }
      };

      recorder.start();
    } catch {
      setIsListening(false);
      setStatusMessage("Could not start voice input. Allow microphone access and try again.");
    }
  };

  const toggleListening = async () => {
    if (disabled) {
      return;
    }

    if (isListening) {
      if (fallbackMode) {
        mediaRecorderRef.current?.stop();
      } else {
        recognitionRef.current?.stop();
      }
      setStatusMessage("Voice input stopped.");
      return;
    }

    transcriptRef.current = "";
    setStatusMessage("Listening...");

    if (fallbackMode) {
      await startFallbackRecording();
      return;
    }

    if (!recognitionRef.current) {
      setStatusMessage("Voice input is not ready in this browser. Please type manually.");
      return;
    }

    try {
      if (!streamRef.current && navigator.mediaDevices?.getUserMedia) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
      setStatusMessage("Could not start voice input. Use Chrome or Edge, allow microphone access, and try again.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleListening}
        disabled={!isSupported || disabled}
        title="Start Voice Input"
        aria-label={isListening ? "Stop voice input" : "Start voice input"}
        className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
          isListening
            ? "border-red-400 bg-red-500 text-white shadow-[0_0_0_6px_rgba(239,68,68,0.16)] animate-pulse"
            : "border-violet-300 bg-white text-violet-700 hover:bg-violet-50 dark:border-violet-700/40 dark:bg-slate-900 dark:text-violet-200 dark:hover:bg-slate-800"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className="material-symbols-outlined">{isListening ? "mic" : "mic_none"}</span>
      </button>
      <div className="min-w-[96px] text-xs">
        {isListening ? (
          <span className="font-medium text-red-500">Listening...</span>
        ) : statusMessage ? (
          <span className="text-slate-500 dark:text-slate-400">{statusMessage}</span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">Voice input</span>
        )}
      </div>
    </div>
  );
}

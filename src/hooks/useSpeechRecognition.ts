import { useState, useEffect, useRef } from 'react';
import { VoiceCommand } from '../types';

// Type definitions for Web Speech API
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: (event: ISpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface ISpeechRecognitionEvent {
  results: ISpeechRecognitionResultList;
  resultIndex: number;
}

interface ISpeechRecognitionResultList {
  length: number;
  [index: number]: ISpeechRecognitionResult;
}

interface ISpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: ISpeechRecognitionAlternative;
}

interface ISpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          const command: VoiceCommand = {
            text: finalTranscript.trim(),
            confidence: event.results[event.results.length - 1][0].confidence,
            timestamp: Date.now()
          };
          
          // Set processing state immediately
          setIsProcessingCommand(true);
          
          // Clear timeout and stop listening
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
          }
          
          // Add command and clear transcript
          setCommands(prev => [...prev, command]);
          setTranscript('');
          setIsTimedOut(false);
        } else {
          setTranscript(event.results[event.results.length - 1][0].transcript);
        }
      };
      
      recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        
        // Clear timeout on error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        setIsListening(false);
        setIsTimedOut(false); // Reset timeout state
      };
      
      recognition.onend = () => {
        // Clear timeout when recognition ends
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setIsTimedOut(false);
      setIsProcessingCommand(false);
      recognitionRef.current.start();
      setIsListening(true);
      
      // Set a timeout to automatically stop listening after 10 seconds
      timeoutRef.current = setTimeout(() => {
        console.log('Speech recognition timed out after 10 seconds');
        setIsTimedOut(true);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          setIsListening(false);
        }
      }, 10000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      // Clear timeout when manually stopping
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      recognitionRef.current.stop();
      setIsListening(false);
      setIsTimedOut(false);
      setIsProcessingCommand(false);
    }
  };

  const clearCommands = () => {
    setCommands([]);
    setTranscript('');
    setIsTimedOut(false);
    setIsProcessingCommand(false);
  };

  const resetProcessingState = () => {
    setIsProcessingCommand(false);
  };

  return {
    isListening,
    isSupported,
    transcript,
    commands,
    isTimedOut,
    isProcessingCommand,
    startListening,
    stopListening,
    clearCommands,
    resetProcessingState
  };
};
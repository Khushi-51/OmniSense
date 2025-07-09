import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useVibration } from '../hooks/useVibration';

interface VoiceInterfaceProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
  response?: string;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  onCommand, 
  isProcessing, 
  response 
}) => {
  const { 
    isListening, 
    isSupported, 
    transcript, 
    commands,
    isProcessingCommand,
    startListening, 
    stopListening,
    resetProcessingState
  } = useSpeechRecognition();
  
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { vibrateSuccess, vibrateError } = useVibration();
  
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Handle new voice commands
  useEffect(() => {
    if (commands.length > 0) {
      const latestCommand = commands[commands.length - 1];
      if (latestCommand.confidence > 0.7) {
        vibrateSuccess();
        onCommand(latestCommand.text);
      } else {
        vibrateError();
        resetProcessingState();
      }
    }
  }, [commands, onCommand, vibrateSuccess, vibrateError, resetProcessingState]);

  // Reset processing state when main processing starts
  useEffect(() => {
    if (isProcessing) {
      resetProcessingState();
    }
  }, [isProcessing, resetProcessingState]);

  // Handle AI responses
  useEffect(() => {
    if (response && audioEnabled && !isSpeaking) {
      speak(response);
    }
  }, [response, audioEnabled, speak, isSpeaking]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stop();
    }
    setAudioEnabled(!audioEnabled);
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-700">Speech recognition is not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Voice Assistant</h2>
        <button
          onClick={handleToggleAudio}
          className={`p-2 rounded-full transition-all ${
            audioEnabled 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
          title={audioEnabled ? 'Disable audio' : 'Enable audio'}
        >
          {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      <div className="relative">
        <button
          onClick={handleToggleListening}
          disabled={isProcessing || isProcessingCommand}
          className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105 animate-pulse'
              : isProcessing
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : isProcessingCommand
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
          }`}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          <span className="text-lg">
            {isProcessing
              ? 'Processing...'
              : isProcessingCommand
              ? 'Command received...'
              : isListening
              ? 'Listening... Tap to stop'
              : 'Tap to speak'
            }
          </span>
        </button>

        {(isListening || isProcessingCommand) && (
          <div className={`absolute inset-0 rounded-xl border-2 transition-colors duration-300 ${
            isListening 
              ? 'border-red-300 animate-ping' 
              : 'border-green-300 animate-pulse'
          }`} />
        )}
      </div>

      {transcript && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700 font-medium">Listening:</p>
          <p className="text-blue-800">{transcript}</p>
        </div>
      )}

      {commands.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-sm text-gray-700 font-medium">Recent Commands:</p>
          <div className="space-y-1 mt-2">
            {commands.slice(-3).map((command, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-800">{command.text}</span>
                <span className="text-gray-500">
                  {Math.round(command.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {response && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700 font-medium">Assistant Response:</p>
          <p className="text-green-800 mt-1">{response}</p>
          {isSpeaking && (
            <div className="flex items-center space-x-2 mt-2">
              <Volume2 size={16} className="text-green-600 animate-pulse" />
              <span className="text-green-600 text-sm">Speaking...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
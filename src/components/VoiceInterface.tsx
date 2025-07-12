import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
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
  isListening = false,
  isSupported = false,
  transcript = '',
  commands = [],
  isProcessingCommand = false,
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
      vibrateSuccess?.();
      onCommand?.(latestCommand.text.trim());
    } else {
      vibrateError?.();
    }
    resetProcessingState?.();
  }
}, [commands, onCommand, resetProcessingState, vibrateError, vibrateSuccess]);


  // Reset processing state when main processing starts
  useEffect(() => {
    if (isProcessing) {
      resetProcessingState();
    }
  }, [isProcessing, resetProcessingState]);

  // Handle AI responses
  useEffect(() => {
    if (response && audioEnabled && !isSpeaking && speak) {
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
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <MicOff size={32} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Voice Recognition Unavailable</h3>
        <p className="text-red-700">Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Voice Assistant</h2>
          <p className="text-gray-600">Speak naturally to search for products</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleAudio}
            className={`p-3 rounded-xl transition-all duration-300 ${
              audioEnabled 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-lg' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={audioEnabled ? 'Disable audio' : 'Enable audio'}
          >
            {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full">
            <Sparkles size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">AI Powered</span>
          </div>
        </div>
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
          <span className="text-lg flex items-center gap-2">
            {isProcessing && <span className="w-4 h-4 border-2 border-t-2 border-blue-500 rounded-full animate-spin"></span>}
            {isProcessing
              ? 'Processing...'
              : isProcessingCommand
              ? 'Command received...'
              : isListening
              ? 'Listening... Tap to stop'
              : 'Tap to speak'}
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
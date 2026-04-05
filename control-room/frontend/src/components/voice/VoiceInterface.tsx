import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, X, MessageSquare, Command } from 'lucide-react';

interface VoiceInterfaceProps {
  active: boolean;
  onToggle: () => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ active, onToggle }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [commands] = useState([
    { phrase: 'status report', description: 'Show system overview' },
    { phrase: 'show analytics', description: 'Open analytics panel' },
    { phrase: 'mission timeline', description: 'Display 3D timeline' },
    { phrase: 'agent network', description: 'Show agent visualization' },
    { phrase: 'predictive analysis', description: 'Run forecasting' },
    { phrase: 'good morning', description: 'Time-based greeting' },
    { phrase: 'clear notifications', description: 'Clear all alerts' },
    { phrase: 'system check', description: 'Run diagnostics' },
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + ' ' + transcript);
            processCommand(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        // Update with interim results for real-time feedback
        if (interimTranscript) {
          setTranscript(prev => {
            const base = prev.split(' ').slice(0, -1).join(' ');
            return base + ' ' + interimTranscript;
          });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setListening(false);
        setResponse('Speech recognition error. Please try again.');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processCommand = (command: string) => {
    const normalized = command.toLowerCase().trim();
    let responseText = '';

    if (normalized.includes('status') || normalized.includes('report')) {
      responseText = 'All systems operational. CPU at 45%, memory at 68%. All agents active.';
    } else if (normalized.includes('analytics')) {
      responseText = 'Opening analytics dashboard. Showing predictive trends and performance metrics.';
    } else if (normalized.includes('mission') || normalized.includes('timeline')) {
      responseText = 'Displaying 3D mission timeline. Current progress: 75% complete.';
    } else if (normalized.includes('agent') || normalized.includes('network')) {
      responseText = 'Rendering agent network visualization. 5 active nodes detected.';
    } else if (normalized.includes('predict') || normalized.includes('analysis')) {
      responseText = 'Running predictive analysis. Forecasting next 24 hours with 92% confidence.';
    } else if (normalized.includes('good morning')) {
      responseText = 'Good morning, BOSS. Coffee is brewing and systems are ready.';
    } else if (normalized.includes('good afternoon')) {
      responseText = 'Good afternoon, BOSS. Systems performing optimally.';
    } else if (normalized.includes('good evening')) {
      responseText = 'Good evening, BOSS. Night mode activated. Systems on standby.';
    } else if (normalized.includes('clear') && normalized.includes('notification')) {
      responseText = 'Clearing all notifications. Alert center is now empty.';
    } else if (normalized.includes('system') && normalized.includes('check')) {
      responseText = 'Running full system diagnostic. All components reporting healthy status.';
    } else {
      responseText = `Command received: "${command}". Processing request...`;
    }

    setResponse(responseText);
    speak(responseText);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Try to find a good voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Alex')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
      setTranscript('');
      setResponse('Listening... Speak your command.');
      speak('Listening for your command, BOSS.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
      setResponse('Voice recognition stopped.');
    }
  };

  const handleToggle = () => {
    if (active && listening) {
      stopListening();
    } else if (active) {
      startListening();
    }
    onToggle();
  };

  if (!active) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="holographic-glass rounded-2xl shadow-holographic border border-vertex-surface/50 w-96">
        {/* Header */}
        <div className="p-4 border-b border-vertex-surface/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${listening ? 'bg-vertex-green animate-pulse' : 'bg-vertex-purple'}`} />
            <h3 className="font-semibold">Voice Interface</h3>
            <span className="text-xs px-2 py-1 bg-vertex-blue/20 text-vertex-blue rounded">
              JARVIS Mode
            </span>
          </div>
          <button
            onClick={handleToggle}
            className="p-2 hover:bg-vertex-surface/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {/* Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {listening ? (
                  <Volume2 className="w-5 h-5 text-vertex-green" />
                ) : (
                  <Mic className="w-5 h-5 text-vertex-purple" />
                )}
                <span className="font-medium">
                  {listening ? 'Listening...' : 'Ready for command'}
                </span>
              </div>
              <button
                onClick={listening ? stopListening : startListening}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${listening ? 'bg-vertex-danger/20 text-vertex-danger hover:bg-vertex-danger/30' : 'bg-vertex-blue/20 text-vertex-blue hover:bg-vertex-blue/30'}`}
              >
                {listening ? 'Stop' : 'Start Listening'}
              </button>
            </div>

            {/* Transcript */}
            <div className="mb-4">
              <div className="text-sm text-vertex-cyan/70 mb-2">Transcript</div>
              <div className="p-3 bg-vertex-surface/30 rounded-lg min-h-[60px]">
                {transcript || 'Speak to see transcript here...'}
              </div>
            </div>

            {/* Response */}
            {response && (
              <div className="mb-4">
                <div className="text-sm text-vertex-cyan/70 mb-2">Response</div>
                <div className="p-3 bg-vertex-green/10 border border-vertex-green/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-vertex-green mt-1 flex-shrink-0" />
                    <div className="text-sm">{response}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Available Commands */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Command className="w-4 h-4 text-vertex-amber" />
              <div className="text-sm font-medium">Available Commands</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {commands.map((cmd, index) => (
                <div
                  key={index}
                  className="p-3 bg-vertex-surface/30 rounded-lg hover:bg-vertex-surface/50 transition-colors cursor-pointer"
                  onClick={() => {
                    processCommand(cmd.phrase);
                    setTranscript(cmd.phrase);
                  }}
                >
                  <div className="text-xs text-vertex-cyan/70 mb-1">Say:</div>
                  <div className="text-sm font-medium">"{cmd.phrase}"</div>
                  <div className="text-xs text-vertex-purple/70 mt-1">{cmd.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-vertex-surface/50 text-xs text-vertex-cyan/70">
          <div className="flex items-center justify-between">
            <span>Voice recognition active</span>
            <span>Confidence: {listening ? 'High' : 'Standby'}</span>
          </div>
        </div>
      </div>

      {/* Pulse Effect */}
      {listening && (
        <div className="absolute inset-0 rounded-2xl border-2 border-vertex-green/30 animate-ping" />
      )}
    </div>
  );
};

export default VoiceInterface;
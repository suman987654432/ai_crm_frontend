import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Activity, Loader2, Volume2 } from 'lucide-react';

interface VoicePlaygroundProps {
  agent: any;
  onClose: () => void;
}

export default function VoicePlayground({ agent, onClose }: VoicePlaygroundProps) {
  const [status, setStatus] = useState<'initializing' | 'connected' | 'listening' | 'processing' | 'thinking' | 'speaking' | 'ended' | 'error'>('initializing');
  const [transcript, setTranscript] = useState<{ role: string, text: string, timestamp: number }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  
  const IS_RECORDING_REF = useRef(false);

  useEffect(() => {
    // 1. Initialize Test Session
    fetch(`http://localhost:5000/api/v1/agents/${agent.id}/test-session`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSessionId(data.data.sessionId);
          connectWebSocket(data.data.wsUrl, data.data.sessionId);
        }
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });

    return () => {
      endTest();
    };
  }, []);

  const connectWebSocket = (url: string, sid: string) => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      ws.send(JSON.stringify({ type: 'start', agentId: agent.id }));
      startMicrophone();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'status') {
        setStatus(data.status);
        if (data.status === 'speaking') {
           stopRecording(); // Stop recording while AI speaks unless interruption is manually handled
        } else if (data.status === 'listening') {
           startRecordingChunk();
        }
      } else if (data.type === 'user_transcript') {
        setTranscript(prev => [...prev, { role: 'You', text: data.text, timestamp: Date.now() }]);
      } else if (data.type === 'ai_transcript') {
        setTranscript(prev => [...prev, { role: 'AI', text: data.text, timestamp: Date.now() }]);
      } else if (data.type === 'audio') {
        playAudioBuffer(data.audio);
      } else if (data.type === 'error') {
        console.error("WS Error:", data.message);
      }
    };

    ws.onclose = () => {
      if (status !== 'ended') setStatus('ended');
    };
  };

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      microphone.connect(analyser);
      
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      audioContextRef.current = audioContext;

      // We'll use MediaRecorder to capture chunks
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          chunksRef.current = []; // reset
          sendAudioToBackend(blob);
        }
      };

      monitorSilence();
      startRecordingChunk();

    } catch (err) {
      console.error("Mic access denied:", err);
      setStatus('error');
    }
  };

  const startRecordingChunk = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      chunksRef.current = [];
      mediaRecorderRef.current.start();
      IS_RECORDING_REF.current = true;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      IS_RECORDING_REF.current = false;
      mediaRecorderRef.current.stop();
    }
  };

  const monitorSilence = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const checkAudioLevel = () => {
      if (!IS_RECORDING_REF.current) {
        requestAnimationFrame(checkAudioLevel);
        return;
      }

      analyserRef.current!.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      let average = sum / dataArray.length;

      // Extremely simple VAD
      if (average > 15) {
        // Speech detected
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else {
        // Silence detected
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            // Silence threshold reached (e.g., 1.5 seconds)
            stopRecording();
          }, 1500);
        }
      }

      requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();
  };

  const sendAudioToBackend = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64Audio = (reader.result as string).split(',')[1];
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'user_audio', audio: base64Audio }));
      }
    };
  };

  const playAudioBuffer = (base64Audio: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    audioPlayerRef.current = audio;
    audio.play();
    audio.onended = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'interruption' })); // Basically just telling backend we finished TTS
      }
    };
  };

  const endTest = () => {
    stopRecording();
    IS_RECORDING_REF.current = false;
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (sessionId) {
      fetch(`http://localhost:5000/api/v1/test-sessions/${sessionId}/end`, { method: 'POST' }).catch(console.error);
    }
    setStatus('ended');
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col md:flex-row font-sans text-gray-200">
      
      {/* LEFT PANEL: Agent Status */}
      <div className="w-full md:w-1/3 border-r border-[#222] bg-[#111] p-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mic className="h-5 w-5 text-indigo-500" /> Voice Playground
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#222] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-[#1c1c1c] rounded-xl border border-[#333] p-5 mb-8 flex-1">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Agent Context</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Name</p>
              <p className="text-base text-gray-200 font-medium">{agent.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Voice Profile</p>
              <p className="text-base text-gray-200">{agent.voice_config?.voice_name || 'Sarvam AI'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Language</p>
              <p className="text-base text-gray-200">{agent.language}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Current Status</p>
              <div className="flex items-center gap-2 mt-1">
                {status === 'listening' && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
                {status === 'thinking' && <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />}
                {status === 'speaking' && <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />}
                {(status === 'ended' || status === 'error') && <div className="h-2 w-2 rounded-full bg-red-500" />}
                <p className="text-sm font-bold capitalize text-white flex items-center gap-2">
                  {status === 'listening' && <><Activity className="h-4 w-4 text-green-500" /> Listening...</>}
                  {status === 'processing' && <><Loader2 className="h-4 w-4 text-indigo-500 animate-spin" /> Processing...</>}
                  {status === 'thinking' && <><Loader2 className="h-4 w-4 text-indigo-500 animate-spin" /> Thinking...</>}
                  {status === 'speaking' && <><Volume2 className="h-4 w-4 text-purple-500" /> Speaking...</>}
                  {status === 'connected' && 'Connected'}
                  {status === 'initializing' && 'Initializing...'}
                  {status === 'ended' && 'Test Ended'}
                  {status === 'error' && 'Error'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={status === 'ended' ? onClose : endTest}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            status === 'ended' 
              ? 'bg-[#333] text-white hover:bg-[#444]'
              : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
          }`}
        >
          {status === 'ended' ? 'Close Playground' : 'End Test Session'}
        </button>
      </div>

      {/* RIGHT PANEL: Live Transcript */}
      <div className="w-full md:w-2/3 bg-[#0a0a0a] p-8 flex flex-col">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-6">Live Transcript</h3>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
          {transcript.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'You' ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-500 font-medium mb-1 tracking-wide uppercase">
                {msg.role}
              </span>
              <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${
                msg.role === 'You' 
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-[#1c1c1c] border border-[#333] text-gray-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {transcript.length === 0 && status !== 'initializing' && status !== 'error' && (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Say "Hello" to start the conversation...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

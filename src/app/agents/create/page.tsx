"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronRight, ChevronDown, Bot, Search, Play, UploadCloud,
  FileText, CheckCircle2, ArrowRight, ArrowLeft, Variable, Volume2
} from 'lucide-react';

const steps = [
  { id: 1, name: 'Basic Details' },
  { id: 2, name: 'Voice & Language' },
  { id: 3, name: 'Instructions' },
  { id: 4, name: 'Knowledge Base' },
  { id: 5, name: 'Review & Create' },
];

function WizardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');

  const [activeStep, setActiveStep] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState('Priya');
  const [agentName, setAgentName] = useState('');
  const [category, setCategory] = useState('Sales & Lead Gen');
  const [language, setLanguage] = useState('Hindi + English (Hinglish)');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // Voice & Speech States
  const [speechSpeed, setSpeechSpeed] = useState('1.0x');
  const [allowInterruption, setAllowInterruption] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<{ voiceId: string, voiceName: string, gender: string, supportedLanguages: string[], provider: string }[]>([]);
  const [genderFilter, setGenderFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/voices?provider=sarvam')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvailableVoices(data.data);
          if (data.data.length > 0 && !editId) {
            setSelectedVoice(data.data[0].voiceId);
          }
        }
      })
      .catch(console.error);
  }, [editId]);

  // Edit Mode Hydration
  useEffect(() => {
    if (editId) {
      fetch(`http://localhost:5000/api/v1/agents/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const agent = data.data;
            setAgentName(agent.name || '');
            setCategory(agent.category || 'Sales & Lead Gen');
            setLanguage(agent.language || 'Hindi + English (Hinglish)');
            setPrimaryGoal(agent.primary_goal || '');
            
            if (agent.ai_config) {
              setInstructionText(agent.ai_config.system_prompt || instructionText);
            }
            if (agent.voice_config) {
              setSelectedVoice(agent.voice_config.voice_id || 'priya');
            }
          }
        })
        .catch(err => console.error("Failed to load agent for editing:", err));
    }
  }, [editId]);

  // Knowledge Base States
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string, size: string }[]>([]);

  const [showVariableDropdown, setShowVariableDropdown] = useState(false);
  const [instructionText, setInstructionText] = useState(`You are an AI sales assistant. Your role is to politely introduce yourself, verify if you are speaking with {{customer_name}}, and ask if they have a few minutes to discuss their recent inquiry regarding our services. 

Guidelines:
1. Always maintain a professional and empathetic tone.
2. If the user is busy, offer to schedule a callback for later.
3. Do not invent pricing information; refer to the provided knowledge base.
4. Keep responses under 2 sentences to allow a natural conversational flow.`);

  const handleNext = () => {
    if (activeStep === 1 && !agentName.trim()) {
      alert("Agent Name is required!");
      return;
    }
    if (activeStep < steps.length) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 1) setActiveStep(prev => prev - 1);
  };

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/voices/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'sarvam',
          voiceId: selectedVoice.toLowerCase(),
          text: language.includes('Hindi') ? 'नमस्ते! मैं आपका एआई असिस्टेंट बोल रहा हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?' : 'Hello! I am your AI assistant. How can I help you today?',
          language: 'hi-IN',
          speed: speechSpeed === '1.0x' ? 1.0 : speechSpeed === '1.25x' ? 1.25 : 0.75
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.data.audioBase64}`);
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => setIsPlaying(false);
          audio.play();
          return;
        }
      }
      setIsPlaying(false);
      alert('Failed to play audio preview.');
    } catch (error) {
      console.error(error);
      setIsPlaying(false);
      alert('Error fetching audio preview.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(1) + ' MB'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] -m-8 bg-[#121212]">

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col border-b border-[#333333] bg-[#1c1c1c] shrink-0">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/agents" className="text-gray-400 hover:text-white transition-colors">AI Agents</Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="text-gray-200 font-medium">{editId ? 'Edit Agent' : 'Create Agent'}</span>
          </div>
          <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-md hover:bg-[#252525]">
            Save as Draft
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pb-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${activeStep > step.id ? 'bg-indigo-600 text-white' :
                    activeStep === step.id ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' :
                      'bg-[#252525] text-gray-500 border border-[#333333]'
                    }`}>
                    {activeStep > step.id ? <CheckCircle2 className="h-3 w-3" /> : step.id}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${activeStep >= step.id ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${activeStep > step.id ? 'bg-indigo-600' : 'bg-[#333333]'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center p-4 sm:p-8 overflow-hidden">
        <div className="w-full max-w-5xl bg-[#1c1c1c] border border-[#333333] rounded-xl shadow-sm flex flex-col h-[600px]">

          {/* Scrollable Step Content */}
          <div className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* STEP 1: Basic Information */}
            {activeStep === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-white">Basic Information</h2>
                  <p className="text-gray-400 mt-2">Let's start by giving your agent an identity and defining its primary goal.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="e.g. Sales Follow-up Agent"
                      className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Agent Category</label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                        >
                          <option>Sales & Lead Gen</option>
                          <option>Customer Support</option>
                          <option>Appointment Booking</option>
                          <option>General Assistant</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Primary Language</label>
                      <div className="relative">
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                        >
                          <option>Hindi + English (Hinglish)</option>
                          <option>English (US)</option>
                          <option>Hindi</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Goal</label>
                    <textarea
                      rows={4}
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      placeholder="What should this agent achieve? e.g. Qualify new leads and schedule a follow-up."
                      className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Voice & Language */}
            {activeStep === 2 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Voice Selection</h2>
                    <p className="text-gray-400 mt-1">Choose how your AI agent will sound to customers on the phone.</p>
                  </div>
                  
                  {/* Gender Filter */}
                  <div className="flex bg-[#252525] rounded-md p-1 border border-[#333333]">
                    {['All', 'Female', 'Male'].map(gender => (
                      <button 
                        key={gender}
                        onClick={() => setGenderFilter(gender)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors ${genderFilter === gender ? 'bg-[#333333] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Voice Profile</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                      {availableVoices.filter(v => genderFilter === 'All' || v.gender === genderFilter).map(voice => (
                        <div 
                          key={voice.voiceId}
                          onClick={() => setSelectedVoice(voice.voiceId)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedVoice === voice.voiceId ? 'bg-indigo-500/10 border-indigo-500' : 'bg-[#1c1c1c] border-[#333333] hover:border-[#555555]'}`}
                        >
                          <p className={`font-medium text-sm ${selectedVoice === voice.voiceId ? 'text-indigo-400' : 'text-gray-200'}`}>{voice.voiceName}</p>
                          <p className="text-xs text-gray-500 mt-1">{voice.gender} · {voice.provider === 'sarvam' ? 'Sarvam AI' : voice.provider}</p>
                        </div>
                      ))}
                      {availableVoices.length === 0 && (
                         <div className="col-span-full p-4 text-center text-gray-500 text-sm border border-[#333333] rounded-lg border-dashed">
                           Loading voices...
                         </div>
                      )}
                    </div>
                  </div>

                  {/* Audio Preview for selected voice */}
                  <div className="flex items-center justify-between p-4 bg-[#1c1c1c] border border-[#333333] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#252525] border border-[#333333] flex items-center justify-center">
                        <Volume2 className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Preview {availableVoices.find(v => v.voiceId === selectedVoice)?.voiceName || selectedVoice}'s Voice</p>
                        <p className="text-xs text-gray-400">Click play to generate & hear a sample audio.</p>
                      </div>
                    </div>
                    <button
                      onClick={handlePlayAudio}
                      disabled={isPlaying}
                      className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-600/50"
                    >
                      {isPlaying ? (
                        <>
                          <div className="h-4 w-4 rounded-full bg-white/20 animate-pulse flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white animate-ping"></div>
                          </div>
                          Playing...
                        </>
                      ) : (
                        <><Play className="h-4 w-4" /> Play Audio</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#333333] flex gap-8">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Speech Speed</label>
                    <div className="relative">
                      <select
                        value={speechSpeed}
                        onChange={(e) => setSpeechSpeed(e.target.value)}
                        className="w-full bg-[#121212] border border-[#333333] rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                      >
                        <option value="1.0x">Normal (1.0x)</option>
                        <option value="1.25x">Fast (1.25x)</option>
                        <option value="0.75x">Slow (0.75x)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Allow Interruption</label>
                    <div className="flex items-center h-[42px] px-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={allowInterruption}
                          onChange={(e) => setAllowInterruption(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-[#333333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-300">Customers can interrupt agent</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Instructions */}
            {activeStep === 3 && (
              <div className="animate-in fade-in duration-300 flex flex-col h-full">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">System Instructions</h2>
                    <p className="text-gray-400 mt-2">Write the base prompt that guides the AI's behavior and rules.</p>
                  </div>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md transition-colors shrink-0">
                    <Bot className="h-4 w-4" /> AI Prompt Generator
                  </button>
                </div>

                <div className="flex-1 flex flex-col rounded-xl border border-[#333333] bg-[#121212] overflow-hidden min-h-[300px]">
                  <div className="flex items-center gap-2 p-2.5 border-b border-[#333333] bg-[#1c1c1c]">
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#252525] rounded transition-colors border border-transparent hover:border-[#333333]">Improve Prompt</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#252525] rounded transition-colors border border-transparent hover:border-[#333333]">Make Concise</button>
                    <div className="flex-1"></div>
                    <div className="relative">
                      <button
                        onClick={() => setShowVariableDropdown(!showVariableDropdown)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-400 flex items-center gap-1.5 hover:bg-indigo-500/10 rounded transition-colors border border-indigo-500/20"
                      >
                        <Variable className="h-3 w-3" /> Insert Variable <ChevronDown className="h-3 w-3 ml-0.5 opacity-70" />
                      </button>

                      {showVariableDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-[#1c1c1c] border border-[#333333] rounded-md shadow-lg overflow-hidden z-10">
                          <div className="p-1">
                            <button
                              onClick={() => { setInstructionText(prev => prev + ' {{customer_name}}'); setShowVariableDropdown(false); }}
                              className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#252525] rounded transition-colors"
                            >
                              <span className="text-indigo-400 mr-2">{`{{customer_name}}`}</span> Customer Name
                            </button>
                            <button
                              onClick={() => { setInstructionText(prev => prev + ' {{company}}'); setShowVariableDropdown(false); }}
                              className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#252525] rounded transition-colors"
                            >
                              <span className="text-indigo-400 mr-2">{`{{company}}`}</span> Company
                            </button>
                            <button
                              onClick={() => { setInstructionText(prev => prev + ' {{date}}'); setShowVariableDropdown(false); }}
                              className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#252525] rounded transition-colors"
                            >
                              <span className="text-indigo-400 mr-2">{`{{date}}`}</span> Current Date
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <textarea
                    value={instructionText}
                    onChange={(e) => setInstructionText(e.target.value)}
                    className="flex-1 w-full bg-transparent text-gray-300 p-6 font-mono text-sm leading-relaxed focus:outline-none resize-none overflow-y-auto custom-scrollbar"
                  ></textarea>
                </div>
              </div>
            )}

            {/* STEP 4: Knowledge Base */}
            {activeStep === 4 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-white">Knowledge Base</h2>
                  <p className="text-gray-400 mt-2">Upload documents or link URLs so the agent can answer specific business questions.</p>
                </div>

                <div className="border-2 border-dashed border-[#444444] rounded-xl p-6 max-w-lg mx-auto w-full flex flex-col items-center justify-center text-center hover:border-indigo-500 hover:bg-[#121212] transition-all cursor-pointer bg-[#1c1c1c] mb-6 relative">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  <div className="h-10 w-10 rounded-full bg-[#252525] flex items-center justify-center mb-3 border border-[#333333]">
                    <UploadCloud className="h-5 w-5 text-gray-400" />
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">Click to upload files or drag and drop</h4>
                  <p className="text-xs text-gray-500">Supported formats: PDF, DOCX, TXT, CSV (max 10MB)</p>
                  <button className="mt-4 px-4 py-2 bg-[#252525] hover:bg-[#333333] text-white text-xs font-medium rounded-md transition-colors border border-[#444444] pointer-events-none">
                    Browse Files
                  </button>
                </div>

                <div className="space-y-3">
                  {uploadedFiles.length > 0 && (
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Uploaded Documents ({uploadedFiles.length})</h4>
                  )}
                  {uploadedFiles.length === 0 && (
                    <div className="text-center p-4 rounded-lg bg-[#121212] border border-[#333333]">
                      <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                    </div>
                  )}
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-[#121212] border border-[#333333]">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20">
                          <FileText className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-200 font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{file.size} · Processing...</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(idx)} className="text-sm text-gray-500 hover:text-red-400 font-medium transition-colors">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Review & Create */}
            {activeStep === 5 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-white">Review & Create</h2>
                  <p className="text-gray-400 mt-2">Verify your configuration before deploying the AI agent.</p>
                </div>

                <div className="bg-[#121212] border border-[#333333] rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between border-b border-[#333333] pb-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{agentName || 'Unnamed Agent'}</h3>
                      <p className="text-sm text-gray-400 mt-1">Ready for deployment</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl border-4 border-[#1c1c1c]">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Voice Profile</p>
                      <p className="text-sm text-gray-200 font-medium">{availableVoices.find(v => v.voiceId === selectedVoice)?.voiceName || selectedVoice} (Sarvam AI)</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Language</p>
                      <p className="text-sm text-gray-200 font-medium">Hindi + English</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Speech Speed</p>
                      <p className="text-sm text-gray-200 font-medium">{speechSpeed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Interruption</p>
                      <p className="text-sm text-gray-200 font-medium">{allowInterruption ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Knowledge</p>
                      <p className="text-sm text-gray-200 font-medium">{uploadedFiles.length} Documents Attached</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                      <p className="text-sm text-green-400 font-medium flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span> Configuration Valid
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Actions - Fixed */}
          <div className="px-8 py-5 border-t border-[#333333] bg-[#1c1c1c] rounded-b-xl flex items-center justify-between shrink-0">
            <button
              onClick={handleBack}
              disabled={activeStep === 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${activeStep === 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 hover:text-white hover:bg-[#252525] border border-transparent hover:border-[#333333]'
                }`}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {activeStep < steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={async () => {
                  setIsDeploying(true);
                  try {
                    const res = await fetch(`http://localhost:5000/api/v1/agents${editId ? `/${editId}` : ''}`, {
                      method: editId ? 'PUT' : 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: agentName,
                        description: `Agent for ${category}`,
                        category,
                        language,
                        primary_goal: primaryGoal,
                        ai_config: {
                          llm_provider: 'gemini',
                          llm_model: 'gemini-flash',
                          system_prompt: instructionText
                        },
                        voice_config: {
                          stt_provider: 'sarvam',
                          tts_provider: 'sarvam',
                          voice_provider: 'sarvam',
                          voice_id: selectedVoice.toLowerCase(),
                          voice_name: selectedVoice,
                          language,
                          speech_speed: speechSpeed === '1.0x' ? 1.0 : speechSpeed === '1.25x' ? 1.25 : 0.75,
                          allow_interruption: allowInterruption
                        }
                      })
                    });

                    if (res.ok) {
                      const data = await res.json();
                      alert('Agent Created & Saved to Backend Successfully!');
                      // Navigate back or reset state could happen here
                    } else {
                      alert('Failed to save agent to backend.');
                    }
                  } catch (e) {
                    console.error(e);
                    alert('Error communicating with backend.');
                  } finally {
                    setIsDeploying(false);
                  }
                }}
                disabled={isDeploying}
                className="flex items-center gap-2 px-8 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> {isDeploying ? 'Deploying...' : 'Deploy Agent'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CreateAgentWizard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-white p-8">Loading...</div>}>
      <WizardContent />
    </Suspense>
  );
}

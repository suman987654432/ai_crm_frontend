"use client";

import React, { useState } from 'react';
import { CampaignPayload, WizardStep } from './types';
import Step1Info from './steps/Step1Info';
import Step2Agent from './steps/Step2Agent';
import Step3Segment from './steps/Step3Segment';
import Step4Schedule from './steps/Step4Schedule';
import Step5Review from './steps/Step5Review';
import SuccessState from './steps/SuccessState';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Information' },
  { id: 2, title: 'Schedule' },
  { id: 3, title: 'Review' },
];

export default function CreateCampaignWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [data, setData] = useState<CampaignPayload>({
    name: '',
    phoneNumber: '',
    agentId: '',
    segmentId: '',
    selectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timezone: 'Asia/Kolkata',
    callingWindowStart: '10:00',
    callingWindowEnd: '18:00',
  });

  const updateData = (updates: Partial<CampaignPayload>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // API call would go here
      setCurrentStep('success');
    } else {
      setCurrentStep((prev) => (prev as number) + 1 as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep !== 'success' && currentStep > 1) {
      setCurrentStep((prev) => (prev as number) - 1 as WizardStep);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !data.name || !data.phoneNumber || !data.agentId || !data.segmentId;
    if (currentStep === 2) return data.selectedDays.length === 0 || !data.callingWindowStart || !data.callingWindowEnd;
    return false;
  };

  return (
    <div className="max-w-3xl mx-auto w-full pt-8 pb-16">
      
      {/* Stepper Header (Hidden on Success) */}
      {currentStep !== 'success' && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((step, idx) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < (currentStep as number);
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                      isActive ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 
                      isCompleted ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 
                      'bg-[#1c1c1c] text-gray-500 border border-[#333333]'
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.id}
                    </div>
                    <span className={`text-xs font-medium absolute -bottom-6 w-24 text-center ${isActive ? 'text-white' : isCompleted ? 'text-indigo-400' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-[#333333] relative">
                      <div 
                        className="absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-500" 
                        style={{ width: isCompleted ? '100%' : '0%' }} 
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-[#1c1c1c] border border-[#333333] rounded-2xl p-8 shadow-2xl relative overflow-hidden h-[550px] flex flex-col">
        
        {/* Subtle background glow */}
        {currentStep !== 'success' && (
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col justify-center">
          {currentStep === 1 && <Step1Info data={data} updateData={updateData} />}
          {currentStep === 2 && <Step4Schedule data={data} updateData={updateData} />}
          {currentStep === 3 && <Step5Review data={data} />}
          {currentStep === 'success' && <SuccessState />}
        </div>
        
        {/* Footer Controls (Inside Box) */}
        {currentStep !== 'success' && (
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#333333] relative z-10 shrink-0">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-0 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              {currentStep === 3 ? 'Create Campaign' : 'Next Step'} 
              {currentStep !== 3 && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

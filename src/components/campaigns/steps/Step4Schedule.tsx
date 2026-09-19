import React from 'react';
import { CampaignPayload } from '../types';
import { Calendar, Clock, Globe } from 'lucide-react';

interface Step4ScheduleProps {
  data: CampaignPayload;
  updateData: (updates: Partial<CampaignPayload>) => void;
}

export default function Step4Schedule({ data, updateData }: Step4ScheduleProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Schedule Campaign</h2>
        <p className="text-sm text-gray-400">Set the date and time window when calls will be made.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Calendar className="h-4 w-4 text-indigo-400" /> Select Days
          </label>
          <div className="flex flex-wrap gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
              const isSelected = data.selectedDays.includes(day);
              return (
                <label 
                  key={day}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-indigo-500/20 border-indigo-500/50 text-white' : 'bg-[#121212] border-[#333333] text-gray-400 hover:border-[#444444]'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateData({ selectedDays: [...data.selectedDays, day] });
                      } else {
                        updateData({ selectedDays: data.selectedDays.filter(d => d !== day) });
                      }
                    }}
                    className="hidden"
                  />
                  <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-500'}`}>
                    {isSelected && <svg className="h-3 w-3 text-white stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <span className="text-sm font-medium">{day.substring(0, 3)}</span>
                </label>
              );
            })}
          </div>
          {data.selectedDays.length === 0 && (
            <p className="text-xs text-red-400 mt-2">Please select at least one day.</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Globe className="h-4 w-4 text-indigo-400" /> Timezone
          </label>
          <div className="relative">
            <select
              value={data.timezone}
              onChange={(e) => updateData({ timezone: e.target.value })}
              className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Asia/Kolkata">India Standard Time (IST) - Asia/Kolkata</option>
              <option value="America/New_York">Eastern Time (ET) - America/New_York</option>
              <option value="America/Los_Angeles">Pacific Time (PT) - America/Los_Angeles</option>
              <option value="Europe/London">Greenwich Mean Time (GMT) - Europe/London</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Clock className="h-4 w-4 text-indigo-400" /> Daily Call Timings
          </label>
          <div className="flex items-center gap-4 bg-[#121212] border border-[#333333] rounded-xl p-4">
            <div className="flex-1">
              <input
                type="time"
                value={data.callingWindowStart}
                onChange={(e) => updateData({ callingWindowStart: e.target.value })}
                className="w-full bg-transparent text-white focus:outline-none text-center [color-scheme:dark]"
              />
            </div>
            <div className="text-gray-500 font-medium">to</div>
            <div className="flex-1">
              <input
                type="time"
                value={data.callingWindowEnd}
                onChange={(e) => updateData({ callingWindowEnd: e.target.value })}
                className="w-full bg-transparent text-white focus:outline-none text-center [color-scheme:dark]"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">At what time should the calls be made on the selected days?</p>
        </div>
      </div>
    </div>
  );
}

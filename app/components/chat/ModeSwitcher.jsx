"use client";

import { MessageSquare, Mic, Image } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function ModeSwitcher({ currentMode, onModeChange, disabled = false }) {
  const modes = [
    {
      id: 'text',
      label: 'Text Chat',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Ketik pesan',
      color: 'blue',
    },
    {
      id: 'voice',
      label: 'Voice Chat',
      icon: <Mic className="w-5 h-5" />,
      description: 'Bicara & deteksi emosi',
      color: 'green',
    },
    {
      id: 'image',
      label: 'Image',
      icon: <Image className="w-5 h-5" />,
      description: 'Upload gambar',
      color: 'purple',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-200">
      <div className="grid grid-cols-3 gap-2">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          const colorClasses = {
            blue: {
              active: 'bg-blue-100 text-blue-700 border-blue-300',
              inactive: 'text-gray-600 hover:bg-gray-50',
            },
            green: {
              active: 'bg-green-100 text-green-700 border-green-300',
              inactive: 'text-gray-600 hover:bg-gray-50',
            },
            purple: {
              active: 'bg-purple-100 text-purple-700 border-purple-300',
              inactive: 'text-gray-600 hover:bg-gray-50',
            },
          };

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              disabled={disabled}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                isActive
                  ? colorClasses[mode.color].active + ' shadow-sm'
                  : colorClasses[mode.color].inactive + ' border-transparent'
              )}
            >
              {mode.icon}
              <div className="text-center">
                <p className="font-semibold text-sm">{mode.label}</p>
                <p className="text-xs opacity-75">{mode.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Info } from 'lucide-react';
import { ScenarioInfo as ScenarioInfoType } from '../types';
import { clsx } from 'clsx';

interface ScenarioInfoProps {
  info: ScenarioInfoType;
}

export function ScenarioInfo({ info }: ScenarioInfoProps) {
  return (
    <div className="bg-abbyy-primary bg-opacity-5 rounded-lg p-6 border border-abbyy-primary border-opacity-20 transform hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Info className="w-6 h-6 text-abbyy-primary flex-shrink-0 mt-1 animate-pulse" />
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-abbyy-primary opacity-25" />
        </div>
        <div className="space-y-4 w-full">
          <h3 className="text-lg font-semibold text-abbyy-primary animate-fade-in-up">
            {info.description}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'The Problem', content: info.problem, delay: '0.1s', color: 'red' },
              { title: 'The Solution', content: info.solution, delay: '0.2s', color: 'green' },
              { title: 'The Impact', content: info.impact, delay: '0.3s', color: 'blue' }
            ].map((section, index) => (
              <div 
                key={section.title}
                className={clsx(
                  'animate-fade-in-up bg-white bg-opacity-50 rounded-lg p-4 transform transition-all duration-300',
                  'hover:shadow-lg hover:-translate-y-1'
                )}
                style={{ animationDelay: section.delay }}
              >
                <h4 className={clsx(
                  'font-medium mb-2 flex items-center gap-2',
                  `text-${section.color}-600`
                )}>
                  <div className={`w-2 h-2 rounded-full bg-${section.color}-500 animate-pulse`} />
                  {section.title}
                </h4>
                <p className="text-sm text-abbyy-gray-600">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
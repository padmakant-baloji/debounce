import React, { useEffect, useState } from 'react';
import { DemoStats } from '../types';
import { Hash, TrendingDown, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  stats: DemoStats;
  showMemory?: boolean;
}

export function StatsCard({ title, stats, showMemory = false }: StatsCardProps) {
  const [animatedProblemCount, setAnimatedProblemCount] = useState(0);
  const [animatedSolutionCount, setAnimatedSolutionCount] = useState(0);
  const [showImprovement, setShowImprovement] = useState(false);

  const improvement = stats.problem.eventCount > 0 
    ? ((stats.problem.eventCount - stats.solution.eventCount) / stats.problem.eventCount) * 100 
    : 0;

  const memoryImprovement = stats.problem.memoryUsage > 0
    ? ((stats.problem.memoryUsage - stats.solution.memoryUsage) / stats.problem.memoryUsage) * 100
    : 0;

  // Update counts when stats change
  useEffect(() => {
    setAnimatedProblemCount(stats.problem.eventCount);
    setAnimatedSolutionCount(stats.solution.eventCount);
    setShowImprovement(true);
  }, [stats.problem.eventCount, stats.solution.eventCount]);

  // Calculate percentages relative to the maximum count
  const maxCount = Math.max(stats.problem.eventCount, stats.solution.eventCount, 1);
  const problemPercentage = (stats.problem.eventCount / maxCount) * 100;
  const solutionPercentage = (stats.solution.eventCount / maxCount) * 100;

  // Calculate memory percentages
  const maxMemory = Math.max(stats.problem.memoryUsage, stats.solution.memoryUsage, 1);
  const problemMemoryPercentage = (stats.problem.memoryUsage / maxMemory) * 100;
  const solutionMemoryPercentage = (stats.solution.memoryUsage / maxMemory) * 100;

  return (
    <div className="bg-white rounded-lg shadow-abbyy p-6 overflow-hidden card-hover">
      <div className="flex items-center gap-2 mb-6">
        <div className="relative">
          <Zap className="w-5 h-5 text-abbyy-primary animate-pulse" />
          <div className="absolute inset-0 animate-pulse-ring rounded-full bg-abbyy-primary opacity-25" />
        </div>
        <h3 className="text-lg font-semibold text-abbyy-dark">{title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Problem Stats */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className={clsx(
            "absolute inset-0 bg-red-50 transform transition-transform duration-500",
            stats.problem.eventCount > 0 ? "scale-100" : "scale-0"
          )} style={{ borderRadius: "0.5rem" }} />
          <div className="relative space-y-4 p-3">
            <div>
              <h4 className="text-sm font-medium text-abbyy-gray-500 mb-2">Without Optimization</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Events</span>
                <div className="flex items-center gap-1 text-red-600">
                  <Hash className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-xl font-bold tabular-nums transition-all duration-300">
                    {animatedProblemCount}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${problemPercentage}%` }}
                />
              </div>
            </div>
            {showMemory && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="text-red-600 font-medium">
                    {stats.problem.memoryUsage.toFixed(2)} MB
                  </span>
                </div>
                <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${problemMemoryPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Solution Stats */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className={clsx(
            "absolute inset-0 bg-green-50 transform transition-transform duration-500",
            stats.solution.eventCount > 0 ? "scale-100" : "scale-0"
          )} style={{ borderRadius: "0.5rem" }} />
          <div className="relative space-y-4 p-3">
            <div>
              <h4 className="text-sm font-medium text-abbyy-gray-500 mb-2">With Optimization</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Events</span>
                <div className="flex items-center gap-1 text-green-600">
                  <Hash className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-xl font-bold tabular-nums transition-all duration-300">
                    {animatedSolutionCount}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${solutionPercentage}%` }}
                />
              </div>
            </div>
            {showMemory && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="text-green-600 font-medium">
                    {stats.solution.memoryUsage.toFixed(2)} MB
                  </span>
                </div>
                <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${solutionMemoryPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(improvement > 0 || (showMemory && memoryImprovement > 0)) && (
        <div className={clsx(
          "mt-6 pt-4 border-t border-abbyy-gray-100 transform transition-all duration-500",
          showImprovement ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <div className="space-y-4">
            {improvement > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-abbyy-gray-600">Event Reduction</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingDown className="w-4 h-4 animate-bounce" />
                    <span className="text-lg font-bold tabular-nums transition-all duration-300">
                      {improvement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${Math.min(improvement, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            {showMemory && memoryImprovement > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-abbyy-gray-600">Memory Reduction</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingDown className="w-4 h-4 animate-bounce" />
                    <span className="text-lg font-bold tabular-nums transition-all duration-300">
                      {memoryImprovement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${Math.min(memoryImprovement, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
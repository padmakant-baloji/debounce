export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  eventCount: number;
}

export interface DemoStats {
  problem: PerformanceMetrics;
  solution: PerformanceMetrics;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface ScenarioInfo {
  title: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
}

export interface DemoInfo {
  title: string;
  description: string;
  scenarios: {
    [key: string]: ScenarioInfo;
  };
}
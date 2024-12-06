type PerformanceMetric = {
  name: string;
  value: number;
  timestamp: number;
};

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public measureTime(name: string, fn: () => Promise<any>): Promise<any> {
    const start = performance.now();
    return fn().finally(() => {
      const duration = performance.now() - start;
      this.logMetric(name, duration);
    });
  }

  public logMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now()
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance metric - ${name}: ${value.toFixed(2)}ms`);
    }

    // Here you could add integration with monitoring services
    // like New Relic, Datadog, etc.
  }

  public getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  public clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

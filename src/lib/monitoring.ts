type MetricType = 'counter' | 'gauge' | 'histogram';

interface Metric {
  name: string;
  value: number;
  type: MetricType;
  timestamp: number;
  labels?: Record<string, string>;
}

class Monitoring {
  private metrics: Metric[] = [];
  private static instance: Monitoring;

  private constructor() {}

  static getInstance(): Monitoring {
    if (!Monitoring.instance) {
      Monitoring.instance = new Monitoring();
    }
    return Monitoring.instance;
  }

  // Registrar uma métrica
  recordMetric(name: string, value: number, type: MetricType, labels?: Record<string, string>) {
    const metric: Metric = {
      name,
      value,
      type,
      timestamp: Date.now(),
      labels
    };
    this.metrics.push(metric);
    this.sendMetric(metric);
  }

  // Monitorar tempo de resposta
  async measureResponseTime<T>(operation: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await operation();
      const endTime = performance.now();
      this.recordMetric('response_time_ms', endTime - startTime, 'histogram', {
        operation: operation.name
      });
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordMetric('failed_response_time_ms', endTime - startTime, 'histogram', {
        operation: operation.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Monitorar uso de memória
  monitorMemoryUsage() {
    if (typeof window !== 'undefined' && (window.performance as any).memory) {
      const memory = (window.performance as any).memory;
      this.recordMetric('heap_used_size', memory.usedJSHeapSize, 'gauge');
      this.recordMetric('heap_total_size', memory.totalJSHeapSize, 'gauge');
    }
  }

  // Enviar métrica para serviço de monitoramento
  private async sendMetric(metric: Metric) {
    try {
      const endpoint = import.meta.env.VITE_METRICS_ENDPOINT;
      if (!endpoint) return;

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_METRICS_API_KEY}`
        },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.error('Erro ao enviar métrica:', error);
    }
  }

  // Iniciar monitoramento periódico
  startPeriodicMonitoring(intervalMs: number = 60000) {
    setInterval(() => {
      this.monitorMemoryUsage();
    }, intervalMs);
  }
}

export const monitoring = Monitoring.getInstance();

// Exemplo de uso:
// monitoring.startPeriodicMonitoring();
// monitoring.recordMetric('active_users', 100, 'gauge');
// const result = await monitoring.measureResponseTime(async () => await fetchData()); 
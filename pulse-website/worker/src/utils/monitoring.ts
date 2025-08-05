/**
 * Comprehensive Monitoring and Error Reporting System
 * 
 * Features:
 * - Real-time health monitoring
 * - Error aggregation and analysis
 * - Performance metrics tracking
 * - Alert system for critical failures
 * - Historical data analysis
 */

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  services: ServiceHealth[];
  metrics: PerformanceMetrics;
  alerts: Alert[];
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  errorRate: number;
  lastCheck: string;
  details?: string;
}

export interface PerformanceMetrics {
  avgProcessingTime: number;
  successRate: number;
  articlesPerHour: number;
  rssSuccessRate: number;
  apiSuccessRate: number;
  memoryUsage?: number;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  service: string;
  resolved: boolean;
}

export interface ProcessingRun {
  id: string;
  timestamp: string;
  duration: number;
  articlesProcessed: number;
  successCount: number;
  errorCount: number;
  rssSuccessRate: number;
  errors: ProcessingError[];
}

export interface ProcessingError {
  type: 'RSS_FETCH' | 'SCRAPING' | 'AI_PROCESSING' | 'DATABASE' | 'VALIDATION';
  message: string;
  url?: string;
  timestamp: string;
  retryCount: number;
  resolved: boolean;
}

/**
 * Monitor system health and generate comprehensive status report
 */
export async function generateHealthReport(
  kvNamespace: any,
  supabaseUrl: string,
  supabaseKey: string
): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();
  const services: ServiceHealth[] = [];
  const alerts: Alert[] = [];

  // Check RSS feeds health
  const rssHealth = await checkRSSFeedsHealth();
  services.push(rssHealth);

  // Check database health
  const dbHealth = await checkDatabaseHealth(supabaseUrl, supabaseKey);
  services.push(dbHealth);

  // Check KV storage health
  const kvHealth = await checkKVHealth(kvNamespace);
  services.push(kvHealth);

  // Get performance metrics
  const metrics = await getPerformanceMetrics(kvNamespace);

  // Generate alerts based on service health
  const systemAlerts = generateAlerts(services, metrics);
  alerts.push(...systemAlerts);

  // Determine overall system status
  const overallStatus = determineOverallStatus(services, metrics);

  return {
    status: overallStatus,
    timestamp,
    services,
    metrics,
    alerts,
  };
}

/**
 * Check RSS feeds health by testing a sample of feeds
 */
async function checkRSSFeedsHealth(): Promise<ServiceHealth> {
  const testFeeds = [
    'https://www.standardmedia.co.ke/rss/',
    'https://nation.africa/kenya/rss',
    'https://ntvkenya.co.ke/feed',
  ];

  let successCount = 0;
  let totalResponseTime = 0;
  const errors: string[] = [];

  for (const feedUrl of testFeeds) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(feedUrl, {
        method: 'HEAD', // Just check if accessible
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PulseNewsBot/1.0)',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const responseTime = Date.now() - startTime;
      totalResponseTime += responseTime;

      if (response.ok) {
        successCount++;
      } else {
        errors.push(`${feedUrl}: HTTP ${response.status}`);
      }
    } catch (error) {
      errors.push(`${feedUrl}: ${(error as Error).message}`);
    }
  }

  const successRate = successCount / testFeeds.length;
  const avgResponseTime = totalResponseTime / testFeeds.length;

  return {
    name: 'RSS Feeds',
    status: successRate > 0.7 ? 'up' : successRate > 0.3 ? 'degraded' : 'down',
    responseTime: avgResponseTime,
    errorRate: 1 - successRate,
    lastCheck: new Date().toISOString(),
    details: errors.length > 0 ? errors.join('; ') : undefined,
  };
}

/**
 * Check database health
 */
async function checkDatabaseHealth(
  supabaseUrl: string,
  supabaseKey: string
): Promise<ServiceHealth> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/articles?select=count`, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
      },
      signal: AbortSignal.timeout(5000),
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'Database',
        status: 'up',
        responseTime,
        errorRate: 0,
        lastCheck: new Date().toISOString(),
      };
    } else {
      return {
        name: 'Database',
        status: 'down',
        responseTime,
        errorRate: 1,
        lastCheck: new Date().toISOString(),
        details: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      name: 'Database',
      status: 'down',
      responseTime: Date.now() - startTime,
      errorRate: 1,
      lastCheck: new Date().toISOString(),
      details: (error as Error).message,
    };
  }
}

/**
 * Check KV storage health
 */
async function checkKVHealth(kvNamespace: any): Promise<ServiceHealth> {
  const startTime = Date.now();

  try {
    // Test write and read
    const testKey = `health_check_${Date.now()}`;
    const testValue = 'health_check_value';

    await kvNamespace.put(testKey, testValue, { expirationTtl: 60 });
    const retrievedValue = await kvNamespace.get(testKey);

    const responseTime = Date.now() - startTime;

    if (retrievedValue === testValue) {
      // Clean up test key
      await kvNamespace.delete(testKey);

      return {
        name: 'KV Storage',
        status: 'up',
        responseTime,
        errorRate: 0,
        lastCheck: new Date().toISOString(),
      };
    } else {
      return {
        name: 'KV Storage',
        status: 'degraded',
        responseTime,
        errorRate: 0.5,
        lastCheck: new Date().toISOString(),
        details: 'Read/write test failed',
      };
    }
  } catch (error) {
    return {
      name: 'KV Storage',
      status: 'down',
      responseTime: Date.now() - startTime,
      errorRate: 1,
      lastCheck: new Date().toISOString(),
      details: (error as Error).message,
    };
  }
}

/**
 * Get performance metrics from stored data
 */
async function getPerformanceMetrics(kvNamespace: any): Promise<PerformanceMetrics> {
  try {
    // Get recent processing runs
    const recentRuns = await getRecentProcessingRuns(kvNamespace, 24); // Last 24 hours
    
    if (recentRuns.length === 0) {
      return {
        avgProcessingTime: 0,
        successRate: 0,
        articlesPerHour: 0,
        rssSuccessRate: 0,
        apiSuccessRate: 0,
      };
    }

    // Calculate metrics
    const totalProcessingTime = recentRuns.reduce((sum, run) => sum + run.duration, 0);
    const avgProcessingTime = totalProcessingTime / recentRuns.length;

    const totalArticles = recentRuns.reduce((sum, run) => sum + run.articlesProcessed, 0);
    const totalSuccess = recentRuns.reduce((sum, run) => sum + run.successCount, 0);
    const successRate = totalArticles > 0 ? totalSuccess / totalArticles : 0;

    const hoursSpanned = Math.max(1, (Date.now() - new Date(recentRuns[0].timestamp).getTime()) / (1000 * 60 * 60));
    const articlesPerHour = totalSuccess / hoursSpanned;

    const avgRssSuccessRate = recentRuns.reduce((sum, run) => sum + run.rssSuccessRate, 0) / recentRuns.length;

    return {
      avgProcessingTime,
      successRate,
      articlesPerHour,
      rssSuccessRate: avgRssSuccessRate,
      apiSuccessRate: 0, // TODO: Track API success rate separately
    };
  } catch (error) {
    console.error('Failed to get performance metrics:', error);
    return {
      avgProcessingTime: 0,
      successRate: 0,
      articlesPerHour: 0,
      rssSuccessRate: 0,
      apiSuccessRate: 0,
    };
  }
}

/**
 * Generate alerts based on system health
 */
function generateAlerts(services: ServiceHealth[], metrics: PerformanceMetrics): Alert[] {
  const alerts: Alert[] = [];

  // Check for service failures
  for (const service of services) {
    if (service.status === 'down') {
      alerts.push({
        id: `service_down_${service.name.toLowerCase().replace(/\s+/g, '_')}`,
        level: 'critical',
        message: `${service.name} is down: ${service.details || 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        service: service.name,
        resolved: false,
      });
    } else if (service.status === 'degraded') {
      alerts.push({
        id: `service_degraded_${service.name.toLowerCase().replace(/\s+/g, '_')}`,
        level: 'warning',
        message: `${service.name} is degraded: ${service.details || 'Performance issues detected'}`,
        timestamp: new Date().toISOString(),
        service: service.name,
        resolved: false,
      });
    }
  }

  // Check performance metrics
  if (metrics.successRate < 0.5) {
    alerts.push({
      id: 'low_success_rate',
      level: 'error',
      message: `Low success rate: ${(metrics.successRate * 100).toFixed(1)}%`,
      timestamp: new Date().toISOString(),
      service: 'Processing',
      resolved: false,
    });
  }

  if (metrics.rssSuccessRate < 0.3) {
    alerts.push({
      id: 'rss_feeds_failing',
      level: 'error',
      message: `RSS feeds failing: ${(metrics.rssSuccessRate * 100).toFixed(1)}% success rate`,
      timestamp: new Date().toISOString(),
      service: 'RSS Feeds',
      resolved: false,
    });
  }

  if (metrics.articlesPerHour < 1) {
    alerts.push({
      id: 'low_article_throughput',
      level: 'warning',
      message: `Low article throughput: ${metrics.articlesPerHour.toFixed(1)} articles/hour`,
      timestamp: new Date().toISOString(),
      service: 'Processing',
      resolved: false,
    });
  }

  return alerts;
}

/**
 * Determine overall system status
 */
function determineOverallStatus(
  services: ServiceHealth[],
  metrics: PerformanceMetrics
): 'healthy' | 'degraded' | 'critical' {
  const downServices = services.filter(s => s.status === 'down').length;
  const degradedServices = services.filter(s => s.status === 'degraded').length;

  // Critical if any core service is down or success rate is very low
  if (downServices > 0 || metrics.successRate < 0.2) {
    return 'critical';
  }

  // Degraded if services are degraded or performance is poor
  if (degradedServices > 0 || metrics.successRate < 0.7 || metrics.rssSuccessRate < 0.5) {
    return 'degraded';
  }

  return 'healthy';
}

/**
 * Store processing run data for metrics
 */
export async function storeProcessingRun(
  kvNamespace: any,
  runData: Omit<ProcessingRun, 'id'>
): Promise<void> {
  try {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const run: ProcessingRun = {
      id: runId,
      ...runData,
    };

    // Store individual run
    await kvNamespace.put(`processing_run_${runId}`, JSON.stringify(run), {
      expirationTtl: 7 * 24 * 60 * 60, // 7 days
    });

    // Update recent runs list
    const recentRunsKey = 'recent_processing_runs';
    const existingRuns = await kvNamespace.get(recentRunsKey);
    let recentRuns: string[] = existingRuns ? JSON.parse(existingRuns) : [];
    
    recentRuns.unshift(runId);
    recentRuns = recentRuns.slice(0, 100); // Keep last 100 runs

    await kvNamespace.put(recentRunsKey, JSON.stringify(recentRuns), {
      expirationTtl: 7 * 24 * 60 * 60,
    });

    console.log(`📊 Stored processing run: ${runId}`);
  } catch (error) {
    console.error('Failed to store processing run:', error);
  }
}

/**
 * Get recent processing runs for analysis
 */
async function getRecentProcessingRuns(
  kvNamespace: any,
  hoursBack: number = 24
): Promise<ProcessingRun[]> {
  try {
    const recentRunsKey = 'recent_processing_runs';
    const runIds = await kvNamespace.get(recentRunsKey);
    
    if (!runIds) {
      return [];
    }

    const runIdList: string[] = JSON.parse(runIds);
    const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);
    const runs: ProcessingRun[] = [];

    for (const runId of runIdList) {
      try {
        const runData = await kvNamespace.get(`processing_run_${runId}`);
        if (runData) {
          const run: ProcessingRun = JSON.parse(runData);
          if (new Date(run.timestamp).getTime() > cutoffTime) {
            runs.push(run);
          }
        }
      } catch (error) {
        console.warn(`Failed to load run ${runId}:`, error);
      }
    }

    return runs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Failed to get recent processing runs:', error);
    return [];
  }
}

/**
 * Get error analysis report
 */
export async function getErrorAnalysis(kvNamespace: any): Promise<any> {
  try {
    const recentRuns = await getRecentProcessingRuns(kvNamespace, 24);
    const allErrors: ProcessingError[] = [];

    for (const run of recentRuns) {
      allErrors.push(...run.errors);
    }

    // Analyze errors
    const errorsByType = {} as Record<string, number>;
    const errorsByMessage = {} as Record<string, number>;
    const errorsByUrl = {} as Record<string, number>;

    for (const error of allErrors) {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
      errorsByMessage[error.message] = (errorsByMessage[error.message] || 0) + 1;
      
      if (error.url) {
        const hostname = new URL(error.url).hostname;
        errorsByUrl[hostname] = (errorsByUrl[hostname] || 0) + 1;
      }
    }

    return {
      totalErrors: allErrors.length,
      errorsByType,
      topErrorMessages: Object.entries(errorsByMessage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([message, count]) => ({ message, count })),
      errorsByUrl,
      recentErrors: allErrors
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20),
    };
  } catch (error) {
    console.error('Failed to get error analysis:', error);
    return {
      totalErrors: 0,
      errorsByType: {},
      topErrorMessages: [],
      errorsByUrl: {},
      recentErrors: [],
    };
  }
}

/**
 * Create monitoring dashboard data
 */
export async function createMonitoringDashboard(
  kvNamespace: any,
  supabaseUrl: string,
  supabaseKey: string
): Promise<any> {
  const [healthReport, errorAnalysis, recentRuns] = await Promise.all([
    generateHealthReport(kvNamespace, supabaseUrl, supabaseKey),
    getErrorAnalysis(kvNamespace),
    getRecentProcessingRuns(kvNamespace, 24),
  ]);

  return {
    health: healthReport,
    errors: errorAnalysis,
    recentActivity: recentRuns.slice(0, 10),
    summary: {
      totalRuns: recentRuns.length,
      avgSuccessRate: recentRuns.length > 0 
        ? recentRuns.reduce((sum, run) => sum + (run.successCount / Math.max(run.articlesProcessed, 1)), 0) / recentRuns.length
        : 0,
      totalArticlesProcessed: recentRuns.reduce((sum, run) => sum + run.successCount, 0),
      totalErrors: errorAnalysis.totalErrors,
    },
  };
}
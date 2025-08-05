/**
 * KV storage utilities for state management
 */

export interface ProcessingStats {
  totalProcessed: number;
  lastRun: string | null;
  successRate: number;
  errors: string[];
}

/**
 * Get last processed timestamp from KV
 */
export async function getLastProcessedTimestamp(kv: any): Promise<number> {
  try {
    const timestamp = await kv.get('last_processed_timestamp');
    if (timestamp) {
      const parsed = parseInt(timestamp);
      if (!isNaN(parsed)) {
        console.log(`📅 Retrieved last processed timestamp: ${new Date(parsed).toISOString()}`);
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to get last processed timestamp:', error);
  }

  // Default: 24 hours ago
  const defaultTimestamp = Date.now() - 24 * 60 * 60 * 1000;
  console.log(`📅 Using default timestamp (24h ago): ${new Date(defaultTimestamp).toISOString()}`);
  return defaultTimestamp;
}

/**
 * Update last processed timestamp in KV
 */
export async function updateLastProcessedTimestamp(
  kv: any,
  timestamp: number
): Promise<void> {
  try {
    await kv.put('last_processed_timestamp', timestamp.toString(), {
      metadata: {
        updated_at: new Date().toISOString(),
        source: 'automated_workflow',
      },
    });
    console.log(`📅 Updated last processed timestamp: ${new Date(timestamp).toISOString()}`);
  } catch (error) {
    console.error('Failed to update last processed timestamp:', error);
    throw error;
  }
}

/**
 * Get processing statistics from KV
 */
export async function getProcessingStats(kv: any): Promise<ProcessingStats> {
  try {
    const stats = await kv.get('processing_stats', 'json');
    return stats || {
      totalProcessed: 0,
      lastRun: null,
      successRate: 0,
      errors: [],
    };
  } catch (error) {
    console.error('Failed to get processing stats:', error);
    return {
      totalProcessed: 0,
      lastRun: null,
      successRate: 0,
      errors: [],
    };
  }
}

/**
 * Update processing statistics in KV
 */
export async function updateProcessingStats(
  kv: any,
  stats: ProcessingStats
): Promise<void> {
  try {
    await kv.put('processing_stats', JSON.stringify(stats), {
      expirationTtl: 30 * 24 * 60 * 60, // 30 days
      metadata: {
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to update processing stats:', error);
  }
}

/**
 * Log processing run
 */
export async function logProcessingRun(
  kv: any,
  runId: string,
  stats: {
    articlesProcessed: number;
    successCount: number;
    errorCount: number;
    duration: number;
    errors: string[];
  }
): Promise<void> {
  try {
    const logEntry = {
      runId,
      timestamp: new Date().toISOString(),
      ...stats,
    };

    // Store individual run log
    await kv.put(`run_log_${runId}`, JSON.stringify(logEntry), {
      expirationTtl: 7 * 24 * 60 * 60, // 7 days
    });

    // Update overall stats
    const currentStats = await getProcessingStats(kv);
    const newStats: ProcessingStats = {
      totalProcessed: currentStats.totalProcessed + stats.successCount,
      lastRun: new Date().toISOString(),
      successRate: stats.articlesProcessed > 0 
        ? (stats.successCount / stats.articlesProcessed) * 100 
        : 0,
      errors: [...currentStats.errors.slice(-10), ...stats.errors].slice(-20), // Keep last 20 errors
    };

    await updateProcessingStats(kv, newStats);
  } catch (error) {
    console.error('Failed to log processing run:', error);
  }
}

/**
 * Get recent run logs
 */
export async function getRecentRunLogs(
  kv: any,
  limit: number = 10
): Promise<any[]> {
  try {
    const list = await kv.list({ prefix: 'run_log_' });
    const logs = [];

    for (const key of list.keys.slice(0, limit)) {
      const log = await kv.get(key.name, 'json');
      if (log) {
        logs.push(log);
      }
    }

    return logs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Failed to get recent run logs:', error);
    return [];
  }
}

/**
 * Store error for debugging
 */
export async function storeError(
  kv: any,
  error: Error,
  context: string
): Promise<void> {
  try {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    await kv.put(errorId, JSON.stringify(errorData), {
      expirationTtl: 7 * 24 * 60 * 60, // 7 days
    });
  } catch (kvError) {
    console.error('Failed to store error in KV:', kvError);
  }
}
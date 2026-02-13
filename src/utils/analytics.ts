/**
 * Google Analytics 4 utility functions with retry mechanism and event queue
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = {
  event_category?: string;
  event_label?: string;
  [key: string]: unknown;
};

type QueuedEvent = {
  type: 'event' | 'pageview';
  eventName?: string;
  params?: EventParams;
  path?: string;
  title?: string;
};

// Queue for events that occur before GA is initialized
const eventQueue: QueuedEvent[] = [];

// Maximum wait time for gtag to become available (5 seconds)
const GTAG_WAIT_TIMEOUT = 5000;
// Check interval for gtag availability (50ms)
const GTAG_CHECK_INTERVAL = 50;

/**
 * Checks if gtag is available and initialized
 */
function isGtagReady(): boolean {
  return typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    Array.isArray(window.dataLayer);
}

/**
 * Waits for gtag to become available with timeout
 */
function waitForGtag(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isGtagReady()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isGtagReady()) {
        clearInterval(checkInterval);
        resolve();
        return;
      }

      // Timeout after GTAG_WAIT_TIMEOUT
      if (Date.now() - startTime >= GTAG_WAIT_TIMEOUT) {
        clearInterval(checkInterval);
        reject(new Error('gtag initialization timeout'));
      }
    }, GTAG_CHECK_INTERVAL);
  });
}

/**
 * Processes queued events after GA initialization
 */
async function processQueue(): Promise<void> {
  if (eventQueue.length === 0) return;

  try {
    await waitForGtag();
  } catch {
    // If gtag is not available, events will remain in queue
    // They can be processed later when gtag becomes available
    return;
  }

  const events = [...eventQueue];
  eventQueue.length = 0; // Clear queue

  for (const queued of events) {
    try {
      if (queued.type === 'event' && queued.eventName && window.gtag) {
        window.gtag('event', queued.eventName, queued.params || {});
      } else if (queued.type === 'pageview' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: queued.path,
          page_title: queued.title,
        });
      }
    } catch (error) {
      console.error('Error processing queued analytics event:', error);
    }
  }
}

/**
 * Tracks a custom event in Google Analytics 4
 * Automatically queues events if GA is not yet initialized
 */
export async function trackEvent(
  eventName: string,
  params: EventParams = {}
): Promise<void> {
  try {
    // Try to wait for gtag (non-blocking if it takes too long)
    const gtagReady = isGtagReady();

    if (gtagReady && window.gtag) {
      try {
        window.gtag('event', eventName, params);
        return;
      } catch (error) {
        console.error(`Error sending analytics event ${eventName}:`, error);
        // Fall through to queue the event
      }
    }

    // Queue event if gtag is not ready or if sending failed
    eventQueue.push({
      type: 'event',
      eventName,
      params,
    });

    // Try to process queue in background (non-blocking)
    processQueue().catch(() => {
      // Queue will be processed when gtag becomes available
    });
  } catch (error) {
    console.error(`Error in trackEvent for ${eventName}:`, error);
  }
}

/**
 * Tracks a page view in Google Analytics 4
 * Automatically queues page views if GA is not yet initialized
 */
export async function trackPageView(
  path: string,
  title?: string
): Promise<void> {
  try {
    const pageTitle = title || (typeof document !== 'undefined' ? document.title : '');

    // Try to wait for gtag (non-blocking if it takes too long)
    const gtagReady = isGtagReady();

    if (gtagReady && window.gtag) {
      try {
        window.gtag('event', 'page_view', {
          page_path: path,
          page_title: pageTitle,
        });
        return;
      } catch (error) {
        console.error('Error sending analytics page_view:', error);
        // Fall through to queue the event
      }
    }

    // Queue page view if gtag is not ready or if sending failed
    eventQueue.push({
      type: 'pageview',
      path,
      title: pageTitle,
    });

    // Try to process queue in background (non-blocking)
    processQueue().catch(() => {
      // Queue will be processed when gtag becomes available
    });
  } catch (error) {
    console.error('Error in trackPageView:', error);
  }
}

/**
 * Manually trigger queue processing (useful for retry scenarios)
 */
export async function flushEventQueue(): Promise<void> {
  await processQueue();
}

// Initialize queue processing when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      processQueue().catch(() => {
        // Will retry when gtag is available
      });
    });
  } else {
    // DOM already ready
    processQueue().catch(() => {
      // Will retry when gtag is available
    });
  }

  // Also try processing when window loads
  window.addEventListener('load', () => {
    processQueue().catch(() => {
      // Will retry when gtag is available
    });
  });
}


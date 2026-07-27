type GtagCommand = "config" | "event" | "js" | "set";
type GtagParams = Record<string, string | number | boolean | Date | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: GtagParams) => void;
  }
}

const DEFAULT_GA_MEASUREMENT_ID = "G-BM1YFPM5ZB";
const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID;
const ENABLE_ANALYTICS_IN_DEV =
  import.meta.env.VITE_ENABLE_ANALYTICS_IN_DEV === "true";
const GA_SCRIPT_ID = "google-analytics-gtag";

let initialized = false;

const blockedPathPrefixes = ["/admin", "/aus", "/auth"];

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function isLocalHost() {
  if (!isBrowser()) {
    return false;
  }

  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

export function shouldTrackAnalytics(pathname?: string) {
  if (!isBrowser()) {
    return false;
  }

  const activePathname = pathname || window.location.pathname;

  return (
    Boolean(GA_MEASUREMENT_ID) &&
    !blockedPathPrefixes.some((prefix) => activePathname === prefix || activePathname.startsWith(`${prefix}/`)) &&
    (ENABLE_ANALYTICS_IN_DEV || !isLocalHost())
  );
}

export function initGoogleAnalytics() {
  if (!isBrowser() || initialized || !GA_MEASUREMENT_ID) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args) {
      window.dataLayer?.push(args);
    };

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
  initialized = true;
}

export function trackPageView(pagePath: string) {
  if (!shouldTrackAnalytics()) {
    return;
  }

  initGoogleAnalytics();
  window.gtag?.("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  });
}

export function trackEvent(eventName: string, params: GtagParams = {}) {
  if (!shouldTrackAnalytics()) {
    return;
  }

  initGoogleAnalytics();
  window.gtag?.("event", eventName, params);
}

export function trackContactFormSubmit() {
  trackEvent("contact_form_submit", {
    event_category: "lead",
    method: "contact_form",
  });
}

export function trackCalendlyClick(source: string) {
  trackEvent("calendly_click", {
    event_category: "lead",
    link_url: "https://calendly.com/quantixstudio/30min",
    source,
  });
}

export function trackProjectOpen(projectSlug: string, source: string) {
  trackEvent("portfolio_project_open", {
    event_category: "portfolio",
    project_slug: projectSlug,
    source,
  });
}

export function trackOutboundLink(
  eventName: "demo_click" | "github_click" | "linkedin_click",
  linkUrl: string,
  source: string,
) {
  trackEvent(eventName, {
    event_category: "outbound_link",
    link_url: linkUrl,
    source,
  });
}

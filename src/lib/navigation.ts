export const NAVBAR_SCROLL_OFFSET = 80;
export const NAVBAR_ACTIVE_PROBE_OFFSET = NAVBAR_SCROLL_OFFSET + 32;
const NAVBAR_ACTIVE_TOLERANCE = 28;

export type LandingNavSection = "home" | "services" | "portfolio" | "contact";

export function getSectionScrollTop(id: string) {
  const element = document.getElementById(id);
  if (!element) return null;

  return Math.max(0, element.getBoundingClientRect().top + window.scrollY - NAVBAR_SCROLL_OFFSET);
}

export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  const y = getSectionScrollTop(id);
  if (y === null) return false;

  window.scrollTo({
    top: y,
    behavior,
  });

  return true;
}

export function getActiveLandingSection(scrollY: number) {
  const contactTop = getSectionScrollTop("contact");
  if (contactTop !== null && scrollY >= contactTop - NAVBAR_ACTIVE_TOLERANCE) {
    return "contact" as const;
  }

  const portfolioTop = getSectionScrollTop("featured-work");
  if (portfolioTop !== null && scrollY >= portfolioTop - NAVBAR_ACTIVE_TOLERANCE) {
    return "portfolio" as const;
  }

  const servicesTop = getSectionScrollTop("services");
  if (servicesTop !== null && scrollY >= servicesTop - NAVBAR_ACTIVE_TOLERANCE) {
    return "services" as const;
  }

  return "home" as const;
}

export function hasReachedNavTarget(target: LandingNavSection, scrollY: number) {
  if (target === "home") {
    return scrollY <= NAVBAR_ACTIVE_TOLERANCE;
  }

  const targetId = target === "portfolio" ? "featured-work" : target;
  const targetTop = getSectionScrollTop(targetId);
  if (targetTop === null) return true;

  return Math.abs(scrollY - targetTop) <= NAVBAR_ACTIVE_TOLERANCE;
}

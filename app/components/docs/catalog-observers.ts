"use client";

// One observer per visibility policy, not one observer per card.
// Disconnect when the last subscriber leaves so route switches release all DOM references.
const visibility = new Map<Element, (visible: boolean) => void>();
let viewportObserver: IntersectionObserver | undefined;

export function observeCatalogCard(element: Element, update: (visible: boolean) => void) {
  if (typeof IntersectionObserver === "undefined") {
    update(true);
    return () => {};
  }
  if (!viewportObserver) {
    viewportObserver = new IntersectionObserver(entries => {
      for (const entry of entries) visibility.get(entry.target)?.(entry.isIntersecting);
    }, { rootMargin: "240px 0px" });
  }
  visibility.set(element, update);
  viewportObserver.observe(element);
  return () => {
    visibility.delete(element);
    viewportObserver?.unobserve(element);
    if (!visibility.size) {
      viewportObserver?.disconnect();
      viewportObserver = undefined;
    }
  };
}

// Observe both preview content and its viewport. Coalesce a batch of size
// changes to a single fit calculation for each preview.
const resizeCallbacks = new Map<Element, () => void>();
let resizeObserver: ResizeObserver | undefined;
export function observePreviewSize(elements: Element[], fit: () => void) {
  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(entries => {
      const updates = new Set<() => void>();
      for (const entry of entries) {
        const callback = resizeCallbacks.get(entry.target);
        if (callback) updates.add(callback);
      }
      for (const update of updates) update();
    });
  }
  for (const element of elements) {
    resizeCallbacks.set(element, fit);
    resizeObserver.observe(element);
  }
  return () => {
    for (const element of elements) {
      resizeCallbacks.delete(element);
      resizeObserver?.unobserve(element);
    }
    if (!resizeCallbacks.size) {
      resizeObserver?.disconnect();
      resizeObserver = undefined;
    }
  };
}

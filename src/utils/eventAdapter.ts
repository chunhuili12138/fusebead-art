export interface NormalizedEvent {
  x: number;
  y: number;
  preventDefault: () => void;
  originalEvent: Event;
}

export function normalizeEvent(e: MouseEvent | TouchEvent): NormalizedEvent {
  const isTouch = e.type.startsWith('touch');

  if (isTouch && e instanceof TouchEvent) {
    return {
      x: e.touches[0]?.clientX || 0,
      y: e.touches[0]?.clientY || 0,
      preventDefault: () => e.preventDefault(),
      originalEvent: e,
    };
  } else if (e instanceof MouseEvent) {
    return {
      x: e.clientX,
      y: e.clientY,
      preventDefault: () => e.preventDefault(),
      originalEvent: e,
    };
  }

  return {
    x: 0,
    y: 0,
    preventDefault: () => {},
    originalEvent: e,
  };
}

export function isTouchEvent(e: Event): e is TouchEvent {
  return e.type.startsWith('touch');
}

export function addPointerEvents(
  element: HTMLElement,
  handlers: {
    onStart: (e: NormalizedEvent) => void;
    onMove: (e: NormalizedEvent) => void;
    onEnd: (e: NormalizedEvent) => void;
  }
) {
  const handleStart = (e: Event) => {
    const normalized = normalizeEvent(e as MouseEvent | TouchEvent);
    normalized.preventDefault();
    handlers.onStart(normalized);

    const moveHandler = (moveEvent: Event) => {
      const normalizedMove = normalizeEvent(moveEvent as MouseEvent | TouchEvent);
      normalizedMove.preventDefault();
      handlers.onMove(normalizedMove);
    };

    const endHandler = (endEvent: Event) => {
      const normalizedEnd = normalizeEvent(endEvent as MouseEvent | TouchEvent);
      normalizedEnd.preventDefault();
      handlers.onEnd(normalizedEnd);

      document.removeEventListener(isTouchEvent(endEvent) ? 'touchmove' : 'mousemove', moveHandler);
      document.removeEventListener(isTouchEvent(endEvent) ? 'touchend' : 'mouseup', endHandler);
    };

    document.addEventListener(isTouchEvent(e) ? 'touchmove' : 'mousemove', moveHandler);
    document.addEventListener(isTouchEvent(e) ? 'touchend' : 'mouseup', endHandler);
  };

  element.addEventListener('mousedown', handleStart);
  element.addEventListener('touchstart', handleStart, { passive: false });

  return () => {
    element.removeEventListener('mousedown', handleStart);
    element.removeEventListener('touchstart', handleStart);
  };
}

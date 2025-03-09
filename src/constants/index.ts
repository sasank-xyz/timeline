export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const ANIMATION_DURATION = 1000; // ms
export const ANIMATION_DELAY = 100; // ms
export const MIN_EVENT_SPACING = 80; // px
export const PIXELS_PER_DAY = 15;

export const YEARS = {
  START: 1800,
  END: 2024,
} as const;

export const CSS_CLASSES = {
  TIMELINE: {
    CONTAINER: 'timeline-container',
    YEARS: 'timeline-years',
    TRANSITIONING: 'transitioning',
    ERROR: 'timeline-error',
    MASK: 'timeline-mask',
    EVENTS_CONTAINER: 'timeline-events-container',
    VISIBLE: 'visible'
  },
  YEAR_ITEM: {
    CONTAINER: 'timeline-year-item',
    YEAR: 'timeline-year',
    DOT: 'timeline-dot',
    SELECTED: 'selected',
    ANIMATING: 'animating',
    ANIMATING_TO_TOP: 'animating-to-top'
  },
  EVENT: {
    CONTAINER: 'timeline-item',
    DATE: 'timeline-date',
    DOT: 'timeline-dot',
    CONTENT: 'timeline-content',
    DESCRIPTION: 'timeline-description',
    DIVIDER: 'timeline-event-divider'
  }
} as const; 
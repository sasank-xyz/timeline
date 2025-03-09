export interface HistoricalEvent {
  year: string;
  month: string;
  day: string;
  event: string;
}

export interface GroupedEvent {
  date: string;
  year: string;
  month: string;
  day: string;
  events: string[];
}

export interface TimelineState {
  selectedYear: number | null;
  events: GroupedEvent[];
  loading: boolean;
  error: string | null;
  loadingComplete: boolean;
  animationStarted: boolean;
  isTransitioning: boolean;
}

export type TimelineAction =
  | { type: 'SELECT_YEAR'; payload: number }
  | { type: 'RESET' }
  | { type: 'SET_EVENTS'; payload: GroupedEvent[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'START_ANIMATION' }
  | { type: 'SET_TRANSITIONING'; payload: boolean }; 
import { TimelineState, TimelineAction } from '../types';

const initialState: TimelineState = {
  selectedYear: null,
  events: [],
  loading: false,
  error: null,
  loadingComplete: false,
  animationStarted: false,
  isTransitioning: false,
};

export const timelineReducer = (
  state: TimelineState = initialState,
  action: TimelineAction
): TimelineState => {
  switch (action.type) {
    case 'SELECT_YEAR':
      return {
        ...state,
        selectedYear: action.payload,
        events: [],
        loading: true,
        error: null,
        loadingComplete: false,
        animationStarted: false,
      };

    case 'RESET':
      return initialState;

    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
        loading: false,
        loadingComplete: true,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'START_ANIMATION':
      return {
        ...state,
        animationStarted: true,
      };

    case 'SET_TRANSITIONING':
      return {
        ...state,
        isTransitioning: action.payload,
      };

    default:
      return state;
  }
}; 
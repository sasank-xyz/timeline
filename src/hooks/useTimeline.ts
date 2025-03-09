import { useReducer, useCallback, useRef } from 'react';
import { timelineReducer } from '../reducers/timelineReducer';
import { fetchHistoricalEvents } from '../services/historicalEvents';
import { HistoricalEvent, GroupedEvent } from '../types';
import { createDateKey, createDateFromParts, getDaysBetween } from '../utils/dateUtils';
import { MIN_EVENT_SPACING, PIXELS_PER_DAY, ANIMATION_DURATION } from '../constants';

export const useTimeline = () => {
  const [state, dispatch] = useReducer(timelineReducer, {
    selectedYear: null,
    events: [],
    loading: false,
    error: null,
    loadingComplete: false,
    animationStarted: false,
    isTransitioning: false,
  });

  const hasScrolledRef = useRef(false);
  const eventMapRef = useRef(new Map<string, GroupedEvent>());

  const calculateEventSpacing = useCallback((currentEvent: GroupedEvent, index: number, events: GroupedEvent[]) => {
    if (index === 0) return 0;

    const currentDate = createDateFromParts(currentEvent.year, currentEvent.month, currentEvent.day);
    const previousEvent = events[index - 1];
    const previousDate = createDateFromParts(previousEvent.year, previousEvent.month, previousEvent.day);

    const daysBetween = getDaysBetween(previousDate, currentDate);
    return Math.max(daysBetween * PIXELS_PER_DAY, MIN_EVENT_SPACING);
  }, []);

  const handleYearClick = useCallback((year: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    
    // Prepare the element for animation
    element.style.position = 'fixed';
    element.style.top = `${rect.top}px`;
    element.style.left = '0';
    element.style.width = '100%';
    element.style.setProperty('--initial-top', `${rect.top}px`);
    
    // Force a reflow
    element.offsetHeight;
    
    requestAnimationFrame(() => {
      element.classList.add('animating');
      dispatch({ type: 'SET_TRANSITIONING', payload: true });
      
      requestAnimationFrame(() => {
        element.classList.add('animating-to-top');
        
        setTimeout(() => {
          // Reset the event map when selecting a new year
          eventMapRef.current = new Map();
          dispatch({ type: 'SELECT_YEAR', payload: year });
        }, ANIMATION_DURATION);
      });
    });
  }, []);

  const handleBackClick = useCallback(() => {
    dispatch({ type: 'RESET' });
    hasScrolledRef.current = false;
    eventMapRef.current = new Map();
  }, []);

  const processEvents = useCallback((newEvents: HistoricalEvent[]) => {
    // Process and group new events
    newEvents.forEach(event => {
      const dateKey = createDateKey(event.year, event.month, event.day);
      
      if (eventMapRef.current.has(dateKey)) {
        const group = eventMapRef.current.get(dateKey)!;
        if (!group.events.includes(event.event)) {
          group.events.push(event.event);
        }
      } else {
        eventMapRef.current.set(dateKey, {
          date: dateKey,
          year: event.year,
          month: event.month,
          day: event.day,
          events: [event.event]
        });
      }
    });

    // Convert map to array and sort by date
    const sortedEvents = Array.from(eventMapRef.current.values()).sort((a, b) => {
      const dateA = createDateFromParts(a.year, a.month, a.day);
      const dateB = createDateFromParts(b.year, b.month, b.day);
      return dateA.getTime() - dateB.getTime();
    });

    // Update state with all accumulated events
    dispatch({ type: 'SET_EVENTS', payload: sortedEvents });
    
    // Start animation only if we haven't already
    if (!state.animationStarted && sortedEvents.length > 0) {
      setTimeout(() => {
        dispatch({ type: 'START_ANIMATION' });
        if (!hasScrolledRef.current) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          hasScrolledRef.current = true;
        }
      }, 100);
    }
  }, [state.animationStarted]);

  const fetchEvents = useCallback(async () => {
    if (!state.selectedYear) return;

    try {
      await fetchHistoricalEvents(processEvents, () => {}, state.selectedYear);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch historical events' });
      console.error('Error:', err);
    }
  }, [state.selectedYear, processEvents]);

  return {
    state,
    handleYearClick,
    handleBackClick,
    calculateEventSpacing,
    fetchEvents
  };
}; 
import { useEffect } from 'react';
import { CSS_CLASSES, YEARS } from '../constants';
import { useTimeline } from '../hooks/useTimeline';
import { TimelineYear } from './TimelineYear';
import { TimelineEvent } from './TimelineEvent';
import './Timeline.css';

const Timeline = () => {
  const { state, handleYearClick, handleBackClick, calculateEventSpacing, fetchEvents } = useTimeline();
  const { TIMELINE } = CSS_CLASSES;

  // Generate years array
  const years = Array.from(
    { length: YEARS.END - YEARS.START + 1 }, 
    (_, i) => YEARS.START + i
  );

  useEffect(() => {
    if (state.selectedYear) {
      fetchEvents();
    }
  }, [state.selectedYear, fetchEvents]);

  if (state.error) {
    return <div className={TIMELINE.ERROR}>{state.error}</div>;
  }

  if (state.selectedYear === null) {
    return (
      <div className={`${TIMELINE.YEARS} ${state.isTransitioning ? TIMELINE.TRANSITIONING : ''}`}>
        {years.map(year => (
          <TimelineYear
            key={year}
            year={year}
            onYearClick={handleYearClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={TIMELINE.CONTAINER}>
      <TimelineYear
        year={state.selectedYear}
        isSelected
        onYearClick={handleYearClick}
        onBackClick={handleBackClick}
      />
      <div className={TIMELINE.MASK} />
      <div className={`${TIMELINE.EVENTS_CONTAINER} ${state.animationStarted ? TIMELINE.VISIBLE : ''}`}>
        {state.events.map((event, index) => (
          <TimelineEvent
            key={event.date}
            event={event}
            index={index}
            marginTop={index === 0 ? 80 : calculateEventSpacing(event, index, state.events)}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline; 
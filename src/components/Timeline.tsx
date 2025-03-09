import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchHistoricalEvents } from '../services/historicalEvents';
import './Timeline.css';

interface HistoricalEvent {
  year: string;
  month: string;
  day: string;
  event: string;
}

interface GroupedEvent {
  date: string;
  year: string;
  month: string;
  day: string;
  events: string[];
}

const Timeline = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [events, setEvents] = useState<GroupedEvent[]>([]);
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLoadingComplete] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasScrolledRef = useRef(false);

  // Generate years from 1800 to 2024
  const years = Array.from({ length: 225 }, (_, i) => 1800 + i);

  const formatDate = (month: string, day: string, year: string) => {
    // Convert month number to month name
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(month) - 1;
    const monthName = monthNames[monthIndex];
    
    // Remove leading zeros from day
    const dayNum = parseInt(day);
    
    return `${monthName} ${dayNum}, ${year}`;
  };

  // Calculate days between two dates
  const getDaysBetween = (date1: Date, date2: Date) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round((date2.getTime() - date1.getTime()) / oneDay);
    return diffDays;
  };

  // Calculate the spacing for an event based on its date
  const calculateEventSpacing = (currentEvent: GroupedEvent, index: number, events: GroupedEvent[]) => {
    if (index === 0) return 0;

    const currentDate = new Date(
      parseInt(currentEvent.year),
      parseInt(currentEvent.month) - 1,
      parseInt(currentEvent.day)
    );
    
    const previousEvent = events[index - 1];
    const previousDate = new Date(
      parseInt(previousEvent.year),
      parseInt(previousEvent.month) - 1,
      parseInt(previousEvent.day)
    );

    const daysBetween = getDaysBetween(previousDate, currentDate);
    // Use 15px per day as the scale, with a minimum of 80px
    return Math.max(daysBetween * 15, 80);
  };

  const handleYearClick = (year: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    
    // Prepare the element for animation
    element.style.position = 'fixed';
    element.style.top = `${rect.top}px`;
    element.style.left = '0';
    element.style.width = '100%';
    element.style.setProperty('--initial-top', `${rect.top}px`);
    
    // Force a reflow and ensure all styles are applied
    element.offsetHeight;
    
    // Start animation sequence
    requestAnimationFrame(() => {
      // Step 1: Add initial animation class and start transition
      element.classList.add('animating');
      setIsTransitioning(true);
      
      requestAnimationFrame(() => {
        // Step 2: Start the movement to top
        element.classList.add('animating-to-top');
        
        // Step 3: After animation completes, update state
        setTimeout(() => {
          setSelectedYear(year);
          setLoadingComplete(false);
        }, 1000);
      });
    });
  };

  useEffect(() => {
    if (selectedYear) {
      setLoading(true);
      setEvents([]);
      setAnimationStarted(false);
      hasScrolledRef.current = false;  // Reset scroll flag when year changes
      
      const handleEventsReceived = (newEvents: HistoricalEvent[]) => {
        setEvents(prevEvents => {
          // Create a map to store unique events by date
          const eventMap = new Map<string, GroupedEvent>();
          
          // Process existing events
          prevEvents.forEach(group => {
            eventMap.set(group.date, group);
          });
          
          // Process and group new events
          newEvents.forEach(event => {
            const dateKey = `${event.year}-${event.month}-${event.day}`;
            
            if (eventMap.has(dateKey)) {
              // Add event to existing group if it's not already included
              const group = eventMap.get(dateKey)!;
              if (!group.events.includes(event.event)) {
                group.events.push(event.event);
              }
            } else {
              // Create new group
              eventMap.set(dateKey, {
                date: dateKey,
                year: event.year,
                month: event.month,
                day: event.day,
                events: [event.event]
              });
            }
          });

          // Convert map back to array and sort by date
          const sortedEvents = Array.from(eventMap.values()).sort((a, b) => {
            const dateA = new Date(parseInt(a.year), parseInt(a.month) - 1, parseInt(a.day));
            const dateB = new Date(parseInt(b.year), parseInt(b.month) - 1, parseInt(b.day));
            return dateA.getTime() - dateB.getTime();
          });

          // Only start animation when we have all events
          if (!animationStarted && sortedEvents.length > 0) {
            setTimeout(() => {
              setAnimationStarted(true);
              // Only scroll if we haven't scrolled yet
              if (!hasScrolledRef.current) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                hasScrolledRef.current = true;
              }
            }, 100);
          }

          return sortedEvents;
        });
      };

      const handleComplete = () => {
        setLoading(false);
        setLoadingComplete(true);
      };

      fetchHistoricalEvents(handleEventsReceived, handleComplete, selectedYear)
        .catch(err => {
          setError('Failed to fetch historical events');
          setLoading(false);
          console.error('Error:', err);
        });

      // Cleanup function
      return () => {
        setLoading(false);
        setEvents([]);
        setAnimationStarted(false);
      };
    }
  }, [selectedYear]);

  const handleBackClick = useCallback(() => {
    setSelectedYear(null);
    setEvents([]);
    setLoading(false);
    setError(null);
    setLoadingComplete(false);
    setAnimationStarted(false);
    setIsTransitioning(false);
  }, []);

  if (error) {
    return <div className="timeline-error">{error}</div>;
  }

  if (selectedYear === null) {
    return (
      <div className={`timeline-years ${isTransitioning ? 'transitioning' : ''}`}>
        {years.map(year => (
          <div
            key={year}
            className="timeline-year-item"
            onClick={(e) => handleYearClick(year, e.currentTarget)}
            data-year={year}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-year">{year}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <div 
        className="timeline-year-item selected"
        onClick={handleBackClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="timeline-year">{selectedYear}</div>
      </div>
      <div className="timeline-mask"></div>
      <div className={`timeline-events-container ${animationStarted ? 'visible' : ''}`}>
        {events.map((event, index) => (
          <div 
            key={event.date} 
            className="timeline-item"
            style={{ 
              marginTop: index === 0 ? 80 : calculateEventSpacing(event, index, events),
              '--animation-order': index
            } as React.CSSProperties}
          >
            <div className="timeline-date">
              {formatDate(event.month, event.day, event.year)}
            </div>
            <div className="timeline-dot"></div>
            <div 
              className="timeline-content"
              style={{ 
                '--animation-order': index
              } as React.CSSProperties}
            >
              {event.events.map((eventText, eventIndex) => (
                <div key={eventIndex} className="timeline-description">
                  {eventText}
                  {eventIndex < event.events.length - 1 && (
                    <div className="timeline-event-divider"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline; 
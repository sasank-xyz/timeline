import { useState, useEffect, useCallback } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

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

  const handleYearClick = useCallback((year: number) => {
    setSelectedYear(year);
    setEvents([]);
    setLoading(true);
    setError(null);
    setLoadingComplete(false);
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedYear(null);
    setEvents([]);
    setLoading(false);
    setError(null);
    setLoadingComplete(false);
  }, []);

  useEffect(() => {
    if (selectedYear && loading) {
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
            const formattedDate = formatDate(event.month, event.day, event.year);
            
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
          return Array.from(eventMap.values()).sort((a, b) => {
            const dateA = new Date(parseInt(a.year), parseInt(a.month) - 1, parseInt(a.day));
            const dateB = new Date(parseInt(b.year), parseInt(b.month) - 1, parseInt(b.day));
            return dateA.getTime() - dateB.getTime();
          });
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
    }
  }, [selectedYear, loading]);

  if (error) {
    return <div className="timeline-error">{error}</div>;
  }

  if (selectedYear === null) {
    return (
      <div className="timeline-years">
        {years.map(year => (
          <div
            key={year}
            className="timeline-year-item"
            onClick={() => handleYearClick(year)}
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
      <button className="timeline-back-button" onClick={handleBackClick}>
        Back to Years
      </button>
      <div className="timeline-year-item selected">
        <div className="timeline-year">{selectedYear}</div>
      </div>
      {loading && !loadingComplete && (
        <div className="timeline-loading-container">
          <div className="timeline-loading-content">
            Loading events from {selectedYear}...
          </div>
        </div>
      )}
      <div className="timeline-events-container">
        {events.map((event, index) => (
          <div 
            key={event.date} 
            className="timeline-item"
            style={{ 
              marginTop: index === 0 ? 0 : calculateEventSpacing(event, index, events)
            }}
          >
            <div className="timeline-date">
              {formatDate(event.month, event.day, event.year)}
            </div>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
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
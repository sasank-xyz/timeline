import { useState, useEffect, useCallback } from 'react';
import { fetchHistoricalEvents } from '../services/historicalEvents';
import './Timeline.css';

interface HistoricalEvent {
  year: string;
  month: string;
  day: string;
  event: string;
}

const Timeline = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
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
        setEvents(prevEvents => [...prevEvents, ...newEvents]);
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
          <div key={`${event.year}-${event.month}-${event.day}-${index}`} className="timeline-item">
            <div className="timeline-date">
              {formatDate(event.month, event.day, event.year)}
            </div>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-description">{event.event}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline; 
interface HistoricalEvent {
  year: string;
  month: string;
  day: string;
  event: string;
}

export const fetchHistoricalEvents = async (
  onEventsReceived: (events: HistoricalEvent[]) => void,
  onComplete: () => void,
  year: number
): Promise<void> => {
  const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;
  const baseUrl = 'https://api.api-ninjas.com/v1/historicalevents';
  let offset = 0;
  
  while (true) {
    try {
      const queryParams = `?year=${year}&offset=${offset}`;
      const response = await fetch(`${baseUrl}${queryParams}`, {
        headers: {
          'X-Api-Key': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HistoricalEvent[] = await response.json();
      
      // Send the new batch of events to the component
      onEventsReceived(data);
      
      // If we get less than 10 results, we've reached the end
      if (data.length === 0 || data.length < 10) {
        onComplete();
        break;
      }

      offset += 10; // Increment offset for next page
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error fetching historical events:', error);
      onComplete();
      break;
    }
  }
}; 
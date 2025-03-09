import { CSS_CLASSES } from '../constants';
import { formatDate } from '../utils/dateUtils';
import { GroupedEvent } from '../types';

interface TimelineEventProps {
  event: GroupedEvent;
  index: number;
  marginTop: number;
}

export const TimelineEvent = ({ event, index, marginTop }: TimelineEventProps) => {
  const { EVENT } = CSS_CLASSES;

  return (
    <div 
      className={EVENT.CONTAINER}
      style={{ 
        marginTop,
        '--animation-order': index
      } as React.CSSProperties}
    >
      <div className={EVENT.DATE}>
        {formatDate(event.month, event.day, event.year)}
      </div>
      <div className={EVENT.DOT} />
      <div 
        className={EVENT.CONTENT}
        style={{ '--animation-order': index } as React.CSSProperties}
      >
        {event.events.map((eventText, eventIndex) => (
          <div key={eventIndex} className={EVENT.DESCRIPTION}>
            {eventText}
            {eventIndex < event.events.length - 1 && (
              <div className={EVENT.DIVIDER} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 
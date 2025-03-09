import { CSS_CLASSES } from '../constants';
import { useCallback } from 'react';

interface TimelineYearProps {
  year: number;
  isSelected?: boolean;
  onYearClick: (year: number, element: HTMLDivElement) => void;
  onBackClick?: () => void;
}

export const TimelineYear = ({ 
  year, 
  isSelected = false, 
  onYearClick, 
  onBackClick 
}: TimelineYearProps) => {
  const { YEAR_ITEM } = CSS_CLASSES;
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected && onBackClick) {
      onBackClick();
    } else {
      onYearClick(year, e.currentTarget);
    }
  }, [year, isSelected, onYearClick, onBackClick]);

  return (
    <div
      className={`${YEAR_ITEM.CONTAINER} ${isSelected ? YEAR_ITEM.SELECTED : ''}`}
      onClick={handleClick}
      data-year={year}
      style={{ cursor: 'pointer' }}
    >
      <div className={YEAR_ITEM.DOT} />
      <div className={YEAR_ITEM.YEAR}>{year}</div>
    </div>
  );
}; 
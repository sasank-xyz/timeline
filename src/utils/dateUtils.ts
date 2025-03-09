import { MONTH_NAMES } from '../constants';

export const formatDate = (month: string, day: string, year: string): string => {
  const monthIndex = parseInt(month) - 1;
  const monthName = MONTH_NAMES[monthIndex];
  const dayNum = parseInt(day);
  return `${monthName} ${dayNum}, ${year}`;
};

export const getDaysBetween = (date1: Date, date2: Date): number => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / ONE_DAY_MS);
};

export const createDateFromParts = (year: string, month: string, day: string): Date => {
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

export const createDateKey = (year: string, month: string, day: string): string => {
  return `${year}-${month}-${day}`;
}; 
export const DATE_RANGES = {
  ONE_DAY: 24 * 60 * 60 * 1000,
  SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
  THIRTY_DAYS: 30 * 24 * 60 * 60 * 1000
} as const;

export const getDateRange = (preset: string) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const ranges: Record<string, { from: string; to: string }> = {
    today: { from: today, to: today },
    '7days': { 
      from: new Date(now.getTime() - DATE_RANGES.SEVEN_DAYS).toISOString().split('T')[0],
      to: today 
    },
    '30days': { 
      from: new Date(now.getTime() - DATE_RANGES.THIRTY_DAYS).toISOString().split('T')[0],
      to: today 
    }
  };
  
  return ranges[preset] || ranges['7days'];
};

export const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getEndOfDay = (date: Date) => {
  const start = getStartOfDay(date);
  return new Date(start.getTime() + DATE_RANGES.ONE_DAY);
};

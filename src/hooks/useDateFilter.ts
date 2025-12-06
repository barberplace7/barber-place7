import { useState, useEffect } from 'react';
import { getDateRange } from '@/utils/dateHelpers';

export const useDateFilter = (initialPreset: string = '7days') => {
  const [datePreset, setDatePreset] = useState(initialPreset);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const range = getDateRange(datePreset);
    setDateFrom(range.from);
    setDateTo(range.to);
  }, [datePreset]);

  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
  };

  const handleCustomDateChange = (from: string, to: string) => {
    setDatePreset('custom');
    setDateFrom(from);
    setDateTo(to);
  };

  return {
    datePreset,
    dateFrom,
    dateTo,
    setDatePreset: handlePresetChange,
    setCustomDates: handleCustomDateChange
  };
};

import { DayPhase } from '../types/game';

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '$0';
  if (Math.abs(amount) >= 1_000_000) {
    return (
      (amount < 0 ? '-$' : '$') +
      (Math.abs(amount) / 1_000_000).toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }) +
      'M'
    );
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(val: number): string {
  if (Math.abs(val) >= 1_000_000) {
    return (val / 1_000_000).toFixed(1) + 'M';
  }
  if (Math.abs(val) >= 1_000) {
    return (val / 1_000).toFixed(1) + 'K';
  }
  return val.toString();
}

export function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 && hour < 24 ? 'PM' : 'AM';
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  const displayMinute = minute < 10 ? `0${minute}` : minute.toString();
  return `${displayHour}:${displayMinute} ${period}`;
}

export function getDayPhase(hour: number): DayPhase {
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon';
  if (hour >= 18 && hour < 23) return 'Evening';
  return 'Night';
}

export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek % 7];
}

export function getCreditScoreTier(score: number): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  if (score >= 800) {
    return {
      label: 'Exceptional',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-500/30',
    };
  }
  if (score >= 740) {
    return {
      label: 'Very Good',
      color: 'text-teal-400',
      bg: 'bg-teal-950/60',
      border: 'border-teal-500/30',
    };
  }
  if (score >= 670) {
    return {
      label: 'Good',
      color: 'text-blue-400',
      bg: 'bg-blue-950/60',
      border: 'border-blue-500/30',
    };
  }
  if (score >= 580) {
    return {
      label: 'Fair',
      color: 'text-amber-400',
      bg: 'bg-amber-950/60',
      border: 'border-amber-500/30',
    };
  }
  return {
    label: 'Poor',
    color: 'text-rose-400',
    bg: 'bg-rose-950/60',
    border: 'border-rose-500/30',
  };
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function calculateProgress(collected: number, target: number): number {
  return Math.min(Math.round((collected / target) * 100), 100)
}

export function daysRemaining(endDateString: string): number {
  const endDate = new Date(endDateString)
  const today = new Date()

  // Set both dates to midnight for accurate day calculation
  endDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

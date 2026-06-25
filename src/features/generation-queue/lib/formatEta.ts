export function formatEta(seconds: number): string {
  if (seconds >= 60) {
    return `≈ ${Math.ceil(seconds / 60)} мин`;
  }

  return `≈ ${seconds} сек`;
}

export function formatDoneDuration(seconds: number): string {
  if (seconds >= 60) {
    return `готово за ${Math.ceil(seconds / 60)} мин`;
  }

  return `готово за ${seconds} сек`;
}

export function formatCredits(credits: number): string {
  return `${credits} cr`;
}

export function formatQueuePosition(position: number): string {
  return `позиция ${position} в очереди`;
}

import { LocationData } from '../types/location';

const STORAGE_KEYS = {
  LOCATION_HISTORY: 'location_tracker_history',
  SETTINGS: 'location_tracker_settings',
} as const;

export const storageService = {
  getLocationHistory(): LocationData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOCATION_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveLocationHistory(history: LocationData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATION_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save location history:', error);
    }
  },

  clearLocationHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.LOCATION_HISTORY);
  },

  exportToJSON(data: LocationData[]): void {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `location-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  },

  exportToCSV(data: LocationData[]): void {
    const headers = ['Timestamp', 'Date', 'Time', 'Latitude', 'Longitude', 'Accuracy'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.timestamp,
        new Date(item.timestamp).toLocaleDateString(),
        new Date(item.timestamp).toLocaleTimeString(),
        item.latitude,
        item.longitude,
        item.accuracy || 'N/A'
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `location-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
};
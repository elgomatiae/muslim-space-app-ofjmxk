
import * as Location from 'expo-location';

export interface PrayerTime {
  name: string;
  time: string;
  completed: boolean;
}

export interface PrayerTimesData {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  location: string;
}

// Calculate prayer times based on location
export async function calculatePrayerTimes(): Promise<PrayerTimesData | null> {
  try {
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return getDefaultPrayerTimes();
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Get location name
    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    const locationName = geocode[0]?.city || geocode[0]?.region || 'Unknown';

    // Calculate prayer times using a simplified algorithm
    // In production, you'd use a proper library like adhan-js
    const now = new Date();
    const prayerTimes = calculateSimplePrayerTimes(latitude, longitude, now);

    return {
      ...prayerTimes,
      date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      location: locationName,
    };
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    return getDefaultPrayerTimes();
  }
}

function calculateSimplePrayerTimes(lat: number, lon: number, date: Date): Omit<PrayerTimesData, 'date' | 'location'> {
  // This is a simplified calculation
  // In production, use a proper library like adhan-js or aladhan API
  
  const baseHour = 5; // Fajr base time
  
  return {
    fajr: formatTime(baseHour, 30),
    dhuhr: formatTime(12, 30),
    asr: formatTime(15, 45),
    maghrib: formatTime(18, 15),
    isha: formatTime(19, 45),
  };
}

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function getDefaultPrayerTimes(): PrayerTimesData {
  const now = new Date();
  return {
    fajr: '5:30 AM',
    dhuhr: '12:30 PM',
    asr: '3:45 PM',
    maghrib: '6:15 PM',
    isha: '7:45 PM',
    date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    location: 'Default Location',
  };
}

export function getNextPrayer(prayerTimes: PrayerTimesData): { name: string; time: string; timeUntil: string } {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    const prayerMinutes = parseTimeToMinutes(prayer.time);
    if (prayerMinutes > currentTime) {
      const minutesUntil = prayerMinutes - currentTime;
      const hours = Math.floor(minutesUntil / 60);
      const minutes = minutesUntil % 60;
      return {
        name: prayer.name,
        time: prayer.time,
        timeUntil: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      };
    }
  }

  // If no prayer is left today, return Fajr for tomorrow
  const fajrMinutes = parseTimeToMinutes(prayers[0].time);
  const minutesUntil = (24 * 60 - currentTime) + fajrMinutes;
  const hours = Math.floor(minutesUntil / 60);
  const minutes = minutesUntil % 60;
  
  return {
    name: 'Fajr',
    time: prayers[0].time,
    timeUntil: `${hours}h ${minutes}m`,
  };
}

function parseTimeToMinutes(timeStr: string): number {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes;
  
  if (period === 'PM' && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === 'AM' && hours === 12) {
    totalMinutes -= 12 * 60;
  }
  
  return totalMinutes;
}

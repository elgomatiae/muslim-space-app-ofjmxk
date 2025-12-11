
export interface PrayerTime {
  name: string;
  time: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function calculatePrayerTimes(coords: Coordinates, date: Date = new Date()): PrayerTime[] {
  const { latitude, longitude } = coords;
  
  const julianDate = getJulianDate(date);
  const equation = getEquationOfTime(julianDate);
  const declination = getSunDeclination(julianDate);
  
  const timezone = -date.getTimezoneOffset() / 60;
  
  const fajrAngle = 18;
  const ishaAngle = 17;
  
  const fajrTime = calculatePrayerTime(latitude, longitude, declination, equation, fajrAngle, timezone, true);
  const sunriseTime = calculatePrayerTime(latitude, longitude, declination, equation, 0.833, timezone, true);
  const dhuhrTime = 12 + timezone - longitude / 15 - equation / 60;
  const asrTime = calculateAsrTime(latitude, declination, dhuhrTime, equation, timezone);
  const maghribTime = calculatePrayerTime(latitude, longitude, declination, equation, 0.833, timezone, false);
  const ishaTime = calculatePrayerTime(latitude, longitude, declination, equation, ishaAngle, timezone, false);
  
  return [
    { name: 'Fajr', time: formatTime(fajrTime) },
    { name: 'Dhuhr', time: formatTime(dhuhrTime) },
    { name: 'Asr', time: formatTime(asrTime) },
    { name: 'Maghrib', time: formatTime(maghribTime) },
    { name: 'Isha', time: formatTime(ishaTime) },
  ];
}

function getJulianDate(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if (month <= 2) {
    return 365.25 * (year + 4716) + 30.6001 * (month + 13) + day - 1524.5;
  }
  return 365.25 * (year + 4716) + 30.6001 * (month + 1) + day - 1524.5;
}

function getEquationOfTime(julianDate: number): number {
  const d = julianDate - 2451545.0;
  const g = 357.529 + 0.98560028 * d;
  const q = 280.459 + 0.98564736 * d;
  const l = q + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
  const e = -1.915 * Math.sin(g * Math.PI / 180) - 0.020 * Math.sin(2 * g * Math.PI / 180) + 2.466 * Math.sin(2 * l * Math.PI / 180) - 0.053 * Math.sin(4 * l * Math.PI / 180);
  return e;
}

function getSunDeclination(julianDate: number): number {
  const d = julianDate - 2451545.0;
  const g = 357.529 + 0.98560028 * d;
  const q = 280.459 + 0.98564736 * d;
  const l = q + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
  const e = 23.439 - 0.00000036 * d;
  const declination = Math.asin(Math.sin(e * Math.PI / 180) * Math.sin(l * Math.PI / 180)) * 180 / Math.PI;
  return declination;
}

function calculatePrayerTime(
  latitude: number,
  longitude: number,
  declination: number,
  equation: number,
  angle: number,
  timezone: number,
  isSunrise: boolean
): number {
  const latRad = latitude * Math.PI / 180;
  const decRad = declination * Math.PI / 180;
  const angleRad = angle * Math.PI / 180;
  
  const cosH = (Math.sin(-angleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  
  if (cosH > 1 || cosH < -1) {
    return isSunrise ? 6 : 18;
  }
  
  const h = Math.acos(cosH) * 180 / Math.PI;
  const time = 12 + timezone - longitude / 15 - equation / 60 + (isSunrise ? -h / 15 : h / 15);
  
  return time;
}

function calculateAsrTime(
  latitude: number,
  declination: number,
  dhuhrTime: number,
  equation: number,
  timezone: number
): number {
  const latRad = latitude * Math.PI / 180;
  const decRad = declination * Math.PI / 180;
  
  const shadowFactor = 1;
  const angle = Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad))));
  
  const cosH = (Math.sin(angle) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  
  if (cosH > 1 || cosH < -1) {
    return dhuhrTime + 3;
  }
  
  const h = Math.acos(cosH) * 180 / Math.PI;
  return dhuhrTime + h / 15;
}

function formatTime(time: number): string {
  let hours = Math.floor(time);
  let minutes = Math.round((time - hours) * 60);
  
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }
  
  if (hours >= 24) {
    hours -= 24;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getNextPrayer(prayers: PrayerTime[], currentTime: Date): { prayer: PrayerTime; timeUntil: string } | null {
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  
  let nextPrayer: PrayerTime | null = null;
  let minDiff = Infinity;
  
  prayers.forEach(prayer => {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    const diff = prayerMinutes - currentMinutes;
    
    if (diff > 0 && diff < minDiff) {
      minDiff = diff;
      nextPrayer = prayer;
    }
  });
  
  if (!nextPrayer) {
    nextPrayer = prayers[0];
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    minDiff = (24 * 60 - currentMinutes) + prayerMinutes;
  }
  
  const hours = Math.floor(minDiff / 60);
  const mins = minDiff % 60;
  const timeUntil = `${hours}h ${mins}m`;
  
  return { prayer: nextPrayer, timeUntil };
}

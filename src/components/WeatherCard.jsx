import { WEATHER_TYPES } from '../data/weatherParkingData.js';

export default function WeatherCard({ weather }) {
  const wt = WEATHER_TYPES[weather.type] || WEATHER_TYPES.sunny;

  return (
    <div style={{
      background: wt.bg,
      borderRadius: 'var(--card-radius)',
      padding: '16px 20px',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow)',
    }}>
      <div>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>{weather.location}</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{weather.temperature}°C</div>
        <div style={{ fontSize: 14, opacity: 0.9, marginTop: 2 }}>{weather.description}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 48 }}>{wt.icon}</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>
          💧 {weather.humidity}% · 💨 {weather.windSpeed}m/s
        </div>
      </div>
    </div>
  );
}

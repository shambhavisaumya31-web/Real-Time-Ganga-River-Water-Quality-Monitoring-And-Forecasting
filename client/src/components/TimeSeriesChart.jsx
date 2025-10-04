import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'

export default function TimeSeriesChart({ last10Days, forecast3Days, parameter }) {
  // Prepare data for x-axis (dates)
  const historyData = last10Days.map(d => ({ date: dayjs(d.date).format('MM-DD'), history: d.value }));
  const forecastData = forecast3Days.map(d => ({ date: dayjs(d.date).format('MM-DD'), forecast: d.value }));

  // Merge data by date for a continuous x-axis
  const allDates = [
    ...historyData.map(d => d.date),
    ...forecastData.map(d => d.date)
  ];
  const uniqueDates = Array.from(new Set(allDates));
  const mergedData = uniqueDates.map(date => {
    const history = historyData.find(d => d.date === date)?.history;
    const forecast = forecastData.find(d => d.date === date)?.forecast;
    return { date, history, forecast };
  });

  return (   
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mergedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="history" stroke="#0a3d62" dot={false} isAnimationActive={false} name={`${parameter.toUpperCase()} (10-day)`} />
        <Line type="monotone" dataKey="forecast" stroke="#e17055" strokeDasharray="6 3" dot={true} isAnimationActive={false} name={`${parameter.toUpperCase()} (3-day forecast)`} />
      </LineChart>
    </ResponsiveContainer>
  );
}


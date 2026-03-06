import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import './RequirementScoreChart.css';

const getBarColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">Score: {score}/100</p>
      </div>
    );
  }
  return null;
};

function RequirementScoreChart({ data }) {
  return (
    <div className="req-score-chart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.05)' }} />
          <ReferenceLine
            y={80}
            stroke="#10b981"
            strokeDasharray="4 4"
            label={{ value: 'Good', position: 'right', fontSize: 10, fill: '#10b981' }}
          />
          <ReferenceLine
            y={60}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: 'Fair', position: 'right', fontSize: 10, fill: '#f59e0b' }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RequirementScoreChart;
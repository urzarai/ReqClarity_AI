import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './IssueBreakdownChart.css';

const COLORS = {
  Ambiguous: '#f59e0b',
  'Non-Testable': '#ef4444',
  Incomplete: '#8b5cf6',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{name}</p>
        <p className="chart-tooltip-value">{value} issues</p>
      </div>
    );
  }
  return null;
};

function IssueBreakdownChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="chart-empty">
        <span>🎉</span>
        <p>No issues detected!</p>
      </div>
    );
  }

  return (
    <div className="issue-breakdown-chart">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Issue count summary under chart */}
      <div className="issue-breakdown-summary">
        {data.map((item) => (
          <div key={item.name} className="issue-breakdown-item">
            <span
              className="issue-breakdown-dot"
              style={{ backgroundColor: COLORS[item.name] }}
            ></span>
            <span className="issue-breakdown-name">{item.name}</span>
            <span className="issue-breakdown-count">{item.value}</span>
          </div>
        ))}
        <div className="issue-breakdown-item issue-breakdown-total">
          <span className="issue-breakdown-name">Total</span>
          <span className="issue-breakdown-count">{total}</span>
        </div>
      </div>
    </div>
  );
}

export default IssueBreakdownChart;
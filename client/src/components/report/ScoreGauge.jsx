import './ScoreGauge.css';

function ScoreGauge({ score }) {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const fillPercent = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (fillPercent / 100) * circumference;

  const getScoreConfig = (s) => {
    if (s >= 80) return { label: 'Good', color: '#10b981', bgColor: '#d1fae5' };
    if (s >= 60) return { label: 'Fair', color: '#f59e0b', bgColor: '#fef3c7' };
    if (s >= 40) return { label: 'Poor', color: '#ef4444', bgColor: '#fee2e2' };
    return { label: 'Critical', color: '#7f1d1d', bgColor: '#fecaca' };
  };

  const config = getScoreConfig(score);

  return (
    <div className="score-gauge">
      <div className="score-gauge-circle-wrap">
        <svg
          className="score-gauge-svg"
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        >
          {/* Background track */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
          />
          {/* Score arc */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke={config.color}
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${radius} ${radius})`}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>

        {/* Center text */}
        <div className="score-gauge-center">
          <span className="score-gauge-number" style={{ color: config.color }}>
            {score}
          </span>
          <span className="score-gauge-label" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>

      <p className="score-gauge-desc">Overall Quality Score</p>

      {/* Score scale legend */}
      <div className="score-gauge-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
          <span>80–100 Good</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
          <span>60–79 Fair</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
          <span>40–59 Poor</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#7f1d1d' }}></span>
          <span>0–39 Critical</span>
        </div>
      </div>
    </div>
  );
}

export default ScoreGauge;
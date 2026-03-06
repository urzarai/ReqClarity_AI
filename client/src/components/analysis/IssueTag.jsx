import './IssueTag.css';

const ISSUE_CONFIG = {
  ambiguity: {
    label: 'Ambiguous',
    icon: '🔀',
    className: 'issue-tag-ambiguity',
  },
  'non-testability': {
    label: 'Non-Testable',
    icon: '🧪',
    className: 'issue-tag-testability',
  },
  incompleteness: {
    label: 'Incomplete',
    icon: '🧩',
    className: 'issue-tag-incompleteness',
  },
};

function IssueTag({ type, flaggedWord }) {
  const config = ISSUE_CONFIG[type] || {
    label: type,
    icon: '⚠️',
    className: 'issue-tag-default',
  };

  return (
    <span className={`issue-tag ${config.className}`}>
      <span className="issue-tag-icon">{config.icon}</span>
      {config.label}
      {flaggedWord && (
        <span className="issue-tag-word">"{flaggedWord}"</span>
      )}
    </span>
  );
}

export default IssueTag;
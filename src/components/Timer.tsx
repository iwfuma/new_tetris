const WARNING_THRESHOLD = 15;

export const Timer = ({ timeLeft }) => {
  const isWarning = timeLeft <= WARNING_THRESHOLD;

  return (
    <div className="panel">
      <div className="timer-block">
        <span className="timer-label">Time</span>
        <span className={`timer-value ${isWarning ? 'warning' : ''}`}>
          {timeLeft}
        </span>
      </div>
    </div>
  );
};
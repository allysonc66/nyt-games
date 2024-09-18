import classNames from 'classnames';
import CountDown from 'react-countdown';
import Modal from '../Modal';
import styles from './StatsModal.module.scss';
import { tomorrow } from '../../lib/words';

const StatsModal = ({
  isOpen,
  onClose,
  gameStats,
  numberOfGuessesMade,
  isGameWon,
  isGameLost,
  gameName,
  wordCount
}) => {

  switch (gameName) {
    default:
      return (
        <Modal title="Statistics" isOpen={isOpen} onClose={onClose}>
          <div className={styles.statsBar}>
            <StatItem label="Played" value={gameStats.totalGames} />
            <StatItem label="Win Rate %" value={gameStats.successRate} />
            <StatItem label="Current Streak" value={gameStats.currentStreak} />
            <StatItem label="Best Streak" value={gameStats.bestStreak} />
          </div>

          {gameName === "WORDLE" && ( // Conditional rendering based on gameName
            <>
              <h2>Guess Distribution</h2>
              <div className={styles.winDistribution}>
                {gameStats.winDistribution.map((value, i) => (
                  <Progress
                    key={i}
                    index={i}
                    currentDayStatRow={numberOfGuessesMade === i + 1}
                    size={90 * (value / Math.max(...gameStats.winDistribution))}
                    label={String(value)}
                  />
                ))}
              </div>
            </>
          )}
          {(isGameWon || isGameLost) && (
            <div className={styles.result}>
              <div className={styles.countDown}>
                <h2>Next game in</h2>
                <CountDown
                  date={tomorrow}
                  daysInHours={true}
                  className={styles.time}
                />
              </div>
            </div>
          )}
        </Modal>
      );
    case 'THE MINI':
      return (
        <Modal title="You won!" isOpen={isOpen} onClose={onClose}>
          {(isGameWon || isGameLost) && (
            <div className={styles.result}>
              <div className={styles.countDown}>
                <h2>Next game in</h2>
                <CountDown
                  date={tomorrow}
                  daysInHours={true}
                  className={styles.time}
                />
              </div>
            </div>
          )}
        </Modal>
      );
    case 'STRANDS':
      case 'STRANDS':
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: 'center' }}>
        {wordCount === 0 && (
          <div style={{ fontSize: '24px', color: '#d6c0dd', fontWeight: 'bold', margin: '20px' }}>
            Time to get started!
          </div>
        )}
        {wordCount > 0 && wordCount < 7 && (
          <div style={{ fontSize: '24px', color: '#d6c0dd', fontWeight: 'bold', margin: '20px' }}>
            Almost there! You've completed {wordCount} / 8 words.
          </div>
        )}
        {wordCount === 7 && (
          <div style={{ fontSize: '24px', color: '#d6c0dd', fontWeight: 'bold', margin: '20px' }}>
            Congrats, you found 7/7 words!
          </div>
        )}
      </div>
    </Modal>
  );

  }
};

const StatItem = ({ label, value }) => {
  return (
    <div className={styles.statItem}>
      <h3 className={styles.value}>{value}</h3>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

const Progress = ({ index, label, size, currentDayStatRow }) => {
  const classes = classNames({
    [styles.line]: true,
    [styles.blue]: currentDayStatRow,
    [styles.gray]: !currentDayStatRow,
  });

  return (
    <div className={styles.progress}>
      <div className={styles.index}>{index + 1}</div>
      <div className={styles.row}>
        <div className={classes} style={{ width: `${8 + size}%` }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatsModal;

// src/components/Alert.jsx
import { useEffect } from 'react';
import styles from './setAlert.scss';

const TempAlert = ({ message, duration, onClose, isVisible }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;
  return (
    <div className={styles.alert}>
      {message}
    </div>
  );
};

export default TempAlert;
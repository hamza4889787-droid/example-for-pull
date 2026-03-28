import React from 'react';
import styles from '../css/Watch-Video.module.css';
import Heading from '../components/Heading';
import { Link } from 'react-router-dom';

const WatchVideo: React.FC = () => {
  return (
    <> 
    <div className={styles.bg}></div>
    <div className={styles.container}>
      <Heading/>

      <div className={styles.videoWrapper}>
        <iframe
          className={styles.videoContent}
          src="https://www.youtube.com/embed/u6QfIXgjwGQ"
          title="Software Testing Explained in 100 Seconds"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className={styles.buttonGroup}>
        <Link to="/enter-email" className={styles.btn}>
          Register
        </Link>
        <Link to="/login" className={styles.btn}>
          Login
        </Link>
      </div>

      <footer className={styles.footer}>
        <span>LifePlan © 2026</span>
        <a href="#terms">Terms and Conditions</a>
        <a href="#privacy">Privacy Policy</a>
      </footer>
    </div>
    </>
  );
};

export default WatchVideo;
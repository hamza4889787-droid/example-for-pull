import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/Register-Through-Email.module.css';
import { useDispatch } from 'react-redux';
import { setTempEmail } from '../features/auth/authSlice';
import Heading from '../components/Heading';

const RegisterThroughEmail = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setTempEmail(email));
    navigate("/enter-password");
  };



  return (
    <>
    <div className={styles.bg}></div>
  
    <div className={styles.container}>
      <Heading/>

      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>

        <form onSubmit={handleNext} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.btnBlue}>
            Enter Email
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button className={styles.btnGoogle}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
          Continue with Google
        </button>
      </div>

      <footer className={styles.footer}>
        <span>LifePlan © 2026</span>
        <Link to="/terms">Terms and Conditions</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </footer>
    </div>
      </>
  );
};

export default RegisterThroughEmail;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/SignIn-password.module.css';
import { useDispatch } from 'react-redux';
import { setTempPassword } from '../features/auth/authSlice';
import Heading from '../components/Heading';

export const SignInPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    dispatch(setTempPassword(password));
    navigate("/verify-email");
  };
  return (
    <>
    <div className={styles.bg}></div>
    <div className={styles.container}>
     <Heading/>
      <div className={styles.card}>
        <h2 className={styles.title}>Create New Password</h2>
        <form className={styles.form} onSubmit={handleSignIn}>
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.btnBlue}>
            Sign In
          </button>
        </form>
        <Link to="/forgot" className={styles.forgotText}>Forgot password?</Link>
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
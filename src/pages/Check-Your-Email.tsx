import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { registerUser, setTempOtp } from '../features/auth/authSlice';
import styles from '../css/Check-Your-Email.module.css';

export const CheckYourEmail = () => {
  const { tempEmail, tempPassword, tempOtp } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);

  // ================== GENERATE & "SEND" OTP ==================
  useEffect(() => {
    if (tempEmail && tempPassword && !tempOtp) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      dispatch(setTempOtp(generatedOtp));
      setCountdown(60);

      console.log(
        `✅ VERIFICATION CODE SENT TO ${tempEmail}\n` +
        `Code: ${generatedOtp}\n` +
        `(This is a frontend-only demo — check the browser console)`
      );
    }
  }, [tempEmail, tempPassword, tempOtp, dispatch]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ================== OTP INPUT ==================
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // ================== VERIFY ==================
  const handleSignIn = () => {
    const code = otp.join("");

    if (code.length !== 6) {
      alert("Please enter the full 6-digit code.");
      return;
    }
    if (!tempOtp || code !== tempOtp) {
      alert("Invalid code. Please try again.");
      return;
    }

    if (tempEmail && tempPassword) {
      dispatch(registerUser({
        name: tempEmail.split('@')[0],
        email: tempEmail,
        password: tempPassword
      }));
      navigate("/dashboard");
    } else {
      alert("Session expired. Please start over.");
      navigate("/enter-email");
    }
  };

  // ================== RESEND ==================
  const handleResend = () => {
    if (!tempEmail) return;

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    dispatch(setTempOtp(newOtp));
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);

    console.log(
      `✅ NEW VERIFICATION CODE SENT TO ${tempEmail}\n` +
      `Code: ${newOtp}\n` +
      `(Frontend-only demo — check console)`
    );
  };

  return (
    <>
    <div className={styles.bg}></div>
    <div className={styles.container}>
      <h1 className={styles.logo}>LifePlan</h1>

      <div className={styles.card}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Check your Email</h2>
          <p className={styles.subtitle}>
            Enter 6-digit code sent to <b>{tempEmail || "your email"}</b>
          </p>
        </div>

        <div className={styles.otpGroup}>
          {otp.map((digit, idx) => (
            <React.Fragment key={idx}>
              <input
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                className={styles.otpInput}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
              />
              {idx === 2 && <span className={styles.dash}>—</span>}
            </React.Fragment>
          ))}
        </div>

        <button className={styles.btnBlue} onClick={handleSignIn}>
          Sign In
        </button>

        <div className={styles.infoArea}>
          <p>Make sure to check your spam folder.</p>

          <button
            className={styles.textBtn}
            onClick={handleResend}
            disabled={countdown > 0}
          >
            {countdown > 0
              ? `Resend in ${countdown}s`
              : "Can't find it? Try Again"
            }
          </button>

          <p className={styles.timer}>
            Try again in {countdown > 0 ? countdown : 0} seconds
          </p>
        </div>
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
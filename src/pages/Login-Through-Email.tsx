import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import type { AppDispatch } from "../app/store";
import { useNavigate, Link } from "react-router-dom";
import styles from '../css/Register-Through-Email.module.css';
import Heading from "../components/Heading";

// 1. Define the shape of your state
interface LoginForm {
    email: string;
}

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    // 2. Initialize with default values to avoid "undefined" errors
    const [formData, setFormData] = useState<LoginForm>({
        email: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 3. Use the 'name' attribute of the input to update the correct field
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 4. Dispatch the full object
        dispatch(loginUser(formData));

        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        
        // Note: You aren't collecting a password in this UI, 
        // so I'm only checking the email for now.
        const user = storedUsers.find(
            (u: any) => u.email === formData.email
        );

        if (user) {
            navigate("/dashboard");
        } else {
            alert("Email not found. Please register first.");
        }
    };

    return (
        <>
        <div className={styles.bg}></div>
        <div className={styles.container}>
            <Heading/>

            <div className={styles.card}>
                <h2 className={styles.title}>Login</h2>

                {/* 5. Changed to onSubmit */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        name="email" // Added name attribute
                        placeholder="Email"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className={styles.btnBlue}>
                        Continue
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

export default Login;
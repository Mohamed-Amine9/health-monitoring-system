import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthPage.scss';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('AuthPage component loaded');
        
        const switchCtn = document.querySelector("#switch-cnt");
        const switchC1 = document.querySelector("#switch-c1");
        const switchC2 = document.querySelector("#switch-c2");
        const switchCircle = document.querySelectorAll(".switch__circle");
        const switchBtn = document.querySelectorAll(".switch-btn");
        const aContainer = document.querySelector("#a-container");
        const bContainer = document.querySelector("#b-container");
        
        const getButtons = (e) => e.preventDefault();

        const changeForm = () => {
            switchCtn.classList.add("is-gx");
            setTimeout(function () {
                switchCtn.classList.remove("is-gx");
            }, 1500);

            switchCtn.classList.toggle("is-txr");
            switchCircle[0].classList.toggle("is-txr");
            switchCircle[1].classList.toggle("is-txr");

            switchC1.classList.toggle("is-hidden");
            switchC2.classList.toggle("is-hidden");
            aContainer.classList.toggle("is-txl");
            bContainer.classList.toggle("is-txl");
            bContainer.classList.toggle("is-z200");
        };

        switchBtn.forEach(btn => btn.addEventListener("click", changeForm));

        return () => {
            switchBtn.forEach(btn => btn.removeEventListener("click", changeForm));
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login button clicked');
        try {
            console.log('Sending login request to server...');
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
    
            console.log('Response received:', response.data);
    
            // Store the token
            localStorage.setItem('token', response.data.token);
    
            // Check if the user is a doctor and store the doctor.id
            if (response.data.doctor) {
                localStorage.setItem('doctorId', response.data.doctor.id);  // Correctly store doctorId
            }
    
            const userRole = response.data.doctor ? 'Doctor' :
                             response.data.patient ? 'Patient' :
                             response.data.admin ? 'Admin' : null;
    
            if (userRole === 'Admin') {
                console.log('Redirecting to admin dashboard');
                navigate('/admin-dashboard');
            } else if (userRole === 'Doctor') {
                console.log('Redirecting to doctor dashboard');
                navigate('/doctor-dashboard');
            } else if (userRole === 'Patient') {
                console.log('Redirecting to patient dashboard');
                navigate('/patient-dashboard');
            } else {
                setError('User role is not recognized.');
                console.log('User role is not recognized');
            }
    
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        }
    };
    

    return (
        <div className="main">
            <div className="container a-container" id="a-container">
                <form id="a-form" className="form">
                    <h2 className="form_title title">Create Account</h2>
                    <div className="form__icons">
                        <img className="form__icon" src="..." alt="Icon 1" />
                        <img className="form__icon" src="..." alt="Icon 2" />
                        <img className="form__icon" src="..." alt="Icon 3" />
                    </div>
                    <span className="form__span">or use email for registration</span>
                    <input className="form__input" type="text" placeholder="Name" />
                    <input className="form__input" type="text" placeholder="Email" />
                    <input className="form__input" type="password" placeholder="Password" />
                    <button className="form__button button submit" type="button">SIGN UP</button>
                </form>
            </div>

            <div className="container b-container" id="b-container">
                <form id="b-form" className="form" onSubmit={handleLogin}>
                    <h2 className="form_title title">Sign in to Website</h2>
                    <div className="form__icons">
                        <img className="form__icon" src="..." alt="Icon 1" />
                        <img className="form__icon" src="..." alt="Icon 2" />
                        <img className="form__icon" src="..." alt="Icon 3" />
                    </div>
                    <span className="form__span">or use your email account</span>
                    <input
                        className="form__input"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="form__input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <a className="form__link" href="#">Forgot your password?</a>
                    <button className="form__button button submit" type="submit">SIGN IN</button>
                </form>
            </div>

            <div className="switch" id="switch-cnt">
                <div className="switch__circle"></div>
                <div className="switch__circle switch__circle--t"></div>
                <div className="switch__container" id="switch-c1">
                    <h2 className="switch__title title">Welcome Back!</h2>
                    <p className="switch__description description">
                        To keep connected with us please login with your personal info
                    </p>
                    <button className="switch__button button switch-btn" type="button">SIGN IN</button>
                </div>
                <div className="switch__container is-hidden" id="switch-c2">
                    <h2 className="switch__title title">Hello Friend!</h2>
                    <p className="switch__description description">
                        Enter your personal details and start journey with us
                    </p>
                    <button className="switch__button button switch-btn" type="button">SIGN UP</button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

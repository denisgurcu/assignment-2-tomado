import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth({ setIsAuthenticated }) { // Receive setIsAuthenticated prop
  const [isRegistering, setIsRegistering] = useState(false); // Track login/register state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


// Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    // Reset the error state before starting a new request
    setError('');
  
    const url = isRegistering ? 'http://localhost:3000/users' : 'http://localhost:3000/users/sign-in';
    const body = JSON.stringify({ email, password });
  
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body,
        });
        
        const data = await res.json();
        console.log(data);  // Add this to inspect the response
        
        if (res.ok) {
            localStorage.setItem('authToken', data.token); // Store JWT token
            console.log('JWT stored:', localStorage.getItem('authToken'));
            setIsAuthenticated(true);
            navigate('/dashboard');
        
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error');
    }
  };
  
  

  return (
    <div className="auth-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <p>
        {isRegistering
          ? 'Not registered yet? Create an account.'
          : "Log in or register to save your To-Dos, update them and more."}
      </p>
      {error && <div className="error-message">{error}</div>}
      <p>
        {isRegistering ? 'Already have an account?' : 'Don\'t have an account? '}
        <a href="#" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login here' : 'Register here'}
        </a>
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {isRegistering && (
          <div>
            <label>Confirm Password:</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
        )}
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>

    </div>
  );
}

export default Auth;

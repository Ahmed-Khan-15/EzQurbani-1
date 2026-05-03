import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register as registerApi } from '../api/authApi';
import { Mail, Lock, Phone, User, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer' // Default role
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await registerApi(formData);
            login(data.token);
            navigate('/dashboard/customer');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', backgroundColor: '#fdf6e8', fontFamily: "'Nunito', sans-serif", padding: '2rem 0' }}>
            {/* Geo Background Pattern */}
            <div 
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
                    backgroundImage: `
                        repeating-linear-gradient(60deg, rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 40px),
                        repeating-linear-gradient(-60deg, rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 40px),
                        repeating-linear-gradient(0deg, rgba(201,168,76,0.03) 0px, rgba(201,168,76,0.03) 1px, transparent 1px, transparent 40px)
                    `
                }}
            />
            
            {/* Glow effect */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 65%)', pointerEvents: 'none' }} />

            {/* Main Card Container */}
            <div style={{ 
                maxWidth: '460px', width: '100%', margin: '0 1rem', padding: '3rem 2.5rem',
                backgroundColor: '#ffffff', borderRadius: '24px', position: 'relative', zIndex: 10,
                border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 24px 56px rgba(0,0,0,0.08)',
                boxSizing: 'border-box'
            }}>
                
                {/* Back to Home */}
                <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
                    <Link to="/" style={{ color: '#7a7060', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }} onMouseOver={(e) => e.target.style.color = '#c9a84c'} onMouseOut={(e) => e.target.style.color = '#7a7060'}>
                        ← Home
                    </Link>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', borderRadius: '50%', marginBottom: '1rem', border: '1px solid rgba(201,168,76,0.3)', backgroundColor: '#fdf6e8' }}>
                        <span style={{ color: '#1a4a35', fontSize: '1.8rem', fontFamily: "'Cormorant Garamond', serif" }}>☽</span>
                    </div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#1a4a35', lineHeight: 1.1, fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>
                        Create <span style={{ fontStyle: 'italic', color: '#c9a84c' }}>Account</span>
                    </h1>
                    <p style={{ color: '#7a7060', marginTop: '0.5rem', fontSize: '0.95rem' }}>Join EzQurbani today</p>
                </div>

                {error && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(230, 59, 59, 0.08)', borderLeft: '4px solid #e63b3b', color: '#b91c1c', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, marginTop: '0.125rem' }} />
                        <p style={{ fontSize: '0.875rem', margin: 0 }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#3d3928', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.1rem', height: '1.1rem', color: '#c9a84c' }} />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                style={{ 
                                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', boxSizing: 'border-box',
                                    backgroundColor: '#fdf6e8', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px',
                                    color: '#1a1a18', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1a4a35'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#3d3928', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.1rem', height: '1.1rem', color: '#c9a84c' }} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                style={{ 
                                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', boxSizing: 'border-box',
                                    backgroundColor: '#fdf6e8', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px',
                                    color: '#1a1a18', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1a4a35'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#3d3928', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.1rem', height: '1.1rem', color: '#c9a84c' }} />
                            <input
                                type="text"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0300-1234567"
                                style={{ 
                                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', boxSizing: 'border-box',
                                    backgroundColor: '#fdf6e8', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px',
                                    color: '#1a1a18', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1a4a35'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#3d3928', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1.1rem', height: '1.1rem', color: '#c9a84c' }} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{ 
                                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', boxSizing: 'border-box',
                                    backgroundColor: '#fdf6e8', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px',
                                    color: '#1a1a18', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1a4a35'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ 
                            width: '100%', padding: '0.9rem', marginTop: '0.5rem', borderRadius: '12px',
                            backgroundColor: '#c9a84c', color: '#1a4a35', fontWeight: 700, fontSize: '1rem',
                            border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1,
                            boxShadow: '0 8px 24px rgba(201,168,76,0.3)', transition: 'background-color 0.2s, transform 0.2s'
                        }}
                        onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#e8c87a')}
                        onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#c9a84c')}
                        onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(0.98)')}
                        onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#7a7060' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#1a4a35', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#c9a84c'} onMouseOut={(e) => e.target.style.color = '#1a4a35'}>
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

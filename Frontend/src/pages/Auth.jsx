import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaSignInAlt, FaUserShield, FaGraduationCap } from 'react-icons/fa';

const AuthContainer = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef6f1 0%, #fed7aa 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, transparent 70%);
  }
`;

const AuthCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(234, 88, 12, 0.15);
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  border: 1px solid #fed7aa;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const AuthLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #ea580c;
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
`;

const AuthTitle = styled.h2`
  font-size: 2.25rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AuthSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
`;

const FormInput = styled.input`
  padding: 1rem 1.25rem;
  border: 2px solid #fed7aa;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s;
  background: #fef6f1;

  &:focus {
    outline: none;
    border-color: #ea580c;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const AuthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  color: white;
  padding: 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AdminButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: transparent;
  color: #ea580c;
  border: 2px solid #ea580c;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #ea580c;
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AuthFooter = styled.div`
  text-align: center;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #fef6f1;
  color: #64748b;
`;

const RegisterLink = styled(Link)`
  color: #ea580c;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: #ea580c;
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
`;

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(username, password);
      if (result.success) {
        toast.success('Вход выполнен успешно');
        navigate('/applications');
      } else {
        toast.error(result.message || 'Ошибка входа');
      }
    } catch (error) {
      toast.error('Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    
    try {
      const result = await adminLogin();
      if (result.success) {
        toast.success('Вход администратора выполнен успешно');
        navigate('/admin');
      } else {
        toast.error(result.message || 'Ошибка входа администратора');
      }
    } catch (error) {
      toast.error('Ошибка при входе администратора');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <AuthLogo>
            <LogoIcon>
              <FaGraduationCap />
            </LogoIcon>
          </AuthLogo>
          <AuthTitle>Вход в систему</AuthTitle>
          <AuthSubtitle>Войдите в свой аккаунт для продолжения</AuthSubtitle>
        </AuthHeader>
        
        <AuthForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>
              <FaSignInAlt />
              Логин
            </FormLabel>
            <FormInput
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Введите ваш логин"
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <FaSignInAlt />
              Пароль
            </FormLabel>
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите ваш пароль"
              disabled={loading}
            />
          </FormGroup>
          
          <AuthButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner" />
                Вход...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Войти
              </>
            )}
          </AuthButton>

          <AdminButton 
            type="button" 
            onClick={handleAdminLogin}
            disabled={loading}
          >
            <FaUserShield />
            Вход для администратора
          </AdminButton>
        </AuthForm>

        <AuthFooter>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Нет аккаунта?
          </div>
          <RegisterLink to="/register">
            Зарегистрируйтесь сейчас
          </RegisterLink>
        </AuthFooter>
      </AuthCard>
    </AuthContainer>
  );
};

export default Auth;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowLeft } from 'react-icons/fa';
const RegisterContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const RegisterForm = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #4f46e5;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #1e293b;
  font-size: 2rem;
`;

const RegisterFormContent = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormInput = styled.input`
  padding: 1rem;
  border: 2px solid ${props => props.$error ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
`;

const RegisterSubmitButton = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RegisterLoginLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #6b7280;
`;

const LoginLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const result = await registerUser({
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email
      });

      if (result.success) {
        toast.success('Регистрация успешна!');
        navigate('/applications');
      } else {
        toast.error(result.message || 'Ошибка при регистрации');
      }
    } catch (error) {
      toast.error('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm>
        <BackButton to="/auth">
          <FaArrowLeft />
          Назад к входу
        </BackButton>
        
        <RegisterTitle>Регистрация</RegisterTitle>
        
        <RegisterFormContent onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormGroup>
              <FormLabel>
                <FaUser />
                Логин *
              </FormLabel>
              <FormInput
                type="text"
                placeholder="Только латиница и цифры"
                {...register('username', {
                  required: 'Логин обязателен',
                  minLength: {
                    value: 6,
                    message: 'Минимум 6 символов'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'Только латинские буквы и цифры'
                  }
                })}
                $error={errors.username}
              />
              {errors.username && (
                <ErrorMessage>{errors.username.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel>ФИО *</FormLabel>
              <FormInput
                type="text"
                placeholder="Иванов Иван Иванович"
                {...register('fullName', {
                  required: 'ФИО обязательно',
                  pattern: {
                    value: /^[а-яА-ЯёЁ\s]+$/,
                    message: 'Только кириллица и пробелы'
                  }
                })}
                $error={errors.fullName}
              />
              {errors.fullName && (
                <ErrorMessage>{errors.fullName.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel>
              <FaEnvelope />
              Email *
            </FormLabel>
            <FormInput
              type="email"
              placeholder="example@mail.ru"
              {...register('email', {
                required: 'Email обязателен',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некорректный email'
                }
              })}
              $error={errors.email}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <FormLabel>
                <FaLock />
                Пароль *
              </FormLabel>
              <FormInput
                type="password"
                placeholder="Минимум 8 символов"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 8,
                    message: 'Минимум 8 символов'
                  }
                })}
                $error={errors.password}
              />
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel>Подтверждение пароля *</FormLabel>
              <FormInput
                type="password"
                placeholder="Повторите пароль"
                {...register('confirmPassword', {
                  required: 'Подтвердите пароль',
                  validate: value => 
                    value === password || 'Пароли не совпадают'
                })}
                $error={errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel>
              <FaPhone />
              Телефон *
            </FormLabel>
            <FormInput
              type="tel"
              placeholder="8(XXX)XXX-XX-XX"
              {...register('phone', {
                required: 'Телефон обязателен',
                pattern: {
                  value: /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
                  message: 'Формат: 8(XXX)XXX-XX-XX'
                }
              })}
              $error={errors.phone}
            />
            {errors.phone && (
              <ErrorMessage>{errors.phone.message}</ErrorMessage>
            )}
          </FormGroup>

          <RegisterSubmitButton type="submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </RegisterSubmitButton>
        </RegisterFormContent>

        <RegisterLoginLink>
          Уже есть аккаунт? <LoginLink to="/auth">Войдите</LoginLink>
        </RegisterLoginLink>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;
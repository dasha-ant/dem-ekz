import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaArrowLeft, FaCalendarAlt, FaMoneyBillAlt, FaBook } from 'react-icons/fa';
const CreateApplicationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4f46e5;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1e293b;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.$error ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.$error ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CreateApplication = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/applications', data);
      
      if (response.data.success) {
        toast.success('Заявка успешно создана!');
        navigate('/applications');
      } else {
        toast.error('Ошибка при создании заявки');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          setError(err.path, { type: 'manual', message: err.msg });
        });
      } else {
        toast.error(error.response?.data?.message || 'Ошибка при создании заявки');
      }
    } finally {
      setLoading(false);
    }
  };

  const availableCourses = [
    'Основы алгоритмизации и программирования',
    'Основы веб-дизайна',
    'Основы проектирования баз данных'
  ];

  const paymentMethods = [
    { value: 'наличными', label: 'Наличными' },
    { value: 'перевод по номеру телефона', label: 'Перевод по номеру телефона' }
  ];

  const validateDate = (value) => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(value)) {
      return 'Дата должна быть в формате ДД.ММ.ГГГГ';
    }

    const [day, month, year] = value.split('.');
    const date = new Date(year, month - 1, day);
    
    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }

    return true;
  };

  return (
    <CreateApplicationContainer>
      <BackButton onClick={() => navigate('/applications')}>
        <FaArrowLeft />
        Назад к заявкам
      </BackButton>

      <PageTitle>Создание новой заявки</PageTitle>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormLabel>
            <FaBook />
            Название курса *
          </FormLabel>
          <FormSelect
            {...register('courseName', {
              required: 'Выберите курс'
            })}
            $error={errors.courseName}
          >
            <option value="">Выберите курс</option>
            {availableCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </FormSelect>
          {errors.courseName && (
            <ErrorMessage>{errors.courseName.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>
            <FaCalendarAlt />
            Желаемая дата начала обучения *
          </FormLabel>
          <FormInput
            type="text"
            placeholder="ДД.ММ.ГГГГ (например: 15.03.2025)"
            {...register('startDate', {
              required: 'Дата начала обязательна',
              validate: validateDate
            })}
            $error={errors.startDate}
          />
          {errors.startDate && (
            <ErrorMessage>{errors.startDate.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>
            <FaMoneyBillAlt />
            Способ оплаты *
          </FormLabel>
          <FormSelect
            {...register('paymentMethod', {
              required: 'Выберите способ оплаты'
            })}
            $error={errors.paymentMethod}
          >
            <option value="">Выберите способ оплаты</option>
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </FormSelect>
          {errors.paymentMethod && (
            <ErrorMessage>{errors.paymentMethod.message}</ErrorMessage>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Отправить заявку'}
        </SubmitButton>
      </Form>
    </CreateApplicationContainer>
  );
};

export default CreateApplication;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Slider from '../components/Slider';
import { 
  FaPlus, 
  FaHistory, 
  FaClipboardCheck, 
  FaGraduationCap,
  FaEdit,
  FaStar,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
  FaClock,
  FaRocket
} from 'react-icons/fa';

const ApplicationsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #1e293b;
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.1);
  text-align: center;
  transition: all 0.3s;
  border: 1px solid #fed7aa;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(234, 88, 12, 0.2);
  }
`;

const StatIcon = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, ${props => props.color || '#dc2626'} 0%, #ea580c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.75rem;
  box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  color: #64748b;
  font-weight: 500;
  font-size: 1.1rem;
`;

const ApplicationsList = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.1);
  overflow: hidden;
  border: 1px solid #fed7aa;
`;

const ApplicationItem = styled.div`
  padding: 2rem;
  border-bottom: 2px solid #fef6f1;
  transition: all 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fef6f1;
    transform: translateX(5px);
  }
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const ApplicationTitle = styled.h3`
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const ApplicationStatus = styled.span`
  padding: 0.5rem 1.25rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.new {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
  }

  &.in-progress {
    background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
    color: #9a3412;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
  }

  &.completed {
    background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%);
    color: #065f46;
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
  }
`;

const ApplicationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 1.1rem;
  padding: 0.75rem;
  background: #fef6f1;
  border-radius: 10px;
  transition: all 0.3s;

  &:hover {
    background: #fed7aa;
    color: #9a3412;
    transform: translateY(-2px);
  }
`;

const FeedbackSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #fed7aa;
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TextArea = styled.textarea`
  padding: 1.25rem;
  border: 2px solid #fed7aa;
  border-radius: 12px;
  font-size: 1.1rem;
  resize: vertical;
  min-height: 120px;
  background: #fef6f1;
  transition: all 0.3s;

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

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fef6f1;
  padding: 1rem;
  border-radius: 12px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${props => props.$active ? '#f59e0b' : '#fed7aa'};
  transition: all 0.3s;
  filter: ${props => props.$active ? 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' : 'none'};

  &:hover {
    color: #f59e0b;
    transform: scale(1.2);
  }
`;

const SubmitFeedbackButton = styled.button`
  align-self: flex-start;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 5rem;
  color: #64748b;
  font-size: 1.2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 3rem;
  box-shadow: 0 8px 25px rgba(234, 88, 12, 0.2);
`;

const DateBadge = styled.div`
  background: #fef6f1;
  color: #ea580c;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #fed7aa;
`;

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/applications');
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      toast.error('Ошибка при загрузке заявок');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (applicationId) => {
    const data = feedbackData[applicationId];
    if (!data || !data.feedback || !data.rating) {
      toast.error('Заполните отзыв и поставьте оценку');
      return;
    }

    setSubmittingFeedback(prev => ({ ...prev, [applicationId]: true }));

    try {
      const response = await axios.post(`/api/applications/${applicationId}/feedback`, data);
      if (response.data.success) {
        toast.success('Отзыв успешно добавлен');
        fetchApplications();
        setFeedbackData(prev => {
          const newData = { ...prev };
          delete newData[applicationId];
          return newData;
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при добавлении отзыва');
    } finally {
      setSubmittingFeedback(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const updateFeedbackData = (applicationId, field, value) => {
    setFeedbackData(prev => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        [field]: value
      }
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Новая':
        return <FaRocket />;
      case 'Идет обучение':
        return <FaSpinner className="fa-spin" />;
      case 'Обучение завершено':
        return <FaGraduationCap />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Новая':
        return 'new';
      case 'Идет обучение':
        return 'in-progress';
      case 'Обучение завершено':
        return 'completed';
      default:
        return '';
    }
  };

  const stats = {
    total: applications.length,
    new: applications.filter(app => app.status === 'Новая').length,
    inProgress: applications.filter(app => app.status === 'Идет обучение').length,
    completed: applications.filter(app => app.status === 'Обучение завершено').length
  };

  if (loading) {
    return (
      <ApplicationsContainer>
        <LoadingState>
          <div className="loading-spinner" style={{ width: '50px', height: '50px', margin: '0 auto 2rem' }} />
          Загрузка заявок...
        </LoadingState>
      </ApplicationsContainer>
    );
  }

  return (
    <ApplicationsContainer>
      <PageHeader>
        <PageTitle>Мои заявки на обучение</PageTitle>
        <CreateButton to="/applications/create">
          <FaPlus />
          Новая заявка
        </CreateButton>
      </PageHeader>

      <Slider />

      <StatsGrid>
        <StatCard>
          <StatIcon color="#dc2626">
            <FaClipboardCheck />
          </StatIcon>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Всего заявок</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#ea580c">
            <FaRocket />
          </StatIcon>
          <StatNumber>{stats.new}</StatNumber>
          <StatLabel>Новые</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#f97316">
            <FaSpinner />
          </StatIcon>
          <StatNumber>{stats.inProgress}</StatNumber>
          <StatLabel>В процессе</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#059669">
            <FaGraduationCap />
          </StatIcon>
          <StatNumber>{stats.completed}</StatNumber>
          <StatLabel>Завершено</StatLabel>
        </StatCard>
      </StatsGrid>

      {applications.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FaClipboardCheck />
          </EmptyIcon>
          <h3 style={{ margin: '1.5rem 0', fontSize: '1.75rem', color: '#1e293b' }}>
            У вас пока нет заявок
          </h3>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Создайте свою первую заявку на обучение
          </p>
          <CreateButton to="/applications/create">
            <FaPlus />
            Создать заявку
          </CreateButton>
        </EmptyState>
      ) : (
        <ApplicationsList>
          {applications.map((application) => (
            <ApplicationItem key={application.id}>
              <ApplicationHeader>
                <div>
                  <ApplicationTitle>
                    {application.courseName}
                  </ApplicationTitle>
                  <ApplicationStatus className={getStatusClass(application.status)}>
                    {getStatusIcon(application.status)}
                    {application.status}
                  </ApplicationStatus>
                </div>
                <DateBadge>
                  {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                </DateBadge>
              </ApplicationHeader>

              <ApplicationDetails>
                <DetailItem>
                  <FaCalendarAlt />
                  Начало обучения: {new Date(application.startDate).toLocaleDateString('ru-RU')}
                </DetailItem>
                <DetailItem>
                  <FaMoneyBillAlt />
                  Способ оплаты: {application.paymentMethod}
                </DetailItem>
              </ApplicationDetails>

              {application.status === 'Обучение завершено' && !application.feedback && (
                <FeedbackSection>
                  <h4 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.25rem' }}>
                    Оставьте отзыв о курсе
                  </h4>
                  <FeedbackForm onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitFeedback(application.id);
                  }}>
                    <TextArea
                      placeholder="Расскажите о вашем опыте обучения, что понравилось, что можно улучшить..."
                      value={feedbackData[application.id]?.feedback || ''}
                      onChange={(e) => updateFeedbackData(application.id, 'feedback', e.target.value)}
                      required
                    />
                    <RatingContainer>
                      <span style={{ marginRight: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                        Оценка курса:
                      </span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarButton
                          key={star}
                          type="button"
                          $active={feedbackData[application.id]?.rating >= star}
                          onClick={() => updateFeedbackData(application.id, 'rating', star)}
                        >
                          <FaStar />
                        </StarButton>
                      ))}
                    </RatingContainer>
                    <SubmitFeedbackButton
                      type="submit"
                      disabled={submittingFeedback[application.id]}
                    >
                      {submittingFeedback[application.id] ? 'Отправка...' : 'Отправить отзыв'}
                    </SubmitFeedbackButton>
                  </FeedbackForm>
                </FeedbackSection>
              )}

              {application.feedback && (
                <FeedbackSection>
                  <h4 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.25rem' }}>
                    Ваш отзыв о курсе:
                  </h4>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #fef6f1 0%, #fed7aa 100%)', 
                    padding: '1.5rem', 
                    borderRadius: '12px',
                    border: '1px solid #fed7aa'
                  }}>
                    <p style={{ 
                      marginBottom: '1rem', 
                      fontSize: '1.1rem',
                      lineHeight: '1.6',
                      color: '#1e293b'
                    }}>
                      {application.feedback}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: '#92400e',
                      fontWeight: '600'
                    }}>
                      <span>Оценка:</span>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < application.rating ? '#f59e0b' : '#fed7aa'}
                          size="1.25rem"
                        />
                      ))}
                      <span style={{ marginLeft: '0.5rem' }}>
                        ({application.rating}/5)
                      </span>
                    </div>
                  </div>
                </FeedbackSection>
              )}
            </ApplicationItem>
          ))}
        </ApplicationsList>
      )}
    </ApplicationsContainer>
  );
};

export default Applications;
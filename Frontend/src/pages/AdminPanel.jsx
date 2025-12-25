import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { 
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaSync,
  FaDownload,
  FaChartBar,
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCrown,
  FaFire,
  FaStar,
  FaUserShield,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

const AdminContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.75rem;
  color: #1e293b;
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const AdminWelcome = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(234, 88, 12, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h2`
  font-size: 2.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.95;
  max-width: 800px;
`;

const FiltersSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.1);
  margin-bottom: 3rem;
  border: 1px solid #fed7aa;
`;

const FiltersTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: #1e293b;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
`;

const FilterInput = styled.input`
  padding: 1rem;
  border: 2px solid #fed7aa;
  border-radius: 12px;
  font-size: 1.1rem;
  background: #fef6f1;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #ea580c;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    background: white;
  }
`;

const FilterSelect = styled.select`
  padding: 1rem;
  border: 2px solid #fed7aa;
  border-radius: 12px;
  font-size: 1.1rem;
  background: #fef6f1;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #ea580c;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    background: white;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;

  &.primary {
    background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4);
    }
  }

  &.secondary {
    background: #fef6f1;
    color: #ea580c;
    border: 2px solid #fed7aa;
    
    &:hover {
      background: #fed7aa;
      transform: translateY(-2px);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
  box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);
`;

const StatNumber = styled.div`
  font-size: 3rem;
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

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.1);
  overflow: hidden;
  margin-bottom: 3rem;
  border: 1px solid #fed7aa;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #fef6f1 0%, #fed7aa 100%);
`;

const TableRow = styled.tr`
  border-bottom: 2px solid #fef6f1;
  transition: all 0.3s;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fef6f1;
    transform: scale(1.005);
  }
`;

const TableHead = styled.th`
  padding: 1.5rem;
  text-align: left;
  font-weight: 700;
  color: #9a3412;
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;
  font-size: 1.1rem;
  border-right: 2px solid #fed7aa;
  
  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background: ${props => props.$sortable ? '#fed7aa' : 'transparent'};
  }
`;

const TableCell = styled.td`
  padding: 1.5rem;
  color: #64748b;
  font-weight: 500;
  border-right: 2px solid #fef6f1;
  
  &:last-child {
    border-right: none;
  }
`;

const StatusBadge = styled.span`
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

const ActionCell = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  width: 45px;
  height: 45px;
  background: ${props => props.$variant === 'edit' ? '#fef6f1' : 
    props.$variant === 'view' ? '#f0f9ff' : '#fef6f1'};
  border: 2px solid ${props => props.$variant === 'edit' ? '#fed7aa' : 
    props.$variant === 'view' ? '#bae6fd' : '#fed7aa'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$variant === 'edit' ? '#ea580c' : 
    props.$variant === 'view' ? '#0ea5e9' : '#dc2626'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
    background: ${props => props.$variant === 'edit' ? '#fed7aa' : 
      props.$variant === 'view' ? '#bae6fd' : '#fed7aa'};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef6f1 0%, #fed7aa 100%);
  border-top: 2px solid #fed7aa;
`;

const PageInfo = styled.div`
  color: #9a3412;
  font-weight: 600;
  font-size: 1.1rem;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const PageButton = styled.button`
  min-width: 45px;
  height: 45px;
  border: 2px solid #fed7aa;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  color: #ea580c;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #fed7aa;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 5rem;
  color: #64748b;
  font-size: 1.2rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(234, 88, 12, 0.1);
  margin-bottom: 2rem;
  border: 1px solid #fed7aa;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
`;

const AdminPanel = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1
  });

  useEffect(() => {
    fetchApplications();
    fetchStatistics();
  }, [filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.search && { search: filters.search })
      });

      const response = await axios.get(`/api/admin/applications?${queryParams}`);
      
      if (response.data.success) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
      } else {
        setError(response.data.message || 'Ошибка при загрузке данных');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.message || 'Ошибка соединения с сервером');
      toast.error('Ошибка при загрузке заявок');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/admin/statistics');
      if (response.data.success) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const response = await axios.put(`/api/admin/applications/${applicationId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success('Статус обновлен');
        fetchApplications();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при обновлении статуса');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 
    }));
  };

  const handleSort = (column) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const exportData = () => {
    const csvContent = [
      ['ID', 'Курс', 'Пользователь', 'Email', 'Телефон', 'Дата начала', 'Способ оплаты', 'Статус', 'Дата создания'],
      ...applications.map(app => [
        app.id,
        app.courseName,
        app.user?.fullName || '',
        app.user?.email || '',
        app.user?.phone || '',
        new Date(app.startDate).toLocaleDateString('ru-RU'),
        app.paymentMethod,
        app.status,
        new Date(app.createdAt).toLocaleDateString('ru-RU')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `заявки_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
      search: '',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return <FaSort />;
    return filters.sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (!user || user.role !== 'admin') {
    return (
      <AdminContainer>
        <div style={{ 
          textAlign: 'center', 
          padding: '5rem',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(234, 88, 12, 0.1)'
        }}>
          <div style={{ 
            width: '100px', 
            height: '100px',
            background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            color: 'white',
            fontSize: '2.5rem'
          }}>
            <FaUserShield />
          </div>
          <h2 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '1rem' }}>
            Доступ запрещен
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
            Требуются права администратора
          </p>
        </div>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <PageHeader>
        <PageTitle>Панель администратора</PageTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px',
            background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.75rem'
          }}>
            <FaCrown />
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.1rem' }}>
              {user.fullName}
            </div>
            <div style={{ color: '#ea580c', fontWeight: '600' }}>
              Администратор
            </div>
          </div>
        </div>
      </PageHeader>

      <AdminWelcome>
        <WelcomeContent>
          <WelcomeTitle>
            <FaFire />
            Добро пожаловать, {user.fullName}!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Панель управления заявками на обучение. Здесь вы можете просматривать все заявки,
            управлять их статусами и отслеживать статистику системы.
          </WelcomeSubtitle>
        </WelcomeContent>
      </AdminWelcome>

      <FiltersSection>
        <FiltersTitle>
          <FaFilter />
          Фильтры и поиск
        </FiltersTitle>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>
              <FaSearch />
              Поиск по пользователям
            </FilterLabel>
            <FilterInput
              type="text"
              placeholder="Имя, email или телефон"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <FaFilter />
              Статус заявки
            </FilterLabel>
            <FilterSelect
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Все статусы</option>
              <option value="Новая">Новая</option>
              <option value="Идет обучение">Идет обучение</option>
              <option value="Обучение завершено">Обучение завершено</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <FaCalendarAlt />
              Дата с
            </FilterLabel>
            <FilterInput
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <FaCalendarAlt />
              Дата по
            </FilterLabel>
            <FilterInput
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </FilterGroup>
        </FiltersGrid>

        <FilterActions>
          <ActionButton className="secondary" onClick={resetFilters}>
            <FaSync />
            Сбросить фильтры
          </ActionButton>
          <ActionButton className="primary" onClick={fetchApplications}>
            Применить фильтры
          </ActionButton>
        </FilterActions>
      </FiltersSection>

      {error && (
        <ErrorState>
          <ErrorIcon>
            <FaFilter />
          </ErrorIcon>
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
            Ошибка загрузки данных
          </h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            {error}
          </p>
          <ActionButton className="primary" onClick={fetchApplications}>
            <FaSync />
            Повторить попытку
          </ActionButton>
        </ErrorState>
      )}

      {statistics && (
        <StatsGrid>
          <StatCard>
            <StatIcon>
              <FaClipboardList />
            </StatIcon>
            <StatNumber>{statistics.totalApplications}</StatNumber>
            <StatLabel>Всего заявок</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaFire />
            </StatIcon>
            <StatNumber>{statistics.newApplications}</StatNumber>
            <StatLabel>Новых заявок</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaChartBar />
            </StatIcon>
            <StatNumber>{statistics.inProgressApplications}</StatNumber>
            <StatLabel>В процессе обучения</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaStar />
            </StatIcon>
            <StatNumber>{statistics.completedApplications}</StatNumber>
            <StatLabel>Завершено</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaUsers />
            </StatIcon>
            <StatNumber>{statistics.totalUsers}</StatNumber>
            <StatLabel>Всего пользователей</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaArrowRight />
            </StatIcon>
            <StatNumber>{statistics.recentUsers}</StatNumber>
            <StatLabel>Новых (7 дней)</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead $sortable onClick={() => handleSort('id')}>
                ID {getSortIcon('id')}
              </TableHead>
              <TableHead $sortable onClick={() => handleSort('courseName')}>
                Курс {getSortIcon('courseName')}
              </TableHead>
              <TableHead>Пользователь</TableHead>
              <TableHead $sortable onClick={() => handleSort('startDate')}>
                Дата начала {getSortIcon('startDate')}
              </TableHead>
              <TableHead>Оплата</TableHead>
              <TableHead $sortable onClick={() => handleSort('status')}>
                Статус {getSortIcon('status')}
              </TableHead>
              <TableHead $sortable onClick={() => handleSort('createdAt')}>
                Создано {getSortIcon('createdAt')}
              </TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="8" style={{ textAlign: 'center', padding: '4rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="loading-spinner" style={{ width: '50px', height: '50px' }} />
                    <div style={{ color: '#64748b', fontSize: '1.2rem' }}>Загрузка заявок...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan="8" style={{ textAlign: 'center', padding: '4rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    color: '#64748b'
                  }}>
                    <FaSearch size={60} />
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                      Заявки не найдены
                    </div>
                    <p>Попробуйте изменить параметры фильтрации</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div style={{ 
                      fontWeight: '700', 
                      color: '#ea580c',
                      fontSize: '1.1rem'
                    }}>
                      #{application.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>
                      {application.courseName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      {application.user?.fullName}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                      {application.user?.email}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                      {application.user?.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ 
                      padding: '0.5rem 1rem',
                      background: '#fef6f1',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      {new Date(application.startDate).toLocaleDateString('ru-RU')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ 
                      padding: '0.5rem 1rem',
                      background: '#f0f9ff',
                      borderRadius: '8px',
                      color: '#0ea5e9',
                      fontWeight: '500'
                    }}>
                      {application.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge className={
                      application.status === 'Новая' ? 'new' :
                      application.status === 'Идет обучение' ? 'in-progress' : 'completed'
                    }>
                      {application.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div style={{ 
                      padding: '0.5rem 1rem',
                      background: '#fef6f1',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ActionCell>
                      <IconButton 
                        $variant="edit"
                        title="Изменить статус"
                        onClick={() => {
                          const newStatus = 
                            application.status === 'Новая' ? 'Идет обучение' :
                            application.status === 'Идет обучение' ? 'Обучение завершено' : 'Новая';
                          updateStatus(application.id, newStatus);
                        }}
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton 
                        $variant="view"
                        title="Просмотреть детали"
                        onClick={() => {
                          toast.info(`Заявка #${application.id} от ${application.user?.fullName}`);
                        }}
                      >
                        <FaEye />
                      </IconButton>
                    </ActionCell>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>

        {pagination.pages > 1 && (
          <Pagination>
            <PageInfo>
              Показано {applications.length} из {pagination.total} заявок
            </PageInfo>
            <PageButtons>
              <ActionButton 
                className="secondary" 
                onClick={exportData}
                style={{ marginRight: '1.5rem' }}
              >
                <FaDownload />
                Экспорт CSV
              </ActionButton>
              
              <PageButton
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                <FaArrowLeft />
              </PageButton>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PageButton
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={filters.page === pageNum ? 'active' : ''}
                  >
                    {pageNum}
                  </PageButton>
                );
              })}
              
              <PageButton
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.pages}
              >
                <FaArrowRight />
              </PageButton>
            </PageButtons>
          </Pagination>
        )}
      </TableContainer>
    </AdminContainer>
  );
};

export default AdminPanel;
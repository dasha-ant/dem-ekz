import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { 
  FaHome, 
  FaUser, 
  FaSignOutAlt, 
  FaClipboardList,
  FaUserCog,
  FaGraduationCap
} from 'react-icons/fa';


const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #940d0d 0%, #993c40 100%);
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  text-decoration: none;
  font-size: 1.75rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cc2f37;
  font-size: 1.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  transition: all 0.3s;
  font-weight: 500;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: left 0.3s;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);

    &::before {
      left: 100%;
    }
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    span {
      display: none;
    }
    padding: 0.75rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
  font-weight: 500;

  @media (max-width: 768px) {
    .user-name {
      display: none;
    }
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid white;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    span {
      display: none;
    }
    padding: 0.75rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: ${props => props.$open ? 'flex' : 'none'};
  flex-direction: column;
  background: white;
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
  z-index: 1000;
  border-radius: 0 0 12px 12px;
  overflow: hidden;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  color: #1e293b;
  text-decoration: none;
  border-bottom: 1px solid #fed7aa;
  transition: all 0.3s;

  &:hover {
    background: #fef6f1;
    color: #a72344;
  }

  &.active {
    background: #fed7aa;
    color: #9b151c;
    font-weight: 600;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const AdminBadge = styled.span`
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <HeaderContainer>
      <Nav>
        <NavContent>
          <Logo to={user ? '/applications' : '/auth'}>
            <LogoIcon>
              <FaGraduationCap />
            </LogoIcon>
            <span>Корочки.есть</span>
          </Logo>

          {/* Desktop Navigation */}
          {user && (
            <>
              <NavLinks style={{ display: 'flex' }}>
                <NavLink 
                  to="/applications" 
                  className={isActive('/applications') ? 'active' : ''}
                >
                  <FaClipboardList />
                  <span>Мои заявки</span>
                </NavLink>
                
                <NavLink 
                  to="/applications/create" 
                  className={isActive('/applications/create') ? 'active' : ''}
                >
                  <FaHome />
                  <span>Новая заявка</span>
                </NavLink>
                
                {isAdmin && (
                  <NavLink 
                    to="/admin" 
                    className={isActive('/admin') ? 'active' : ''}
                  >
                    <FaUserCog />
                    <span>Админ-панель</span>
                  </NavLink>
                )}
              </NavLinks>

              <UserInfo>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <UserAvatar>
                    {getInitials(user.fullName)}
                  </UserAvatar>
                  <div>
                    <div className="user-name" style={{ display: 'flex', alignItems: 'center' }}>
                      {user.fullName}
                      {isAdmin && <AdminBadge>ADMIN</AdminBadge>}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </div>
                  </div>
                </div>
                <LogoutButton onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Выйти</span>
                </LogoutButton>
              </UserInfo>
            </>
          )}

          {user && (
            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>
          )}
        </NavContent>

        {user && (
          <MobileMenu $open={mobileMenuOpen}>
            <MobileNavLink 
              to="/applications" 
              className={isActive('/applications') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaClipboardList />
              Мои заявки
            </MobileNavLink>
            
            <MobileNavLink 
              to="/applications/create" 
              className={isActive('/applications/create') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaHome />
              Новая заявка
            </MobileNavLink>
            
            {isAdmin && (
              <MobileNavLink 
                to="/admin" 
                className={isActive('/admin') ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUserCog />
                Админ-панель
              </MobileNavLink>
            )}
            
            <MobileNavLink 
              as="button"
              onClick={handleLogout}
              style={{ 
                borderBottom: 'none',
                background: '#fef6f1',
                color: '#bbd4f5'
              }}
            >
              <FaSignOutAlt />
              Выйти
            </MobileNavLink>
          </MobileMenu>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
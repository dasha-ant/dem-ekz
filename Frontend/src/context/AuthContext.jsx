import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log(' Токен установлен в axios:', token.substring(0, 20) + '...');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log(' Токен удален из axios');
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          console.log(' Проверка токена...');
          const response = await axios.get('/api/auth/me');
          console.log('Ответ от /api/auth/me:', response.data);
          
          if (response.data.success) {
            setUser(response.data.user);
            console.log(' Пользователь загружен:', response.data.user.username);
          } else {
            console.log(' Ошибка загрузки пользователя');
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error(' Ошибка проверки токена:', error.response?.data || error.message);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      console.log(' Попытка входа:', username);
      
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });

      console.log(' Ответ сервера при входе:', response.data);

      if (response.data.success) {
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
  
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log(' Вход успешен. Токен сохранен.');
        toast.success('Вход выполнен успешно');
        
        return { success: true };
      } else {
        console.log(' Ошибка входа:', response.data.message);
        toast.error(response.data.message || 'Ошибка входа');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(' Ошибка сети при входе:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Ошибка при входе';
      
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const adminLogin = async () => {
    try {
      console.log('Попытка входа администратора...');
      
      const response = await axios.post('/api/auth/admin/login', {
        username: 'Admin',
        password: 'KorokNET'
      });

      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success('Вход администратора выполнен успешно');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Ошибка входа администратора');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Ошибка входа администратора:', error);
      const message = error.response?.data?.message || 'Ошибка при входе администратора';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      console.log(' Попытка регистрации:', userData.username);
      
      const response = await axios.post('/api/auth/register', userData);
      console.log('Ответ сервера при регистрации:', response.data);

      if (response.data.success) {
        const { user, token } = response.data;
 
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log(' Регистрация успешна');
        toast.success('Регистрация успешна!');
        
        return { success: true };
      } else {
        console.log(' Ошибка регистрации:', response.data.message);
        toast.error(response.data.message || 'Ошибка при регистрации');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(' Ошибка при регистрации:', error.response?.data || error.message);

      let errorMessage = 'Ошибка при регистрации';
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Проблема с подключением к серверу';
      }
      
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    console.log(' Выход из системы');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Вы вышли из системы');
  };

  const checkToken = async () => {
    if (token) {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          return true;
        }
      } catch (error) {
        console.log('Токен невалиден');
        logout();
        return false;
      }
    }
    return false;
  };

  const value = {
    user,
    loading,
    token,
    login,
    adminLogin,
    register,
    logout,
    checkToken,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaCode, FaPalette, FaDatabase, FaRocket } from 'react-icons/fa';
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 20px;
  margin: 3rem 0;
  box-shadow: 0 8px 32px rgba(234, 88, 12, 0.2);
  background: linear-gradient(135deg, #5d3c9b 0%, #d4b291 100%);
`;

const Slide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.$active ? 1 : 0};
  transform: translateX(${props => props.$active ? 0 : '100%'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const SlideContent = styled.div`
  text-align: center;
  color: white;
  max-width: 800px;
  opacity: ${props => props.$active ? 1 : 0};
  transform: translateY(${props => props.$active ? 0 : '30px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
`;

const SlideIcon = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 3.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const SlideTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
`;

const SlideDescription = styled.p`
  font-size: 1.5rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SliderButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  &.prev {
    left: 2rem;
  }

  &.next {
    right: 2rem;
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
`;

const Dot = styled.button`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.2);
  }
`;

const slides = [
  {
    id: 1,
    icon: <FaCode />,
    title: 'Программирование',
    description: 'Освойте основы алгоритмизации и программирования. Научитесь создавать эффективные алгоритмы и писать чистый код.',
    color: '#910101'
  },
  {
    id: 2,
    icon: <FaPalette />,
    title: 'Веб-дизайн',
    description: 'Научитесь создавать современные веб-интерфейсы. Изучите принципы UX/UI дизайна и работу с графическими редакторами.',
    color: '#5767ad'
  },
  {
    id: 3,
    icon: <FaDatabase />,
    title: 'Базы данных',
    description: 'Изучите проектирование и работу с базами данных. Научитесь создавать эффективные схемы и оптимизировать запросы.',
    color: '#26814c'
  },
  {
    id: 4,
    icon: <FaRocket />,
    title: 'Карьерный рост',
    description: 'Получите востребованные IT-навыки и начните успешную карьеру в технологической индустрии.',
    color: '#c970b3'
  }
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SliderContainer>
      {slides.map((slide, index) => (
        <Slide 
          key={slide.id} 
          $active={currentSlide === index}
          style={{ background: `linear-gradient(135deg, ${slide.color} 0%, #cfbfb6 100%)` }}
        >
          <SlideContent $active={currentSlide === index}>
            <SlideIcon>
              {slide.icon}
            </SlideIcon>
            <SlideTitle>{slide.title}</SlideTitle>
            <SlideDescription>{slide.description}</SlideDescription>
          </SlideContent>
        </Slide>
      ))}
      
      <SliderButton className="prev" onClick={prevSlide}>
        <FaChevronLeft />
      </SliderButton>
      
      <SliderButton className="next" onClick={nextSlide}>
        <FaChevronRight />
      </SliderButton>
      
      <DotsContainer>
        {slides.map((_, index) => (
          <Dot
            key={index}
            $active={currentSlide === index}
            onClick={() => goToSlide(index)}
          />
        ))}
      </DotsContainer>
    </SliderContainer>
  );
};

export default Slider;
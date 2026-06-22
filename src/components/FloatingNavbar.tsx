import React from 'react';
import { Home, BarChart2, Gamepad2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
  indicatorPosition: number;
  position: number;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  isActive = false, 
  onClick,
  indicatorPosition,
  position,
  label
}) => {
  const distance = Math.abs(indicatorPosition - position);
  const spotlightOpacity = isActive ? 1 : Math.max(0, 1 - distance * 0.6);

  return (
    <button
      className="relative flex items-center justify-center w-12 h-12 mx-2 transition-all duration-300 group"
      onClick={onClick}
      title={label}
    >
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-24 bg-gradient-to-b from-white/20 to-transparent blur-md rounded-full transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: spotlightOpacity,
          transitionDelay: isActive ? '0.1s' : '0s',
        }}
      />
      <Icon
        className={`w-6 h-6 transition-colors duration-200 ${
          isActive ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-stone-500 group-hover:text-stone-300'
        }`}
        strokeWidth={isActive ? 2.5 : 2}
      />
    </button>
  );
};

export const FloatingNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { icon: Home, label: 'Trang Chủ', path: '/' },
    { icon: BarChart2, label: 'Live Poll', path: '/poll' },
    { icon: Gamepad2, label: 'Thử Thách', path: '/quiz' },
  ];

  const activeIndex = Math.max(0, navItems.findIndex(item => item.path === location.pathname));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999]">
      <nav className="relative flex items-center px-2 py-3 bg-black/70 backdrop-blur-xl rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10">
        <div 
          className="absolute top-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(249,115,22,1)]"
          style={{
            left: `${activeIndex * 64 + 16}px`,
            width: '48px',
            transform: 'translateY(-1px)',
          }}
        />
        {navItems.map((item, index) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            isActive={activeIndex === index}
            onClick={() => navigate(item.path)}
            indicatorPosition={activeIndex}
            position={index}
            label={item.label}
          />
        ))}
      </nav>
    </div>
  );
};

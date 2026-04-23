import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
export function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed top-0 left-0 w-full lg:w-[103px] lg:h-full h-[72px] md:h-[80px] lg:h-full bg-sidebar flex lg:flex-col justify-between items-center z-[100] lg:rounded-r-[20px]">
      {/* Logo Container */}
      <div className="w-[72px] h-[72px] md:w-[80px] md:h-[80px] lg:w-full lg:h-[103px] bg-primary rounded-r-[20px] relative overflow-hidden flex items-center justify-center">
        <div className="absolute bottom-0 w-full h-1/2 bg-primary-light rounded-tl-[20px]"></div>
        <svg width="28" height="26" viewBox="0 0 28 26" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
          <path d="M14 0L27.8564 24H0.143594L14 0Z" fill="white"/>
        </svg>
      </div>

      <div className="flex lg:flex-col items-center lg:h-full h-full">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-6 lg:p-8 text-ship-cove hover:text-ghost-white transition-colors duration-200"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" fill="currentColor" />
          ) : (
            <Sun className="w-5 h-5" fill="currentColor" />
          )}
        </button>

        {/* Separator */}
        <div className="w-[1px] h-full lg:w-full lg:h-[1px] bg-[#494E6E]"></div>

        {/* User Avatar */}
        <div className="p-6 lg:p-8">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border border-transparent hover:border-white transition-all cursor-pointer">
             <img 
              src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix" 
              alt="User Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

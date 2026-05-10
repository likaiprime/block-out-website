import { FC } from "react";

interface MenuButtonProps {
  navbarOpen: boolean;
  onClick: () => void;
}

const MenuButton: FC<MenuButtonProps> = ({ navbarOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={navbarOpen}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-secondary transition-colors md:hidden"
    >
      <span className="relative block h-4 w-5">
        <span
          className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out ${
            navbarOpen ? "top-1.5 rotate-45" : "top-0"
          }`}
        />
        <span
          className={`absolute left-0 top-1.5 block h-0.5 w-full rounded-full bg-current transition-all duration-200 ${
            navbarOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out ${
            navbarOpen ? "top-1.5 -rotate-45" : "top-3"
          }`}
        />
      </span>
    </button>
  );
};

export default MenuButton;

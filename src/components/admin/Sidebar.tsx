import { Transition } from "@headlessui/react";
import {
  Layers,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import { Fragment } from "react";

const Sidebar: React.FC<{
  activePage: string;
  setActivePage: (page: string) => void;
  isCollapsed: boolean;
}> = ({ activePage, setActivePage, isCollapsed }) => {
  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "orders", label: "الطلبات", icon: ShoppingCart },
    { id: "products", label: "المنتجات", icon: Package },
    { id: "categories", label: "الفئات", icon: Tag },
    { id: "sections", label: "الأقسام", icon: Layers },
  ];
  return (
    <aside
      className={`bg-white border-l border-neutral-200 rtl:border-l-0 rtl:border-r rtl:border-neutral-200 flex-col fixed inset-y-0 hidden md:flex transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-center h-16 border-b border-neutral-200 px-4">
        <a href="#" className="flex flex-col items-center leading-none">
          <span
            className={`font-bold text-amber-500 transition-all duration-300 ${
              isCollapsed ? "text-2xl" : "text-3xl"
            }`}
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {isCollapsed ? "H" : "Huyamy"}
          </span>
          {!isCollapsed && (
            <span className="text-xs text-green-800 font-semibold tracking-wider">
              لوحة التحكم
            </span>
          )}
        </a>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.id);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  activePage === item.id
                    ? "bg-green-100 text-green-800 font-bold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
const MobileSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}> = ({ isOpen, onClose, activePage, setActivePage }) => {
  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "orders", label: "الطلبات", icon: ShoppingCart },
    { id: "products", label: "المنتجات", icon: Package },
    { id: "categories", label: "الفئات", icon: Tag },
    { id: "sections", label: "الأقسام", icon: Layers },
  ];
  const handleLinkClick = (page: string) => {
    setActivePage(page);
    onClose();
  };
  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 md:hidden" dir="rtl">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative w-64 bg-white h-full flex flex-col">
            <div className="flex items-center justify-between h-16 border-b border-neutral-200 px-4">
              <a href="#" className="flex flex-col items-start leading-none">
                <span
                  className="text-3xl font-bold text-amber-500"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  Huyamy
                </span>
                <span className="text-xs text-green-800 font-semibold tracking-wider">
                  لوحة التحكم
                </span>
              </a>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.id);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activePage === item.id
                          ? "bg-green-100 text-green-800 font-bold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export { Sidebar, MobileSidebar };

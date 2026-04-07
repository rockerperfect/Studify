import React from 'react';
import { LayoutDashboard, Library, Calendar, BarChart3, Settings, BookOpen, Brain, Inbox, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcher } from '../navigation/RoleSwitcher';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const defaultNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'library',   label: 'Library',   icon: Library },
  { id: 'planner',   label: 'Planner',   icon: BookOpen },
  { id: 'quiz',      label: 'Quiz',      icon: Brain },
  { id: 'analyze',   label: 'Analyze',   icon: BarChart3 },
  { id: 'calendar',  label: 'Calendar',  icon: Calendar },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

function getNavItems(isTeacher: boolean, isAdmin: boolean) {
  let items = [...defaultNavItems];
  if (isTeacher) items = [items[0], { id: 'inbox', label: 'PR Inbox', icon: Inbox }, ...items.slice(1)];
  if (isAdmin)   items = [items[0], { id: 'admin', label: 'Users',    icon: Users }, ...items.slice(1)];
  return items;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { isTeacher, isAdmin, user, logout } = useAuth();
  const navItems = getNavItems(isTeacher, isAdmin);

  return (
    <aside
      className="hidden lg:block w-64 h-screen sticky top-0 p-6"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Brand */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold gradient-text">STUDIFY</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Study smarter, not longer</p>
      </div>

      {/* Role Switcher */}
      <div className="mb-6 flex-shrink-0">
        <RoleSwitcher />
      </div>

      {/* Nav Links — scrollable if too tall */}
      <nav className="space-y-1 overflow-y-auto flex-1 min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]
                transition-all duration-300 font-medium
                ${isActive
                  ? 'glass-card text-[var(--color-text-primary)] shadow-[0_8px_20px_rgba(155,124,255,0.15)]'
                  : 'text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text-primary)]'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom: user info + logout — always pinned at bottom */}
      <div className="flex-shrink-0 mt-4 pt-4 border-t border-white/10">
        {user && (
          <div className="mb-3 px-1">
            <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{user.full_name || user.email}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--color-primary-violet)]/20 text-[var(--color-primary-violet)]">
              {user.role}
            </span>
          </div>
        )}
        <button
          onClick={logout}
          className="
            w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]
            text-red-400 hover:bg-red-500/10 hover:text-red-300
            transition-all duration-300 font-medium
          "
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export function MobileNav({ activeView, onViewChange }: SidebarProps) {
  const { isTeacher, isAdmin, logout } = useAuth();
  const navItems = getNavItems(isTeacher, isAdmin);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-white/20">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[52px]
                transition-all duration-300
                ${isActive ? 'text-[var(--color-primary-violet)]' : 'text-[var(--color-text-muted)]'}
              `}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[52px] text-red-400 transition-all duration-300"
          aria-label="Log out"
        >
          <LogOut size={20} />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}

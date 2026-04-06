import { createContext, useContext, useState, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Avatar } from '../Avatar';
import styles from './SideBar.module.css';

const SidebarContext = createContext({ isCollapsed: false });

export interface SideBarItemProps extends HTMLAttributes<HTMLButtonElement> {
    icon: ElementType;
    label: string;
    active?: boolean;
}

export function SideBarItem({
    icon: Icon,
    label,
    active,
    className,
    ...props
}: SideBarItemProps) {
    const { isCollapsed } = useContext(SidebarContext);

    return (
        <button
            className={cn(
                styles.item,
                active && styles.itemActive,
                isCollapsed ? styles.itemCollapsed : styles.itemExpanded,
                className
            )}
            title={isCollapsed ? label : undefined}
            {...props}
        >
            <Icon size={isCollapsed ? 24 : 20} />
            <span className={cn(styles.itemLabel, isCollapsed && styles.labelHidden)}>
                {label}
            </span>
        </button>
    );
}

export interface SideBarProps extends HTMLAttributes<HTMLElement> {
    isCollapsed: boolean;
    onToggle?: () => void;
    isOpenMobile: boolean;
    onCloseMobile: () => void;
    logo?: ReactNode | ((isCollapsed: boolean) => ReactNode);
    children?: ReactNode;
    userName?: string;
    userRole?: string;
    userAvatarUrl?: string;
    onLogout?: () => void; // <-- 1. Nova Propriedade Adicionada
}

export function SideBar({
    isCollapsed,
    onToggle,
    isOpenMobile,
    onCloseMobile,
    logo,
    children,
    userName = "Usuário",
    userRole = "Colaborador",
    userAvatarUrl,
    onLogout, // <-- Recebendo a prop
    className,
    ...props
}: SideBarProps) {

    // <-- 2. Estado para controlar se o menu de utilizador está aberto
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <>
            {isOpenMobile && (
                <div className={styles.overlay} onClick={onCloseMobile} />
            )}

            <aside
                className={cn(
                    styles.sidebar,
                    isCollapsed ? styles.collapsed : styles.expanded,
                    isOpenMobile && styles.mobileOpen,
                    className
                )}
                {...props}
            >
                <div className={styles.header}>
                    <div className={styles.logoContainer}>
                        {typeof logo === 'function' ? logo(isCollapsed) : logo}
                    </div>

                    {onToggle && (
                        <button
                            className={styles.toggleButton}
                            onClick={onToggle}
                            aria-expanded={!isCollapsed}
                            aria-label="Alternar menu lateral"
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    )}
                </div>

                <SidebarContext.Provider value={{ isCollapsed }}>
                    <nav className={styles.nav}>
                        {children}
                    </nav>
                </SidebarContext.Provider>

                <div className={cn(styles.footer, isCollapsed && styles.footerCollapsed)} style={{ position: 'relative' }}>

                    {/* <-- 3. O Dropdown Menu que aparece ao clicar --> */}
                    {userMenuOpen && onLogout && !isCollapsed && (
                        <div style={{
                            position: 'absolute', bottom: 'calc(100% + 8px)', left: '16px', right: '16px',
                            background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px',
                            padding: '4px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 50
                        }}>
                            <button
                                onClick={onLogout}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 12px', background: 'transparent', border: 'none',
                                    color: '#EF4444', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                                    borderRadius: '6px', textAlign: 'left', transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <LogOut size={16} />
                                Sair do Sistema
                            </button>
                        </div>
                    )}

                    {/* Botão de Perfil Atualizado para abrir/fechar o menu */}
                    <button
                        className={cn(styles.userProfileButton, isCollapsed && styles.userButtonCollapsed)}
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                        <Avatar
                            src={userAvatarUrl}
                            initials={userName.substring(0, 2).toUpperCase()}
                            size={isCollapsed ? "sm" : "md"}
                        />

                        {!isCollapsed && (
                            <>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>
                                        {userName}
                                    </span>
                                    <span className={styles.userRole}>
                                        {userRole}
                                    </span>
                                </div>
                                <MoreVertical size={16} className={styles.userMenuIcon} />
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
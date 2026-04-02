import { createContext, useContext, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
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
    className,
    ...props
}: SideBarProps) {
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

                <div className={cn(styles.footer, isCollapsed && styles.footerCollapsed)}>
                    <button className={cn(styles.userProfileButton, isCollapsed && styles.userButtonCollapsed)}>
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
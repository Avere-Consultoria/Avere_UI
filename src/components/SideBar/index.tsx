import { createContext, useContext, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Avatar } from '../Avatar';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../Tooltip';
import styles from './SideBar.module.css';

const SidebarContext = createContext({ isCollapsed: false });

// "Luiz Henrique Ulmi" → "LU" · "Maria Julia" → "MJ" (primeiro + último nome)
function iniciais(nome: string): string {
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export interface SideBarItemProps extends HTMLAttributes<HTMLElement> {
    icon: ElementType;
    label: string;
    active?: boolean;
    /** Contagem/aviso à direita do rótulo (ficha sidebar: badge é elemento,
     *  não texto no label). No modo rail vira um dot sobre o ícone — a
     *  informação de "tem pendência" não some quando a barra colapsa. */
    badge?: ReactNode;
    /** Rota do item. Com href o item renderiza <a> (padrão APG para
     *  navegação): Ctrl/Cmd+clique e botão do meio abrem em nova aba.
     *  O app SPA intercepta o clique simples (preventDefault + navigate). */
    href?: string;
}

export function SideBarItem({
    icon: Icon,
    label,
    active,
    badge,
    href,
    className,
    ...props
}: SideBarItemProps) {
    const { isCollapsed } = useContext(SidebarContext);

    const Comp: any = href ? 'a' : 'button';
    const button = (
        <Comp
            href={href}
            className={cn(
                styles.item,
                active && styles.itemActive,
                isCollapsed ? styles.itemCollapsed : styles.itemExpanded,
                className
            )}
            aria-current={active ? 'page' : undefined}
            {...props}
        >
            <span className={styles.iconWrap}>
                <Icon size={20} />
                {isCollapsed && badge != null && badge !== 0 && <span className={styles.badgeDot} aria-hidden="true" />}
            </span>
            <span className={cn(styles.itemLabel, isCollapsed && styles.labelHidden)}>
                {label}
            </span>
            {!isCollapsed && badge != null && badge !== 0 && (
                <span className={styles.badge}>{badge}</span>
            )}
        </Comp>
    );

    // Rail: tooltip de verdade (DS) no lugar do title nativo.
    if (!isCollapsed) return button;
    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export interface SideBarSectionProps {
    label: string;
}

/** Rótulo de grupo (ficha sidebar: seções nomeadas, caixa alta, divisor).
 *  Colapsada, mostra só a linha divisória. */
export function SideBarSection({ label }: SideBarSectionProps) {
    const { isCollapsed } = useContext(SidebarContext);
    return (
        <div className={cn(styles.section, isCollapsed && styles.sectionCollapsed)}>
            {!isCollapsed && <span className={styles.sectionLabel}>{label}</span>}
            <span className={styles.sectionRule} />
        </div>
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
    onLogout?: () => void;
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
    onLogout,
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
                    <nav className={styles.nav} aria-label="Principal">
                        {children}
                    </nav>
                </SidebarContext.Provider>

                <div className={cn(styles.footer, isCollapsed && styles.footerCollapsed)}>
                    <div className={cn(styles.userRow, isCollapsed && styles.userRowCollapsed)}>
                        <Avatar
                            src={userAvatarUrl}
                            initials={iniciais(userName)}
                            size={isCollapsed ? "sm" : "md"}
                            className={styles.brandAvatar}
                        />

                        {!isCollapsed && (
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{userName}</span>
                                <span className={styles.userRole}>{userRole}</span>
                            </div>
                        )}

                        {onLogout && (
                            <TooltipProvider delayDuration={150}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className={styles.logoutButton}
                                            onClick={onLogout}
                                            aria-label="Sair do Sistema"
                                        >
                                            <LogOut size={16} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Sair do Sistema</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

import { type HTMLAttributes, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../utils/cn';
import styles from './TopBar.module.css';

export interface TopBarProps extends HTMLAttributes<HTMLElement> {
    onToggleMobile: () => void;
    children?: ReactNode;
}

export function TopBar({
    onToggleMobile,
    className,
    children,
    ...props
}: TopBarProps) {
    return (
        <header className={cn(styles.header, className)} {...props}>
            <div className={styles.buttonGroup}>
                {/* Hamburger para Mobile mantido */}
                <Button
                    variant="ghost"
                    intent="secundaria"
                    className={cn(styles.mobileOnly)}
                    onClick={onToggleMobile}
                    aria-label="Abrir menu"
                >
                    <Menu size={20} />
                </Button>
            </div>

            <div className={styles.contextArea}>
                {children}
            </div>
        </header>
    );
}
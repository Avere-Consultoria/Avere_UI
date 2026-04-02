import { forwardRef, type HTMLAttributes, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Avatar.module.css';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    initials?: string;
    size?: 'sm' | 'md' | 'lg';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, initials, size = 'md', ...props }, ref) => {
        const [hasError, setHasError] = useState(false);

        // Se não houver src ou a imagem der erro, mostra as iniciais
        const showInitials = !src || hasError;

        return (
            <div
                ref={ref}
                className={cn(styles.container, styles[size], className)}
                {...props}
            >
                {showInitials ? (
                    <span className={styles.initials}>{initials?.substring(0, 2)}</span>
                ) : (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        className={styles.image}
                        onError={() => setHasError(true)}
                    />
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export { Avatar };
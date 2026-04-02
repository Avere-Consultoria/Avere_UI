import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { type LucideIcon, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './Button.module.css';

const buttonVariants = cva(styles.buttonBase, {
    variants: {
        intent: {
            primaria: styles.primaria,
            secundaria: styles.secundaria,
            alerta: styles.alerta,
            erro: styles.erro,
        },
        variant: {
            solid: "",
            outline: styles.outline,
            ghost: styles.ghost,
        },
        size: {
            sm: styles.sm,
            md: styles.md,
            lg: styles.lg,
        },
    },
    defaultVariants: {
        intent: 'primaria',
        variant: 'solid',
        size: 'md',
    },
});

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, intent, variant, size, leftIcon: LeftIcon, rightIcon: RightIcon, children, disabled, isLoading, ...props }, ref) => {
        return (
            <button
                className={clsx(buttonVariants({ intent, variant, size }), className)}
                ref={ref}
                disabled={disabled || isLoading}
                aria-disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className={styles.animateSpin} aria-hidden="true" />}
                {!isLoading && LeftIcon && <LeftIcon aria-hidden="true" />}
                {children}
                {!isLoading && RightIcon && <RightIcon aria-hidden="true" />}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
import { forwardRef, type InputHTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import styles from './TextField.module.css';

const inputVariants = cva(styles.inputBase, {
    variants: {
        hasError: {
            true: styles.hasError,
            false: '',
        },
        hasIcon: {
            true: styles.withIcon,
            false: '',
        },
    },
    defaultVariants: {
        hasError: false,
        hasIcon: false,
    },
});

export interface TextFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    leftIcon?: LucideIcon;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ className, label, error, leftIcon: LeftIcon, id, ...props }, ref) => {
        const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
        const hasError = !!error;

        return (
            <div className={cn(styles.container, className)}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={styles.relativeWrapper}>
                    {LeftIcon && (
                        <LeftIcon
                            className={cn(
                                styles.icon,
                                hasError ? styles.iconError : styles.iconDefault
                            )}
                            aria-hidden="true"
                        />
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(inputVariants({ hasError, hasIcon: !!LeftIcon }))}
                        aria-invalid={hasError ? "true" : "false"}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />
                </div>
                {error && (
                    <span id={`${inputId}-error`} className={styles.errorMessage}>
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

TextField.displayName = 'TextField';

export { TextField, inputVariants };
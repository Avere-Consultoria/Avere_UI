import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, id, disabled, ...props }, ref) => {
        const checkboxId = id || (label ? `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

        return (
            <label
                htmlFor={checkboxId}
                className={cn(styles.container, disabled && styles.disabled)}
            >
                <div className={styles.iconWrapper}>
                    <input
                        type="checkbox"
                        id={checkboxId}
                        ref={ref}
                        disabled={disabled}
                        className={styles.hiddenInput}
                        {...props}
                    />

                    <div
                        className={cn(styles.visualBox, className)}
                        aria-hidden="true"
                    >
                        <Check size={12} strokeWidth={4} color="currentColor" />
                    </div>
                </div>

                {label && (
                    <span className={styles.label}>
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
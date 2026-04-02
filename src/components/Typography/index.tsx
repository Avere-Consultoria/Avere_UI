import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import styles from './Typography.module.css';

const typographyVariants = cva(styles.base, {
    variants: {
        variant: {
            h1: styles.h1,
            h2: styles.h2,
            h3: styles.h3,
            h4: styles.h4,
            p: styles.p,
        },
    },
    defaultVariants: {
        variant: 'p',
    },
});

export interface TypographyProps
    extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    as?: ElementType;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, as, ...props }, ref) => {
        // Mantém sua lógica fiel de inferência de tag
        const Component = as || (variant as ElementType) || 'p';

        return (
            <Component
                ref={ref as any}
                className={cn(typographyVariants({ variant, className }))}
                {...props}
            />
        );
    }
);

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
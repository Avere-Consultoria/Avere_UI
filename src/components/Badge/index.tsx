import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

const badgeVariants = cva(styles.base, {
    variants: {
        intent: {
            primaria: "",
            secundaria: "",
            alerta: "",
            erro: "",
            neutro: "",
        },
        variant: {
            solid: "",
            outline: "",
            ghost: "",
        },
    },
    compoundVariants: [
        // Mapeamento das combinações para as classes CSS
        { intent: 'primaria', variant: 'solid', className: styles.primaria_solid },
        { intent: 'primaria', variant: 'outline', className: styles.primaria_outline },
        { intent: 'primaria', variant: 'ghost', className: styles.primaria_ghost },

        { intent: 'secundaria', variant: 'solid', className: styles.secundaria_solid },
        { intent: 'secundaria', variant: 'outline', className: styles.secundaria_outline },
        { intent: 'secundaria', variant: 'ghost', className: styles.secundaria_ghost },

        { intent: 'alerta', variant: 'solid', className: styles.alerta_solid },
        { intent: 'alerta', variant: 'outline', className: styles.alerta_outline },
        { intent: 'alerta', variant: 'ghost', className: styles.alerta_ghost },

        { intent: 'erro', variant: 'solid', className: styles.erro_solid },
        { intent: 'erro', variant: 'outline', className: styles.erro_outline },
        { intent: 'erro', variant: 'ghost', className: styles.erro_ghost },

        { intent: 'neutro', variant: 'solid', className: styles.neutro_solid },
        { intent: 'neutro', variant: 'outline', className: styles.neutro_outline },
        { intent: 'neutro', variant: 'ghost', className: styles.neutro_ghost },
    ],
    defaultVariants: {
        intent: 'primaria',
        variant: 'solid',
    },
});

export interface BadgeProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, intent, variant, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(badgeVariants({ intent, variant }), className)}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
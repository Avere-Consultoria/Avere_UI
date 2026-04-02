import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "../../utils/cn"
import { Typography } from "../Typography"
import styles from "./Switch.module.css"

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    label?: string;
}

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    SwitchProps
>(({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    return (
        <div className={styles.container}>
            <SwitchPrimitives.Root
                id={switchId}
                className={cn(styles.root, className)}
                {...props}
                ref={ref}
            >
                <SwitchPrimitives.Thumb className={styles.thumb} />
            </SwitchPrimitives.Root>

            {label && (
                <label htmlFor={switchId} className={styles.label}>
                    <Typography
                        as="span"
                        variant="p"
                        className={cn(styles.labelText, props.disabled && styles.labelTextDisabled)}
                        style={{ color: 'var(--color-secundaria)' }}
                    >
                        {label}
                    </Typography>
                </label>
            )}
        </div>
    )
})

Switch.displayName = "Switch"

export { Switch }
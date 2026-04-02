import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "../../utils/cn"
import { Typography } from "../Typography"
import styles from "./RadioGroup.module.css"

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn(styles.root, className)}
            {...props}
            ref={ref}
        />
    )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export interface RadioItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
    label?: string;
}

const RadioItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    RadioItemProps
>(({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const itemId = id || generatedId;

    return (
        <div className={styles.itemWrapper}>
            <RadioGroupPrimitive.Item
                ref={ref}
                id={itemId}
                className={cn(styles.radioItem, className)}
                {...props}
            >
                <RadioGroupPrimitive.Indicator className={styles.indicator}>
                    <Circle className={styles.icon} />
                </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>

            {label && (
                <label htmlFor={itemId} className={styles.label}>
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
RadioItem.displayName = "RadioItem"

export { RadioGroup, RadioItem }
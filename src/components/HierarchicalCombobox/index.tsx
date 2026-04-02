import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronsUpDown, ChevronRight, type LucideIcon } from "lucide-react"
import { cn } from "../../utils/cn"
import { Typography } from "../Typography"
import styles from "./HierarchicalCombobox.module.css"

export interface SelectOption {
    value: string;
    label: string;
}

export interface ComboboxLevel {
    id: string;
    label?: string;
    placeholder?: string;
    icon?: LucideIcon;
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export interface HierarchicalComboboxProps {
    levels: ComboboxLevel[];
    className?: string;
}

export function HierarchicalCombobox({
    levels,
    className
}: HierarchicalComboboxProps) {
    return (
        <div className={cn(styles.container, className)}>
            {levels.map((level, index) => (
                <React.Fragment key={level.id}>
                    <div className={styles.levelWrapper}>
                        {level.label && (
                            <Typography
                                as="label"
                                variant="p"
                                className={styles.levelLabel}
                                style={{ color: 'color-mix(in srgb, var(--color-secundaria), transparent 30%)' }}
                            >
                                {level.label}
                            </Typography>
                        )}

                        <SelectPrimitive.Root
                            value={level.value}
                            defaultValue={level.defaultValue}
                            onValueChange={level.onChange}
                            disabled={level.disabled}
                        >
                            <SelectPrimitive.Trigger className={styles.trigger}>
                                <div className={styles.triggerContent}>
                                    {level.icon && <level.icon size={16} style={{ color: 'var(--color-secundaria)', opacity: 0.7 }} />}
                                    <SelectPrimitive.Value placeholder={level.placeholder || "Selecione..."} />
                                </div>
                                <SelectPrimitive.Icon asChild>
                                    <ChevronsUpDown size={16} className={styles.triggerIcon} />
                                </SelectPrimitive.Icon>
                            </SelectPrimitive.Trigger>

                            <SelectPrimitive.Portal>
                                <SelectPrimitive.Content className={styles.content} position="popper" sideOffset={4}>
                                    <SelectPrimitive.Viewport className={styles.viewport}>
                                        {level.options.map((option) => (
                                            <SelectPrimitive.Item key={option.value} value={option.value} className={styles.item}>
                                                <span className={styles.itemIndicator}>
                                                    <SelectPrimitive.ItemIndicator>
                                                        <Check size={16} />
                                                    </SelectPrimitive.ItemIndicator>
                                                </span>
                                                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                                            </SelectPrimitive.Item>
                                        ))}
                                    </SelectPrimitive.Viewport>
                                </SelectPrimitive.Content>
                            </SelectPrimitive.Portal>
                        </SelectPrimitive.Root>
                    </div>

                    {/* Separador entre os níveis */}
                    {index < levels.length - 1 && (
                        <div className={styles.separator}>
                            <ChevronRight size={16} style={{ color: 'var(--color-secundaria)', opacity: 0.4 }} strokeWidth={2.5} />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { DayPicker, type DateRange } from 'react-day-picker';
import { cn } from '../../utils/cn';
import { inputVariants } from '../TextField';
import { buttonVariants } from '../Button';

import popStyles from './Popover.module.css';
import calStyles from './Calendar.module.css';
import styles from './DatePicker.module.css';

// --- POPOVER ---
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(popStyles.content, className)}
            {...props}
        />
    </PopoverPrimitive.Portal>
));

// --- CALENDAR ---
type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            locale={ptBR}
            showOutsideDays={showOutsideDays}
            className={cn(className)}
            classNames={{
                months: calStyles.months,
                month: calStyles.month,
                caption: calStyles.caption,
                caption_label: calStyles.caption_label,
                nav: calStyles.nav,
                table: calStyles.table,
                head_cell: calStyles.head_cell,
                cell: calStyles.cell,
                day: calStyles.day,
                day_selected: calStyles.day_selected,
                day_today: calStyles.day_today,
                day_outside: calStyles.day_outside,
                day_range_middle: calStyles.day_range_middle,
                day_range_start: calStyles.day_range_start,
                day_range_end: calStyles.day_range_end,
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) => {
                    const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
                    return <Icon size={16} className={buttonVariants({ variant: 'ghost', size: 'sm' })} />;
                },
            }}
            {...props}
        />
    );
}

// --- DATE PICKER SINGLE ---
export interface DatePickerProps {
    date?: Date;
    onSelect?: (date: Date | undefined) => void;
    label?: string;
    error?: string;
    placeholder?: string;
    className?: string;
    id?: string;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    ({ date, onSelect, label, error, placeholder = 'Selecione uma data', className, id }, ref) => {
        const hasError = !!error;
        const [open, setOpen] = React.useState(false);
        const inputId = id || `datepicker-${label?.replace(/\s+/g, '-').toLowerCase()}`;

        return (
            <div className={cn(styles.wrapper, className)}>
                {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button
                            id={inputId}
                            ref={ref}
                            type="button"
                            className={cn(
                                inputVariants({ hasError, hasIcon: false }),
                                styles.triggerBtn,
                                !date && styles.triggerBtnEmpty
                            )}
                        >
                            <CalendarIcon className={styles.calendarIcon} size={16} />
                            {date ? format(date, "PPP", { locale: ptBR }) : <span>{placeholder}</span>}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className={styles.popoverContent}>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => { onSelect?.(d); setOpen(false); }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

DatePicker.displayName = "DatePicker";

export { Popover, PopoverTrigger, PopoverContent, Calendar };
export type { DateRange };
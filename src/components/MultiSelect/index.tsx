import React, { useState, useRef, useEffect, forwardRef, type KeyboardEvent } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Badge } from '../Badge';
import styles from './MultiSelect.module.css';

export interface Option {
    label: string;
    value: string;
}

export interface MultiSelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    options: Option[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (values: string[]) => void;
    label?: string;
    error?: string;
}

const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(
    ({ className, options, value, defaultValue, onChange, label, error, placeholder = 'Selecione...', id, ...props }, ref) => {
        const [internalValue, setInternalValue] = useState<string[]>(defaultValue || []);
        const [isOpen, setIsOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const containerRef = useRef<HTMLDivElement>(null);

        const selectedValues = value !== undefined ? value : internalValue;
        const hasError = !!error;
        const inputId = id || (label ? `multiselect-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

        const filteredOptions = options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const handleSelect = (optionValue: string) => {
            let newSelected: string[];
            if (selectedValues.includes(optionValue)) {
                newSelected = selectedValues.filter(v => v !== optionValue);
            } else {
                newSelected = [...selectedValues, optionValue];
            }

            if (value === undefined) setInternalValue(newSelected);
            onChange?.(newSelected);
            setSearchQuery('');
        };

        const handleRemove = (optionValue: string) => {
            const newSelected = selectedValues.filter(v => v !== optionValue);
            if (value === undefined) setInternalValue(newSelected);
            onChange?.(newSelected);
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Backspace' && searchQuery === '' && selectedValues.length > 0) {
                handleRemove(selectedValues[selectedValues.length - 1]);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));

        return (
            <div className={cn(styles.container, className)} ref={containerRef}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}

                <div
                    className={cn(
                        styles.trigger,
                        hasError && styles.triggerError,
                        isOpen && styles.triggerOpen
                    )}
                    onClick={() => setIsOpen(true)}
                >
                    {selectedOptions.map((opt) => (
                        <Badge
                            key={opt.value}
                            intent="primaria"
                            variant="ghost"
                        >
                            {opt.label}
                            <button
                                type="button"
                                className={styles.removeBadgeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(opt.value);
                                }}
                            >
                                <X size={12} />
                            </button>
                        </Badge>
                    ))}

                    <input
                        id={inputId}
                        ref={ref}
                        type="text"
                        className={styles.inputField}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedValues.length === 0 ? placeholder : ''}
                        autoComplete="off"
                        {...props}
                    />
                    <ChevronDown size={16} className={styles.chevron} />
                </div>

                {isOpen && (
                    <div className={styles.dropdown}>
                        {filteredOptions.length === 0 ? (
                            <div className={styles.noOptions}>Nenhuma opção encontrada</div>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        className={cn(styles.option, isSelected && styles.optionSelected)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelect(option.value);
                                            document.getElementById(inputId || '')?.focus();
                                        }}
                                    >
                                        {option.label}
                                        {isSelected && <Check size={16} className={styles.checkIcon} />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import styles from './Select.module.css';

export interface SelectItem {
    label: string;
    value: string;
}

export interface SelectProps {
    options: SelectItem[];
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    placeholder?: string;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    label,
    error,
    placeholder = "Selecione...",
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (opt: SelectItem) => {
        onChange?.(opt.value);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn(styles.container, className)} ref={containerRef}>
            {label && <label className={styles.label}>{label}</label>}

            <div
                className={cn(
                    styles.trigger,
                    isOpen && styles.triggerActive,
                    error && styles.triggerError
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={cn(!selectedOption && styles.placeholder)}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={18}
                    className={cn(styles.icon, isOpen && styles.iconOpen)}
                />
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={cn(
                                styles.option,
                                value === opt.value && styles.optionSelected
                            )}
                            onClick={() => handleSelect(opt)}
                        >
                            {opt.label}
                            {value === opt.value && <Check size={16} className={styles.checkIcon} />}
                        </div>
                    ))}
                </div>
            )}

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export { Select };
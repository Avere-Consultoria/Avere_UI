import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDom from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn'; //
import styles from './Select.module.css'; //

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
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (opt: SelectItem, e: React.MouseEvent) => {
        // 1. Previne comportamentos padrão que fecham modais
        e.preventDefault();
        e.stopPropagation();

        // 2. Dispara a mudança de valor IMEDIATAMENTE
        if (onChange) {
            onChange(opt.value);
        }

        // 3. Fecha o menu com um delay mínimo (0ms) para permitir 
        // que o React processe a atualização do estado no componente pai
        setTimeout(() => {
            setIsOpen(false);
        }, 0);
    };

    useLayoutEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Se o clique foi no trigger, o onClick do trigger já lida com isso
            if (triggerRef.current?.contains(e.target as Node)) return;

            // Verifica se o clique foi fora do dropdown (que agora está no body)
            const dropdownElement = document.getElementById('avere-select-portal');
            if (dropdownElement?.contains(e.target as Node)) return;

            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={cn(styles.container, className)} ref={containerRef}>
            {label && <label className={styles.label}>{label}</label>}

            <div
                ref={triggerRef}
                className={cn(
                    styles.trigger,
                    isOpen && styles.triggerActive,
                    error && styles.triggerError
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <span className={cn(!selectedOption && styles.placeholder)}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={18}
                    className={cn(styles.icon, isOpen && styles.iconOpen)}
                />
            </div>

            {isOpen && ReactDom.createPortal(
                <div
                    id="avere-select-portal"
                    className={styles.dropdown}
                    style={{
                        position: 'absolute',
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                        zIndex: 99999, // Garantir que está acima de Modais e Drawers
                        fontFamily: 'Montserrat, sans-serif'
                    }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={cn(
                                styles.option,
                                value === opt.value && styles.optionSelected
                            )}
                            onMouseDown={(e) => handleSelect(opt, e as any)} // Usamos onMouseDown para disparar antes do fechar automático
                        >
                            <span style={{ pointerEvents: 'none' }}>{opt.label}</span>
                            {value === opt.value && <Check size={16} className={styles.checkIcon} />}
                        </div>
                    ))}
                </div>,
                document.body
            )}

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export { Select };
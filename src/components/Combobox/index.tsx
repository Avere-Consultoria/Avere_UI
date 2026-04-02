import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import styles from './Combobox.module.css';

export interface ComboboxOption {
    label: string;
    value: string;
}

export interface ComboboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    options: ComboboxOption[];
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
}

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
    ({ className, options, value, onChange, label, error, placeholder = "Selecione...", ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const containerRef = useRef<HTMLDivElement>(null);

        // Encontra o label da opção selecionada para mostrar no input
        const selectedOption = options.find(opt => opt.value === value);

        // Filtra as opções baseado na busca
        const filteredOptions = options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const handleSelect = (opt: ComboboxOption) => {
            onChange?.(opt.value);
            setSearchTerm(opt.label);
            setIsOpen(false);
        };

        // Sincroniza o searchTerm com o valor selecionado externamente
        useEffect(() => {
            if (selectedOption) setSearchTerm(selectedOption.label);
        }, [selectedOption]);

        // Fecha ao clicar fora
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                    // Se fechar sem selecionar, volta para o label do valor atual
                    setSearchTerm(selectedOption?.label || '');
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [selectedOption]);

        return (
            <div className={cn(styles.container, className)} ref={containerRef}>
                {label && <label className={styles.label}>{label}</label>}

                <div className={styles.triggerWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        ref={ref}
                        type="text"
                        className={cn(styles.inputField, error && styles.inputError)}
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        {...props}
                    />
                    <ChevronDown
                        size={18}
                        className={cn(styles.icon, isOpen && styles.iconOpen)}
                    />
                </div>

                {isOpen && (
                    <div className={styles.dropdown}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
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
                            ))
                        ) : (
                            <div className={styles.noResults}>Nenhum resultado encontrado.</div>
                        )}
                    </div>
                )}

                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

Combobox.displayName = 'Combobox';

export { Combobox };
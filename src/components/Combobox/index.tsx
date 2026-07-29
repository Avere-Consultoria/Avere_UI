import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
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

// Limite de itens renderizados por vez (perf com listas grandes; a busca filtra tudo).
const MAX_RENDER = 100;
const DROP_H = 240;

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
    ({ className, options, value, onChange, label, error, placeholder = "Selecione...", ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
        const containerRef = useRef<HTMLDivElement>(null);
        const triggerRef = useRef<HTMLDivElement>(null);
        const dropdownRef = useRef<HTMLDivElement>(null);

        const selectedOption = options.find(opt => opt.value === value);

        // Filtra tudo, mas só renderiza os primeiros MAX_RENDER (evita travar com 2000+).
        const filtered = options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const visible = filtered.slice(0, MAX_RENDER);

        // Posiciona o dropdown pelo viewport (position: fixed) → escapa do overflow:hidden
        // de modais. Abre pra cima se não couber embaixo.
        const updateCoords = useCallback(() => {
            const el = triggerRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const roomBelow = window.innerHeight - r.bottom;
            const openUp = roomBelow < DROP_H + 8 && r.top > roomBelow;
            setCoords({ top: openUp ? r.top - 4 : r.bottom + 4, left: r.left, width: r.width, openUp });
        }, []);

        useEffect(() => {
            if (!isOpen) return;
            updateCoords();
            const onMove = () => updateCoords();
            window.addEventListener('scroll', onMove, true);
            window.addEventListener('resize', onMove);
            return () => {
                window.removeEventListener('scroll', onMove, true);
                window.removeEventListener('resize', onMove);
            };
        }, [isOpen, updateCoords]);

        const handleSelect = (opt: ComboboxOption) => {
            onChange?.(opt.value);
            setSearchTerm(opt.label);
            setIsOpen(false);
        };

        useEffect(() => {
            if (!isOpen) setSearchTerm(selectedOption?.label || '');
        }, [selectedOption, isOpen]);

        // Fecha ao clicar fora (o dropdown está num portal → checa os dois refs).
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                const t = e.target as Node;
                if (containerRef.current?.contains(t)) return;
                if (dropdownRef.current?.contains(t)) return;
                setIsOpen(false);
                setSearchTerm(selectedOption?.label || '');
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [selectedOption]);

        return (
            <div className={cn(styles.container, className)} ref={containerRef}>
                {label && <label className={styles.label}>{label}</label>}

                <div className={styles.triggerWrapper} ref={triggerRef}>
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
                        onFocus={() => {
                            setSearchTerm('');
                            setIsOpen(true);
                        }}
                        {...props}
                    />
                    <ChevronDown size={18} className={cn(styles.icon, isOpen && styles.iconOpen)} />
                </div>

                {isOpen && createPortal(
                    <div
                        ref={dropdownRef}
                        className={styles.dropdown}
                        style={{
                            position: 'fixed',
                            top: coords.openUp ? undefined : coords.top,
                            bottom: coords.openUp ? (window.innerHeight - coords.top) : undefined,
                            left: coords.left,
                            width: coords.width,
                            maxHeight: DROP_H,
                            overflowY: 'auto',
                            zIndex: 9999,
                        }}
                    >
                        {visible.length > 0 ? (
                            <>
                                {visible.map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={cn(styles.option, value === opt.value && styles.optionSelected)}
                                        onClick={() => handleSelect(opt)}
                                    >
                                        {opt.label}
                                        {value === opt.value && <Check size={16} className={styles.checkIcon} />}
                                    </div>
                                ))}
                                {filtered.length > MAX_RENDER && (
                                    <div className={styles.noResults}>
                                        Refine a busca — {filtered.length - MAX_RENDER} itens ocultos
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.noResults}>Nenhum resultado encontrado.</div>
                        )}
                    </div>,
                    document.body
                )}

                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

Combobox.displayName = 'Combobox';

export { Combobox };

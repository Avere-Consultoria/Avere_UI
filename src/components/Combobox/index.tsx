import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import styles from './Combobox.module.css';

export interface ComboboxOption {
    label: string;
    value: string;
}

export interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

// Acima disto a lista só renderiza os primeiros itens (perf com 2000+); a busca filtra tudo.
const MAX_RENDER = 100;

function Combobox({
    options,
    value,
    onChange,
    label,
    error,
    placeholder = 'Selecione...',
    className,
    disabled,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [q, setQ] = React.useState('');

    const selecionado = options.find(o => o.value === value);
    const busca = q.trim().toLowerCase();
    const filtradas = busca ? options.filter(o => o.label.toLowerCase().includes(busca)) : options;
    const visiveis = filtradas.slice(0, MAX_RENDER);

    const escolher = (val: string) => {
        onChange?.(val);
        setOpen(false);
        setQ('');
    };

    return (
        <div className={cn(styles.container, className)}>
            {label && <label className={styles.label}>{label}</label>}

            <PopoverPrimitive.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(''); }}>
                <PopoverPrimitive.Trigger asChild disabled={disabled}>
                    <button type="button" className={cn(styles.cbTrigger, error && styles.inputError)}>
                        <span className={styles.cbTriggerText} data-placeholder={selecionado ? undefined : ''}>
                            {selecionado ? selecionado.label : placeholder}
                        </span>
                        <ChevronsUpDown size={16} className={styles.cbTriggerIcon} />
                    </button>
                </PopoverPrimitive.Trigger>

                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        className={styles.cbContent}
                        align="start"
                        sideOffset={4}
                        style={{ zIndex: 9999, width: 'var(--radix-popover-trigger-width)' }}
                    >
                        <div className={styles.searchBox}>
                            <div className={styles.searchInputWrap}>
                                <Search size={14} className={styles.searchIcon} />
                                <input
                                    autoFocus
                                    className={styles.searchInput}
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Buscar…"
                                />
                            </div>
                        </div>
                        <div className={styles.searchList}>
                            {visiveis.length > 0 ? (
                                <>
                                    {visiveis.map(o => (
                                        <button
                                            key={o.value}
                                            type="button"
                                            className={cn(styles.searchItem, o.value === value && styles.searchItemActive)}
                                            onClick={() => escolher(o.value)}
                                        >
                                            <span className={styles.searchCheck}>{o.value === value && <Check size={15} />}</span>
                                            <span className={styles.searchItemLabel}>{o.label}</span>
                                        </button>
                                    ))}
                                    {filtradas.length > MAX_RENDER && (
                                        <div className={styles.searchEmpty}>Refine a busca — {filtradas.length - MAX_RENDER} itens ocultos</div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.searchEmpty}>Nenhum resultado.</div>
                            )}
                        </div>
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>

            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}

Combobox.displayName = 'Combobox';

export { Combobox };

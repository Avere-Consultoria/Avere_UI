import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Check, ChevronsUpDown, ChevronRight, Search, type LucideIcon } from "lucide-react"
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

// Acima deste número de opções, o nível vira um combobox com BUSCA (Popover
// portaled — não é cortado por overflow da barra do topo).
const LIMITE_BUSCA = 8;

function NivelPesquisavel({ level }: { level: ComboboxLevel }) {
    const [open, setOpen] = React.useState(false);
    const [q, setQ] = React.useState("");
    // Suporta nível controlado (level.value) e não-controlado (defaultValue + estado interno).
    const [interno, setInterno] = React.useState(level.value ?? level.defaultValue ?? "");
    React.useEffect(() => { if (level.value !== undefined) setInterno(level.value); }, [level.value]);
    const atual = level.value !== undefined ? level.value : interno;

    const selecionado = level.options.find(o => o.value === atual);
    const busca = q.trim().toLowerCase();
    const filtradas = busca ? level.options.filter(o => o.label.toLowerCase().includes(busca)) : level.options;

    const escolher = (val: string) => {
        setInterno(val);
        level.onChange?.(val);
        setOpen(false);
        setQ("");
    };

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(""); }}>
            <PopoverPrimitive.Trigger asChild disabled={level.disabled}>
                <button type="button" className={styles.trigger}>
                    <div className={styles.triggerContent}>
                        {level.icon && <level.icon size={16} style={{ color: 'var(--color-secundaria)', opacity: 0.7 }} />}
                        <span style={{ fontSize: 14, fontWeight: 500, color: selecionado ? '#374151' : '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                            {selecionado ? selecionado.label : (level.placeholder || "Selecione...")}
                        </span>
                    </div>
                    <ChevronsUpDown size={16} className={styles.triggerIcon} />
                </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content className={styles.content} align="start" sideOffset={4} style={{ width: 300, padding: 0 }}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchInputWrap}>
                            <Search size={14} style={{ position: 'absolute', left: 9, color: '#9CA3AF' }} />
                            <input autoFocus className={styles.searchInput} value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…" />
                        </div>
                    </div>
                    <div className={styles.searchList}>
                        {filtradas.length > 0 ? filtradas.map(o => (
                            <button key={o.value} type="button"
                                className={cn(styles.searchItem, o.value === atual && styles.searchItemActive)}
                                onClick={() => escolher(o.value)}>
                                <span style={{ width: 16, display: 'flex', flexShrink: 0 }}>{o.value === atual && <Check size={15} />}</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                            </button>
                        )) : <div className={styles.searchEmpty}>Nenhum resultado.</div>}
                    </div>
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
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
            {levels.map((level, index) => {
                // <-- A MÁGICA COMEÇA AQUI: Quantas opções temos? -->
                const isSingleOption = level.options.length === 1;

                return (
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

                            {/* Se houver apenas 1 opção, mostramos um Badge Estático */}
                            {isSingleOption ? (
                                <div className={styles.trigger} style={{
                                    background: 'transparent',
                                    border: 'none',
                                    boxShadow: 'none',
                                    paddingLeft: 0,
                                    cursor: 'default',
                                    paddingRight: '12px' // Espaço extra antes do separador
                                }}>
                                    <div className={styles.triggerContent}>
                                        {level.icon && <level.icon size={16} style={{ color: 'var(--color-secundaria)', opacity: 0.7 }} />}
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                                            {level.options[0].label}
                                        </span>
                                    </div>
                                    {/* Não tem o ChevronsUpDown porque não é clicável! */}
                                </div>
                            ) : level.options.length > LIMITE_BUSCA ? (
                                /* Muitas opções: combobox com BUSCA (Popover portaled) */
                                <NivelPesquisavel level={level} />
                            ) : (
                                /* Poucas opções: Select compacto do Radix */
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
                            )}
                        </div>

                        {/* Separador entre os níveis */}
                        {index < levels.length - 1 && (
                            <div className={styles.separator}>
                                <ChevronRight size={16} style={{ color: 'var(--color-secundaria)', opacity: 0.4 }} strokeWidth={2.5} />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    )
}
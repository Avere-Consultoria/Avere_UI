import React, { useState, useMemo } from 'react';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../DropdownMenu';
import styles from './DataTable.module.css';

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

export interface RowAction<T> {
    label: string;
    onClick: (item: T) => void;
    isDestructive?: boolean;
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    keyExtractor: (item: T) => string;
    actions?: RowAction<T>[];
    onSelectionChange?: (selectedKeys: string[]) => void;
    className?: string;
    selectable?: boolean;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    actions,
    onSelectionChange,
    className,
    selectable = true,
}: DataTableProps<T>) {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

    const isAllSelected = data.length > 0 && selectedKeys.size === data.length;

    const handleSelectAll = (checked: boolean) => {
        const allKeys = checked ? new Set(data.map(keyExtractor)) : new Set<string>();
        setSelectedKeys(allKeys);
        onSelectionChange?.(Array.from(allKeys));
    };

    const handleSelectRow = (key: string, checked: boolean) => {
        const newSelected = new Set(selectedKeys);
        checked ? newSelected.add(key) : newSelected.delete(key);
        setSelectedKeys(newSelected);
        onSelectionChange?.(Array.from(newSelected));
    };

    const handleSort = (key: keyof T) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const processedData = useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.scrollContainer}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            {selectable && (
                                <th className={styles.checkboxCell}>
                                    <Checkbox
                                        checked={isAllSelected}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                            )}
                            {columns.map((col, i) => (
                                <th key={i} className={styles.th}>
                                    <div className={styles.thContent}>
                                        {col.header}
                                        {col.sortable && col.accessorKey && (
                                            <button
                                                className={styles.sortButton}
                                                onClick={() => handleSort(col.accessorKey!)}
                                            >
                                                <ArrowUpDown size={14} className={sortConfig?.key === col.accessorKey ? styles.sortIconActive : styles.sortIconInactive} />
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className={styles.actionsCell} />}
                        </tr>
                    </thead>
                    <tbody>
                        {processedData.length === 0 ? (
                            <tr>
                                <td colSpan={100} className={styles.emptyState}>Nenhum dado encontrado.</td>
                            </tr>
                        ) : (
                            processedData.map((item) => {
                                const key = keyExtractor(item);
                                const isSelected = selectedKeys.has(key);
                                return (
                                    <tr key={key} className={cn(styles.tr, isSelected && styles.trSelected)}>
                                        {selectable && (
                                            <td className={styles.checkboxCell}>
                                                <Checkbox
                                                    checked={isSelected}
                                                    onChange={(e) => handleSelectRow(key, e.target.checked)}
                                                />
                                            </td>
                                        )}
                                        {columns.map((col, i) => (
                                            <td key={i} className={styles.td}>
                                                {col.cell ? col.cell(item) : String(item[col.accessorKey!] || '')}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className={styles.actionsCell}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {actions.map((action, ai) => (
                                                            <DropdownMenuItem
                                                                key={ai}
                                                                onClick={() => action.onClick(item)}
                                                                className={cn(action.isDestructive && styles.destructiveItem)}
                                                            >
                                                                {action.label}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
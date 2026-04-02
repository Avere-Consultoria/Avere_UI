import React, { useState, type KeyboardEvent, forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Badge } from '../Badge';
import styles from './TagInput.module.css';

export interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value?: string[];
    defaultValue?: string[];
    onChange?: (tags: string[]) => void;
    label?: string;
    error?: string;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
    ({ className, value, defaultValue, onChange, label, error, id, placeholder = 'Aperte Enter para adicionar...', ...props }, ref) => {
        const [internalTags, setInternalTags] = useState<string[]>(defaultValue || []);
        const [inputValue, setInputValue] = useState('');

        const tags = value !== undefined ? value : internalTags;
        const hasError = !!error;
        const inputId = id || (label ? `taginput-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

        const handleAddTag = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const trimmedVal = inputValue.trim();
                if (trimmedVal && !tags.includes(trimmedVal)) {
                    const newTags = [...tags, trimmedVal];
                    if (value === undefined) setInternalTags(newTags);
                    onChange?.(newTags);
                    setInputValue('');
                }
            }
        };

        const handleRemoveTag = (tagToRemove: string) => {
            const newTags = tags.filter((tag) => tag !== tagToRemove);
            if (value === undefined) setInternalTags(newTags);
            onChange?.(newTags);
        };

        return (
            <div className={cn(styles.container, className)}>
                {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}

                <div
                    className={cn(styles.trigger, hasError && styles.triggerError)}
                    onClick={() => document.getElementById(inputId || '')?.focus()}
                >
                    {tags.map((tag) => (
                        <Badge key={tag} intent="primaria" variant="solid">
                            {tag}
                            <button
                                type="button"
                                className={styles.removeTagBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTag(tag);
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
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder={tags.length === 0 ? placeholder : ''}
                        {...props}
                    />
                </div>
                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

TagInput.displayName = 'TagInput';

export { TagInput };
import React, { useState, useRef, type DragEvent, forwardRef } from 'react';
import { UploadCloud, CheckCircle2, File as FileIcon, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Spinner } from '../Spinner';
import { Typography } from '../Typography';
import styles from './FileUpload.module.css';

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
    onFileSelect?: (file: File | null) => void;
    accept?: string;
    maxSize?: number;
    label?: string;
    error?: string;
}

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

const formatBytes = (bytes: number) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
    ({ className, onFileSelect, accept, maxSize = 5 * 1024 * 1024, label, error: externalError, id, ...props }, ref) => {
        const [state, setState] = useState<UploadState>('idle');
        const [file, setFile] = useState<File | null>(null);
        const [internalError, setInternalError] = useState<string>('');
        const inputRef = useRef<HTMLInputElement>(null);

        const hasError = !!externalError || !!internalError;
        const errorMessage = externalError || internalError;
        const inputId = id || (label ? `fileupload-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

        const validateAndProcessFile = (selectedFile: File) => {
            if (maxSize && selectedFile.size > maxSize) {
                setState('error');
                setInternalError(`O arquivo excede o limite de ${formatBytes(maxSize)}`);
                return;
            }
            setInternalError('');
            setFile(selectedFile);
            setState('uploading');

            setTimeout(() => {
                setState('success');
                onFileSelect?.(selectedFile);
            }, 1500);
        };

        const handleDrop = (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setState('idle');
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) validateAndProcessFile(droppedFile);
        };

        const handleClear = () => {
            setFile(null);
            setState('idle');
            setInternalError('');
            onFileSelect?.(null);
            if (inputRef.current) inputRef.current.value = '';
        };

        return (
            <div className={cn(styles.container, className)}>
                {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}

                <div
                    ref={ref}
                    className={cn(
                        styles.dropzone,
                        styles[state],
                        hasError && state === 'idle' && styles.error
                    )}
                    onDragOver={(e) => { e.preventDefault(); setState('dragging'); }}
                    onDragLeave={() => setState('idle')}
                    onDrop={handleDrop}
                    onClick={() => (state === 'idle' || state === 'error') && inputRef.current?.click()}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
                    {...props}
                >
                    <input
                        id={inputId}
                        type="file"
                        className={styles.hiddenInput}
                        accept={accept}
                        onChange={(e) => e.target.files?.[0] && validateAndProcessFile(e.target.files[0])}
                        ref={inputRef}
                        disabled={state === 'uploading' || state === 'success'}
                    />

                    {(state === 'idle' || state === 'dragging' || state === 'error') && (
                        <div className={styles.idleContent}>
                            <UploadCloud size={40} className={cn(styles.uploadIcon, hasError && styles.uploadIconError)} />
                            <Typography variant="p" className={styles.uploadText}>
                                <span className={styles.uploadClickText}>Clique para enviar</span> ou arraste
                            </Typography>
                            <Typography variant="p" className={styles.uploadHint}>
                                Até {formatBytes(maxSize)}
                            </Typography>
                        </div>
                    )}

                    {state === 'uploading' && (
                        <div className={styles.uploadingContent}>
                            <Spinner size="lg" className={styles.spinner} />
                            <Typography variant="p" className={styles.uploadingText}>Enviando...</Typography>
                        </div>
                    )}

                    {state === 'success' && file && (
                        <div className={styles.successContent}>
                            <CheckCircle2 size={32} className={styles.successIcon} />
                            <div className={styles.fileCard}>
                                <FileIcon size={20} className={styles.fileIcon} />
                                <div className={styles.fileInfo}>
                                    <div className={styles.fileName}>{file.name}</div>
                                    <div className={styles.fileSize}>{formatBytes(file.size)}</div>
                                </div>
                                <button type="button" onClick={(e) => { e.stopPropagation(); handleClear(); }} className={styles.fileClearBtn}>
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
            </div>
        );
    }
);
FileUpload.displayName = "FileUpload";

export { FileUpload };
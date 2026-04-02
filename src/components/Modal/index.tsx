import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"
import styles from "./Modal.module.css"

const Modal = DialogPrimitive.Root
const ModalTrigger = DialogPrimitive.Trigger
const ModalPortal = DialogPrimitive.Portal
const ModalClose = DialogPrimitive.Close

const ModalOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(styles.overlay, className)}
        {...props}
    />
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const ModalContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <ModalPortal>
        <ModalOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(styles.content, className)}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className={styles.closeButton}>
                <X size={16} />
                <span className={styles.srOnly}>Fechar janela</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </ModalPortal>
))
ModalContent.displayName = DialogPrimitive.Content.displayName

const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(styles.header, className)} {...props} />
)
ModalHeader.displayName = "ModalHeader"

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(styles.footer, className)} {...props} />
)
ModalFooter.displayName = "ModalFooter"

const ModalTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn(styles.title, className)} {...props} />
))
ModalTitle.displayName = DialogPrimitive.Title.displayName

const ModalDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn(styles.description, className)} {...props} />
))
ModalDescription.displayName = DialogPrimitive.Description.displayName

export {
    Modal,
    ModalPortal,
    ModalOverlay,
    ModalTrigger,
    ModalClose,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
}
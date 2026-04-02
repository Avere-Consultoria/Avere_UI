import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"
import styles from "./Drawer.module.css"

// ─────────────────────────────────────────────────────────────────────────────
// Drawer — painel lateral deslizante (direita por padrão)
// Mesma base do Modal (Radix Dialog), mas com estilo de sidebar
//
// Uso:
//   <Drawer open={open} onOpenChange={setOpen}>
//     <DrawerContent>
//       <DrawerHeader>
//         <DrawerTitle>Título</DrawerTitle>
//         <DrawerDescription>Subtítulo</DrawerDescription>
//       </DrawerHeader>
//       <DrawerBody>
//         ... conteúdo com scroll ...
//       </DrawerBody>
//       <DrawerFooter>
//         <Button onClick={() => setOpen(false)}>Fechar</Button>
//       </DrawerFooter>
//     </DrawerContent>
//   </Drawer>
// ─────────────────────────────────────────────────────────────────────────────

const Drawer = DialogPrimitive.Root
const DrawerTrigger = DialogPrimitive.Trigger
const DrawerPortal = DialogPrimitive.Portal
const DrawerClose = DialogPrimitive.Close

// ── Overlay ───────────────────────────────────────────────────────────────────
const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(styles.overlay, className)}
        {...props}
    />
))
DrawerOverlay.displayName = "DrawerOverlay"

// ── Content (o painel lateral em si) ─────────────────────────────────────────
const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        side?: "right" | "left"
    }
>(({ className, children, side = "right", ...props }, ref) => (
    <DrawerPortal>
        <DrawerOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                styles.content,
                side === "left" ? styles.left : styles.right,
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className={styles.closeButton}>
                <X size={18} />
                <span className={styles.srOnly}>Fechar</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

// ── Header ────────────────────────────────────────────────────────────────────
const DrawerHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(styles.header, className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

// ── Body (área com scroll) ────────────────────────────────────────────────────
const DrawerBody = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(styles.body, className)} {...props} />
)
DrawerBody.displayName = "DrawerBody"

// ── Footer ────────────────────────────────────────────────────────────────────
const DrawerFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(styles.footer, className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

// ── Title ─────────────────────────────────────────────────────────────────────
const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(styles.title, className)}
        {...props}
    />
))
DrawerTitle.displayName = "DrawerTitle"

// ── Description ───────────────────────────────────────────────────────────────
const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn(styles.description, className)}
        {...props}
    />
))
DrawerDescription.displayName = "DrawerDescription"

// ── Separator visual interno ──────────────────────────────────────────────────
const DrawerSeparator = ({ className }: { className?: string }) => (
    <div className={cn(styles.separator, className)} />
)
DrawerSeparator.displayName = "DrawerSeparator"

export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
    DrawerSeparator,
}
import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-2xl border border-subtle bg-card text-main shadow-sm transition-colors", className)} {...props} />
))
Card.displayName = "Card"

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5 md:p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-bold text-base md:text-lg leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 md:p-6 pt-0 md:pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'neon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[var(--color-charcoal-900)] text-white hover:bg-[var(--color-charcoal-800)] dark:bg-[var(--color-charcoal-100)] dark:text-[var(--color-charcoal-900)] dark:hover:bg-white",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-subtle bg-transparent hover:bg-card-hover",
      secondary: "bg-[var(--color-charcoal-200)] text-[var(--color-charcoal-900)] hover:bg-[var(--color-charcoal-300)] dark:bg-[var(--color-charcoal-800)] dark:text-[var(--color-charcoal-100)] dark:hover:bg-[var(--color-charcoal-700)]",
      ghost: "hover:bg-[var(--color-charcoal-100)] dark:hover:bg-[var(--color-charcoal-800)]",
      link: "text-[var(--color-charcoal-900)] underline-offset-4 hover:underline dark:text-white",
      neon: "bg-[var(--primary-green)] text-[var(--color-charcoal-950)] hover:bg-[var(--primary-green-hover)] font-bold shadow-lg shadow-[var(--primary-green)]/20 border-none"
    }
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-xl px-8",
      icon: "h-10 w-10",
    }
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-subtle bg-input px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-bold placeholder:text-[var(--color-charcoal-400)] focus-visible:outline-none focus-visible:border-[var(--primary-green)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export const Badge = ({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'success' | 'destructive' | 'warning' }) => {
    const variants = {
        default: "bg-[var(--color-charcoal-200)] text-[var(--color-charcoal-800)] dark:bg-[var(--color-charcoal-800)] dark:text-white",
        success: "bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20",
        destructive: "bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20",
        warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20",
    }
    return (
        <div className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold max-w-fit transition-colors uppercase tracking-wider", variants[variant], className)} {...props} />
    )
}

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-xs font-bold text-muted uppercase tracking-wider leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
))
Label.displayName = "Label"

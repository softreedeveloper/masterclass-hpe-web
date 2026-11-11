import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface Base {
   label: string;
   error?: string | null;
   hint?: ReactNode;
}

export function Input({ label, error, hint, className, ...props }: Base & InputHTMLAttributes<HTMLInputElement>) {
   const id = useId();
   return (
      <div className={`field ${className ?? ""}`}>
         <label htmlFor={id} className="field-label">
            {label}
         </label>
         <input
            id={id}
            className="field-input"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-e` : undefined}
            {...props}
         />
         {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
         {error && (
            <p id={`${id}-e`} className="field-error">
               <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
               {error}
            </p>
         )}
      </div>
   );
}

export function Select({
   label,
   error,
   className,
   children,
   ...props
}: Base & SelectHTMLAttributes<HTMLSelectElement>) {
   const id = useId();
   return (
      <div className={`field ${className ?? ""}`}>
         <label htmlFor={id} className="field-label">
            {label}
         </label>
         <select
            id={id}
            className="field-input"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-e` : undefined}
            {...props}
         >
            {children}
         </select>
         {error && (
            <p id={`${id}-e`} className="field-error">
               <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
               {error}
            </p>
         )}
      </div>
   );
}

export function Textarea({ label, error, className, ...props }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
   const id = useId();
   return (
      <div className={`field ${className ?? ""}`}>
         <label htmlFor={id} className="field-label">
            {label}
         </label>
         <textarea id={id} className="field-input" aria-invalid={error ? true : undefined} {...props} />
         {error && (
            <p className="field-error">
               <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M8 4.8v3.6M8 11h.01" /></svg>
               {error}
            </p>
         )}
      </div>
   );
}

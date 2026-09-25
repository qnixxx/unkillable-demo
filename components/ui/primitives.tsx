import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function Eyebrow({ children, className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`eyebrow ${className}`} {...props}>{children}</p>;
}

export function Progress({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return <div className="progress-wrap" aria-label={label ?? `${safe}% complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe}>
    <span className="progress-track"><span className="progress-fill" style={{ width: `${safe}%` }} /></span>
  </div>;
}

export function Button({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button ${className}`} {...props}>{children}</button>;
}

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...props}>{children}</div>;
}

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CalloutProps {
  type: 'success' | 'error' | 'warning' | 'info';
  icon?: LucideIcon;
  title?: string;
  children: ReactNode;
}

export default function Callout({ type, icon: Icon, title, children }: CalloutProps) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-success',
      text: 'text-success',
      iconBg: 'bg-success/10',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      iconBg: 'bg-red-100',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100',
    },
    info: {
      bg: 'bg-primary/5',
      border: 'border-primary',
      text: 'text-primary',
      iconBg: 'bg-primary/10',
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border-2 ${style.border} rounded-xl p-6 my-6`}>
      {(Icon || title) && (
        <div className="flex items-start gap-3 mb-3">
          {Icon && (
            <div className={`${style.iconBg} p-2 rounded-lg`}>
              <Icon className={`w-5 h-5 ${style.text}`} />
            </div>
          )}
          {title && (
            <h4 className={`text-lg font-bold ${style.text} flex-1`}>{title}</h4>
          )}
        </div>
      )}
      <div className="text-secondary leading-relaxed">{children}</div>
    </div>
  );
}

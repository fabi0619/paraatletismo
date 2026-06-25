import type React from "react";

interface FormStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function FormStep({ title, description, children }: FormStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="border-b border-slate-100 pb-2 text-xs font-black tracking-widest text-slate-400 uppercase">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export { FormStep };

/* Shared auth form blocks */

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  headerRight?: React.ReactNode;
}

export function FormField({ id, label, type, value, onChange, placeholder, required, headerRight }: FormFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        {headerRight}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800/50 border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="my-7 flex items-center gap-4">
      <div className="flex-1 h-px bg-white/[0.04]" />
      <span className="text-[11px] text-slate-600 uppercase tracking-wider">or</span>
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4 py-3 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

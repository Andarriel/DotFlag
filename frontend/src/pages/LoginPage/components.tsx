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
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        {headerRight}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="flex-1 h-px bg-slate-800" />
      <span className="text-xs text-slate-600 uppercase tracking-wider">or</span>
      <div className="flex-1 h-px bg-slate-800" />
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
    >
      {children}
    </button>
  );
}

import { useState, useEffect } from "react";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  password?: string;
};

type Props = {
  user: UserType | null;
  onClose: () => void;
  onSave: (user: UserType) => Promise<void>;
};

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState<UserType>(
    user || {
      _id: "",
      name: "",
      email: "",
      role: "customer",
      isActive: true,
      password: "",
    },
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  // VALIDATION
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required!";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format!";
    }

    if (!form._id && !form.password?.trim()) {
      newErrors.password = "Password is required!";
    } else if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {form._id ? "Edit Member" : "Add New Member"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white transition-all outline-none focus:ring-2
                ${errors.name ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-700 focus:ring-slate-900 dark:focus:ring-white"}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white transition-all outline-none focus:ring-2
                ${errors.email ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-700 focus:ring-slate-900 dark:focus:ring-white"}`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {form._id ? "Update Password" : "Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full pl-4 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white transition-all outline-none focus:ring-2
                  ${errors.password ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-700 focus:ring-slate-900 dark:focus:ring-white"}`}
                value={form.password ?? ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={form._id ? "••••••••" : "Create a password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">
                {errors.password}
              </p>
            )}
            {form._id && !errors.password && (
              <p className="text-[10px] text-slate-400 mt-1 ml-1">
                Leave empty to keep current password
              </p>
            )}
          </div>

          {/* Role & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                User Role
              </label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all appearance-none"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Account Status
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs transition-all
                  ${
                    form.isActive
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                      : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                  }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${form.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                />
                {form.isActive ? "ACTIVE" : "INACTIVE"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {form._id ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  password?: string;
};

type Props = {
  user: UserType;
  onClose: () => void;
  onSave: (user: UserType) => Promise<void>;
};

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState<UserType>(user);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setForm(user);
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

    try {
      setLoading(true);
      await onSave(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[420px] rounded-2xl shadow-xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black">
            {form._id ? "Edit User" : "Add User"}
          </h2>
          <button onClick={onClose} className="text-black text-xl leading-none">
            ×
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm text-black font-medium">Name</label>
            <input
              className={`w-full border px-3 py-2 rounded mt-1 text-black ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-black font-medium">Email</label>
            <input
              className={`w-full border px-3 py-2 rounded mt-1 text-black ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-black font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full border px-3 py-2 rounded mt-1 text-black ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                value={form.password ?? ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={
                  form._id
                    ? "Leave blank to keep existing password"
                    : "Enter a password"
                }
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-black font-medium">Role</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1 text-black"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* STATUS TOGGLE */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-black font-medium">Status</span>

            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                form.isActive ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                  form.isActive ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-black hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

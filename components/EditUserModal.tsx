import { useState, useEffect } from "react";

type Props = {
  user: any;
  onClose: () => void;
  onSave: (user: any) => void;
};

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState(user);

  useEffect(() => {
    setForm(user);
  }, [user]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center"
    onClick={onClose}>
      <div className="bg-white p-6 rounded-xl w-96 space-y-4"
      onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-black">Edit User</h2>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-3 py-2 text-black"
          placeholder="Name"
        />

        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-3 py-2 text-black"
          placeholder="Name"
        />

        <select
          className="w-full border px-3 py-2 text-black rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
          />
          <label className="text-black text-sm">Active</label>
        </div>

        <div className="flex justify-end gap-2">
          <button className="text-black" onClick={onClose}>Cancel</button>
          <button
            onClick={() => onSave(form)}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
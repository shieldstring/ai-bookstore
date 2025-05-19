import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TierFormModal({ initialValues, onSave, onClose }) {
  const [form, setForm] = useState({
    tier: "",
    name: "",
    commissionRate: "",
    minEarnings: "",
    benefits: "",
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        tier: initialValues.tier,
        name: initialValues.name,
        commissionRate: initialValues.commissionRate,
        minEarnings: initialValues.minEarnings,
        benefits: (initialValues.benefits || []).join(", "),
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      tier: Number(form.tier),
      name: form.name,
      commissionRate: Number(form.commissionRate),
      minEarnings: Number(form.minEarnings),
      benefits: form.benefits
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
    };
    onSave(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold mb-4">
          {initialValues ? "Edit Tier" : "Create New Tier"}
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Tier Level (integer)"
            name="tier"
            type="number"
            min="0"
            value={form.tier}
            onChange={handleChange}
            required
          />
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Commission Rate (%)"
            name="commissionRate"
            type="number"
            step="0.01"
            value={form.commissionRate}
            onChange={handleChange}
            required
          />
          <Input
            label="Minimum Earnings (USD)"
            name="minEarnings"
            type="number"
            step="0.01"
            value={form.minEarnings}
            onChange={handleChange}
            required
          />
          <Input
            label="Benefits (comma‑separated)"
            name="benefits"
            value={form.benefits}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg"
          >
            {initialValues ? "Update Tier" : "Create Tier"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col text-sm">
      <label className="mb-1 text-gray-600 font-medium">{label}</label>
      <input
        {...props}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

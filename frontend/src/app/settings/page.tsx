"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchContacts, addContact, deleteContact } from "@/lib/api";
import type { TrustedContact } from "@/types";

export default function SettingsPage() {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      const created = await addContact({ name, phone, email: email || undefined });
      setContacts((prev) => [...prev, created]);
      setName("");
      setPhone("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add contact");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-400">Manage trusted contacts</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Trusted Contacts
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              These people will be alerted if you don&apos;t check in during a walk.
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-gray-400">Loading…</div>
          ) : contacts.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">
              No trusted contacts yet. Add one below.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-400">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-xs text-gray-300">{contact.email}</p>
                    )}
                  </div>
                  <button
                    onClick={() => contact.id && handleDelete(contact.id)}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Add Contact
            </h2>
          </div>

          <form onSubmit={handleAdd} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 555 123 4567"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email <span className="text-gray-300">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="jane@example.com"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim() || !phone.trim()}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
            >
              {submitting ? "Adding…" : "Add Contact"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

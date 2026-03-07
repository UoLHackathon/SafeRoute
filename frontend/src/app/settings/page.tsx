"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchContacts, addContact, deleteContact } from "@/lib/api";
import type { TrustedContact } from "@/types";

export default function SettingsPage() {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
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
      // Backend may not be running — show empty state
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
      // Silent
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
            <p className="text-sm text-white/40">Manage trusted contacts</p>
          </div>
        </div>

        {/* ── Trusted contacts list ──────────────────────────────────────── */}
        <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Trusted Contacts
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              These people will be alerted if you don&apos;t check in during a walk.
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-white/30">Loading…</div>
          ) : contacts.length === 0 ? (
            <div className="p-6 text-center text-sm text-white/30">
              No trusted contacts yet. Add one below.
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{contact.name}</p>
                    <p className="text-xs text-white/40">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-xs text-white/30">{contact.email}</p>
                    )}
                  </div>
                  <button
                    onClick={() => contact.id && handleDelete(contact.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Add contact form ───────────────────────────────────────────── */}
        <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Add Contact
            </h2>
          </div>

          <form onSubmit={handleAdd} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 555 123 4567"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">
                Email <span className="text-white/20">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="jane@example.com"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim() || !phone.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {submitting ? "Adding…" : "Add Contact"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

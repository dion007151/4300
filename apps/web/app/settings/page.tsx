"use client";

import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-display font-bold mb-2" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>Manage your account, preferences, and integrations</p>

        <div className="space-y-6">
          {[
            {
              title: "Profile",
              icon: "bi-person",
              items: [
                { label: "Display Name", type: "input", placeholder: "Your name" },
                { label: "Email Address", type: "input", placeholder: "you@example.com" },
                { label: "Bio", type: "textarea", placeholder: "Tell us about yourself" }
              ]
            },
            {
              title: "Appearance",
              icon: "bi-palette",
              items: []
            },
            {
              title: "Notifications",
              icon: "bi-bell",
              items: []
            }
          ].map((section) => (
            <div key={section.title} className="rounded-2xl p-6" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-5">
                <i className={`bi ${section.icon} text-lg`} style={{ color: "var(--accent)" }} />
                <h2 className="font-display font-semibold text-base" style={{ color: "var(--text-primary)" }}>{section.title}</h2>
              </div>
              {section.items.map((item) => (
                <div key={item.label} className="mb-4">
                  <label className="label block mb-1">{item.label}</label>
                  {item.type === "textarea" ? (
                    <textarea className="input" rows={3} placeholder={item.placeholder} />
                  ) : (
                    <input className="input" placeholder={item.placeholder} />
                  )}
                </div>
              ))}
              {section.title === "Appearance" && (
                <div className="grid grid-cols-2 gap-3">
                  {["Light", "Dark", "System"].map((t) => (
                    <button key={t} className="btn btn-secondary justify-center">{t}</button>
                  ))}
                </div>
              )}
              {section.title === "Notifications" && (
                <div className="space-y-3">
                  {["Email notifications", "Push notifications", "Weekly digest"].map((n) => (
                    <div key={n} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{n}</span>
                      <button className="relative" style={{ width: 40, height: 22 }}>
                        <div className="absolute inset-0 rounded-full" style={{ background: "var(--accent)" }} />
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {section.items.length > 0 && (
                <button className="btn btn-primary mt-2" onClick={() => toast.success("Settings saved!")}>
                  <i className="bi bi-check" /> Save Changes
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

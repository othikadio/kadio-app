import { create } from 'zustand'

let toastId = 0

export const useUIStore = create((set, get) => ({
  // ── Toasts ──
  toasts: [],
  toast: (message, type = 'info', duration = 3500) => {
    const id = ++toastId
    set(s => ({ toasts: [...s.toasts, { id, message, type, duration }] }))
    setTimeout(() => get().removeToast(id), duration)
    return id
  },
  toastSuccess: (msg) => get().toast(msg, 'success'),
  toastError:   (msg) => get().toast(msg, 'error'),
  toastInfo:    (msg) => get().toast(msg, 'info'),
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  // ── Sidebar admin (desktop) ──
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  // ── Modal global ──
  modal: null, // { component, props }
  openModal:  (component, props = {}) => set({ modal: { component, props } }),
  closeModal: () => set({ modal: null }),
}))

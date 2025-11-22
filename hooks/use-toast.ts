import { useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  add: (message: string, type: ToastType, duration?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

let toastState: ToastState = {
  toasts: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
};

let listeners: Set<() => void> = new Set();

/**
 * Hook pour gérer les notifications toast
 * Usage:
 * const { add, remove, clear, toasts } = useToast();
 * add("Produit ajouté!", "success", 3000);
 */
export const useToast = () => {
  const idCounterRef = useRef(0);

  const add = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = `toast-${idCounterRef.current++}`;
      const newToast: Toast = { id, message, type, duration };

      toastState.toasts = [...toastState.toasts, newToast];
      notifyListeners();

      if (duration > 0) {
        setTimeout(() => {
          remove(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const remove = useCallback((id: string) => {
    toastState.toasts = toastState.toasts.filter(t => t.id !== id);
    notifyListeners();
  }, []);

  const clear = useCallback(() => {
    toastState.toasts = [];
    notifyListeners();
  }, []);

  return {
    add,
    remove,
    clear,
    toasts: toastState.toasts,
  };
};

/**
 * Hook pour consommer les toasts (à utiliser dans ToastContainer)
 */
export const useToastListener = (callback: (toasts: Toast[]) => void) => {
  const callbackRef = useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const listener = () => {
      callbackRef.current(toastState.toasts);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
};

/**
 * Notifie tous les listeners des changements de toast
 */
function notifyListeners() {
  listeners.forEach(listener => listener());
}

// Import React pour useEffect
import React from 'react';

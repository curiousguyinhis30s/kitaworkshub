'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// --- Types ---

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// --- Context ---

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// --- Provider ---

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  autoDismissDuration?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  autoDismissDuration = 5000,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      id,
      type,
      message,
      timestamp: Date.now(),
    };

    setNotifications((prev) => {
      const next = [newNotification, ...prev];
      // Limit visible notifications
      return next.slice(0, maxNotifications);
    });
  }, [maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Auto-dismiss effect
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, autoDismissDuration);
      timers.push(timer);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [notifications, autoDismissDuration, removeNotification]);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// --- Hook ---

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// --- Helper: Icon Mapping ---

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  const baseClass = "w-6 h-6 flex-shrink-0";

  switch (type) {
    case 'success':
      return <CheckCircle className={`${baseClass} text-green-500`} />;
    case 'error':
      return <AlertCircle className={`${baseClass} text-red-500`} />;
    case 'warning':
      return <AlertTriangle className={`${baseClass} text-yellow-500`} />;
    case 'info':
      return <Info className={`${baseClass} text-blue-500`} />;
    default:
      return null;
  }
};

// --- Component: NotificationToast ---

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onRemove }) => {
  const { type, message, id } = notification;

  // Styles based on type
  const borderColors = {
    success: "border-l-4 border-green-500",
    error: "border-l-4 border-red-500",
    warning: "border-l-4 border-yellow-500",
    info: "border-l-4 border-blue-500",
  };

  return (
    <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-out transform ${borderColors[type]}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <NotificationIcon type={type} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={() => onRemove(id)}
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component: NotificationContainer ---

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-end space-y-2 p-4 sm:p-6">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto w-full max-w-sm animate-slide-in"
        >
          <NotificationToast
            notification={notification}
            onRemove={removeNotification}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationProvider;

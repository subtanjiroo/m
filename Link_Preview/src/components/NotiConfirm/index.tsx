import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react"
import { X } from "lucide-react";

type NotifyType = "info" | "success" | "warning" | "error";

interface NotificationContextType {
  notify: (
    message: string,
    options?: { type?: NotifyType; duration?: number }
  ) => void;
  confirm: (message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
  confirm: () => Promise.resolve(false),
});

const typeClasses: Record<NotifyType, string> = {
  info: "bg-blue-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  error: "bg-red-500 text-white",
};

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [list, setList] = useState<
    Array<{ id: number; message: string; type: NotifyType }>
  >([]);
  const [confirmConfig, setConfirmConfig] = useState<{
    message: string;
    resolve: (value: boolean) => void;
  } | null>(null);

  const notify = useCallback(
    (
      message: string,
      { type = "info", duration = 3000 }: { type?: NotifyType; duration?: number } = {}
    ) => {
      const id = Date.now();
      setList((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setList((prev) => prev.filter((item) => item.id !== id)), duration);
    },
    []
  );

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setConfirmConfig({ message, resolve });
    });
  }, []);

  const handleConfirm = (value: boolean) => {
    if (confirmConfig) {
      confirmConfig.resolve(value);
      setConfirmConfig(null);
    }
  };

  const remove = useCallback((id: number) => {
    setList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Toast notifications */}
      <div className="fixed top-20 right-4 flex flex-col gap-2 z-500">
        {list.map(({ id, message, type }) => (
          <div
            key={id}
            className={`flex items-center p-3 rounded min-w-[200px] shadow ${typeClasses[type]}`}
          >
            <span className="flex-1 text-sm">{message}</span>
            <button
              onClick={() => remove(id)}
              className="ml-2 focus:outline-none"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500">
          <div className="bg-white p-6 rounded-lg shadow-lg w-50% text-center">
            <p className="text-base text-gray-800 mb-4">
              {confirmConfig.message}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Hủy
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white text-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotify = () => {
  const { notify } = useContext(NotificationContext);
  return notify;
};

export const useConfirm = () => {
  const { confirm } = useContext(NotificationContext);
  return confirm;
};

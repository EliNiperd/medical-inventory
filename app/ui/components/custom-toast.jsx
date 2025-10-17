'use client';

import { toast } from 'sonner';

export default function CustomToast({
  id,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
}) {
  const handleConfirm = () => {
    onConfirm();
    toast.dismiss(id);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    toast.dismiss(id);
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full">
      <p className="text-gray-900 dark:text-gray-100 mb-3 text-sm font-medium">{message}</p>
      <div className="flex gap-2 justify-end w-full">
        {onCancel && (
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {cancelLabel}
          </button>
        )}
        <button
          onClick={handleConfirm}
          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

export default function FooterForm({ children }) {
  return (
    <div
      className={`
      flex justify-end gap-4 pt-4  bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700
    `}
    >
      {children}
    </div>
  );
}

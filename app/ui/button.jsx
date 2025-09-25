import clsx from 'clsx';

export default function Button({ children, className, ...props }) {
  return (
    <button {...props} className={clsx('btn-form-submit', className)}>
      {children}
    </button>
  );
}

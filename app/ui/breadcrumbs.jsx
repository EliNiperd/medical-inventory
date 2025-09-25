import clsx from 'clsx';
import Link from 'next/link';
import { nunito } from './fonts';

export default function Breadcrumbs({ breadcrumbs }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(nunito.className, 'flex text-xl md:text-2xl')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx('flex items-center gap-2', {
              'text-gray-400': !breadcrumb.active,
            })}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? <span className="mx-3 inline-block">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

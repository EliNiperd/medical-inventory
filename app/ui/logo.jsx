import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { nunito } from '@/app/ui/fonts';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <GlobeAltIcon className="w-8 h-8 text-blue-500" />
      <h1 className="text-2xl font-bold" style={nunito}>
        World
      </h1>
    </div>
  );
}

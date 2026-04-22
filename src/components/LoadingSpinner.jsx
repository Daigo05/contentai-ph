import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12 animate-fade-in">
      <Loader2 className="w-12 h-12 text-brand-violet animate-spin mb-4" />
      <p className="text-brand-purple/80 font-medium text-lg">
        Crafting your content... ✨
      </p>
    </div>
  );
}

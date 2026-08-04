import { useState } from 'react';

export default function PreviewImage({ src, alt, className = '', placeholderClass = '', ...props }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center ${placeholderClass} ${className}`}>
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#111014] border border-gold/15 text-gold/80">
          <span className="text-sm">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}

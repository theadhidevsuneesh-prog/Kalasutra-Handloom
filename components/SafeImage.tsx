"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/** Plain <img> with a graceful placeholder if the remote photo fails to load. */
export default function SafeImage({ src, alt, className = "", loading = "lazy" }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-linen-dark text-brass ${className}`}>
        <ImageOff aria-hidden className="h-8 w-8" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={loading} onError={() => setFailed(true)} className={className} />;
}

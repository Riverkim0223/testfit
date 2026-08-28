"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ReelsMediaCard.module.css";

interface OwnedVideoProps {
  src: string;
  poster?: string;
  title: string;
}

export function OwnedVideo({ src, poster, title }: OwnedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => setAutoplayBlocked(true));
    }
  }, [src]);

  const handlePlay = async () => {
    try {
      await videoRef.current?.play();
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
    }
  };

  return (
    <div className={styles.playerFrame}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={title}
      />
      {autoplayBlocked ? (
        <button className={styles.centerPlayButton} type="button" onClick={handlePlay}>
          재생
        </button>
      ) : null}
    </div>
  );
}

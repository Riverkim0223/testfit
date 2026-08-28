"use client";

import Script from "next/script";
import { useEffect, useState, type CSSProperties } from "react";
import { normalizeInstagramPermalink } from "../../lib/reels-media";
import styles from "./ReelsMediaCard.module.css";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

const blockquoteStyle: CSSProperties = {
  background: "#fff",
  border: 0,
  borderRadius: 12,
  boxShadow: "none",
  margin: 0,
  maxWidth: "100%",
  minWidth: 0,
  padding: 0,
  width: "100%",
};

interface InstagramEmbedProps {
  sourceUrl: string;
  title: string;
}

export function InstagramEmbed({ sourceUrl, title }: InstagramEmbedProps) {
  const permalink = normalizeInstagramPermalink(sourceUrl);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !permalink) return;

    const frame = window.requestAnimationFrame(() => {
      window.instgrm?.Embeds?.process();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [permalink, scriptReady]);

  if (!permalink) {
    return (
      <a className={styles.fallbackLink} href={sourceUrl} target="_blank" rel="noreferrer">
        Instagram에서 원본 보기
      </a>
    );
  }

  return (
    <div className={styles.embedContainer} aria-label={`${title} Instagram 미리보기`}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={blockquoteStyle}
      >
        <a href={permalink} target="_blank" rel="noreferrer">
          Instagram에서 원본 보기
        </a>
      </blockquote>

      <Script
        id="instagram-embed-script"
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
      />
    </div>
  );
}

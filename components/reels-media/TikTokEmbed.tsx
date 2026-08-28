"use client";

import { buildTikTokPlayerUrl } from "../../lib/reels-media";
import styles from "./ReelsMediaCard.module.css";

interface TikTokEmbedProps {
  sourceUrl: string;
  title: string;
}

export function TikTokEmbed({ sourceUrl, title }: TikTokEmbedProps) {
  const playerUrl = buildTikTokPlayerUrl(sourceUrl);

  if (!playerUrl) {
    return (
      <a className={styles.fallbackLink} href={sourceUrl} target="_blank" rel="noreferrer">
        TikTok에서 원본 보기
      </a>
    );
  }

  return (
    <div className={styles.playerFrame}>
      <iframe
        className={styles.iframe}
        src={playerUrl}
        title={`${title} TikTok 미리보기`}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

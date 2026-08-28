"use client";

import { useState } from "react";
import {
  getPreviewButtonLabel,
  type ReelsMediaSource,
} from "../../lib/reels-media";
import { InstagramEmbed } from "./InstagramEmbed";
import { OwnedVideo } from "./OwnedVideo";
import { TikTokEmbed } from "./TikTokEmbed";
import styles from "./ReelsMediaCard.module.css";

interface ReelsMediaCardProps {
  title: string;
  creator?: string;
  description?: string;
  matchScore?: number;
  reason?: string;
  tags?: string[];
  media: ReelsMediaSource;
  priority?: boolean;
  onPreviewOpen?: (mode: ReelsMediaSource["mode"]) => void;
  onOriginalOpen?: (url: string) => void;
}

export function ReelsMediaCard({
  title,
  creator,
  description,
  matchScore,
  reason,
  tags = [],
  media,
  priority = false,
  onPreviewOpen,
  onOriginalOpen,
}: ReelsMediaCardProps) {
  const canPreview =
    media.mode !== "external-link" &&
    !(media.mode === "owned-video" && !media.videoUrl);
  const [previewOpen, setPreviewOpen] = useState(
    media.mode === "owned-video" && Boolean(media.videoUrl),
  );

  const openPreview = () => {
    if (!canPreview) return;
    setPreviewOpen(true);
    onPreviewOpen?.(media.mode);
  };

  const renderPreview = () => {
    switch (media.mode) {
      case "owned-video":
        if (!media.videoUrl) return null;
        return <OwnedVideo src={media.videoUrl} poster={media.posterUrl} title={title} />;
      case "instagram":
        return <InstagramEmbed sourceUrl={media.sourceUrl} title={title} />;
      case "tiktok":
        return <TikTokEmbed sourceUrl={media.sourceUrl} title={title} />;
      default:
        return null;
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.mediaArea}>
        {previewOpen ? (
          renderPreview()
        ) : (
          <div className={styles.poster}>
            {media.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.posterImage}
                src={media.posterUrl}
                alt={media.alt}
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              <div className={styles.generatedPoster} aria-label={media.alt}>
                <span className={styles.posterEyebrow}>REELSFIT PICK</span>
                <strong>{title}</strong>
                <span>{creator ?? "추천 콘텐츠"}</span>
              </div>
            )}

            {!canPreview ? (
              <a
                className={styles.previewButton}
                href={media.sourceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => onOriginalOpen?.(media.sourceUrl)}
              >
                {media.mode === "owned-video" ? "원본 콘텐츠 열기" : getPreviewButtonLabel(media)}
              </a>
            ) : (
              <button className={styles.previewButton} type="button" onClick={openPreview}>
                {getPreviewButtonLabel(media)}
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.headingRow}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {creator ? <p className={styles.creator}>{creator}</p> : null}
          </div>
          {typeof matchScore === "number" ? (
            <span className={styles.score}>{Math.round(matchScore)}% FIT</span>
          ) : null}
        </div>

        {description ? <p className={styles.description}>{description}</p> : null}
        {reason ? <p className={styles.reason}>{reason}</p> : null}

        {tags.length > 0 ? (
          <ul className={styles.tagList} aria-label="콘텐츠 태그">
            {tags.slice(0, 4).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}

        <div className={styles.actions}>
          {previewOpen && media.mode !== "owned-video" ? (
            <button className={styles.secondaryButton} type="button" onClick={() => setPreviewOpen(false)}>
              미리보기 닫기
            </button>
          ) : null}
          <a
            className={styles.primaryLink}
            href={media.sourceUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => onOriginalOpen?.(media.sourceUrl)}
          >
            원본에서 보기
          </a>
        </div>

        {media.mode !== "owned-video" ? (
          <p className={styles.privacyNote}>
            외부 콘텐츠는 미리보기를 누를 때만 플랫폼에서 로드됩니다.
          </p>
        ) : null}
      </div>
    </article>
  );
}

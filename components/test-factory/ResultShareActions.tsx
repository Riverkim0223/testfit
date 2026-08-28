"use client";

import { useEffect, useMemo, useState } from "react";
import {
  canNativeShareFiles,
  canNativeShareUrl,
  copyText,
  downloadFile,
  fetchImageFile,
  isShareCancellation,
} from "@/lib/test-factory/share-client";
import styles from "./ResultShareActions.module.css";

interface Props {
  resultId: string;
  profileId: string;
  title: string;
  text: string;
  url: string;
  feedImageUrl: string;
  storyImageUrl: string;
  fileName: string;
}

type Status = { type: "idle" | "working" | "success" | "error"; message: string };

export function ResultShareActions(props: Props) {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [feedFile, setFeedFile] = useState<File | null>(null);
  const [feedFileError, setFeedFileError] = useState(false);
  const storyFileName = useMemo(
    () => props.fileName.replace(/\.png$/i, "-story.png"),
    [props.fileName],
  );

  useEffect(() => {
    let cancelled = false;
    void fetchImageFile(props.feedImageUrl, props.fileName)
      .then((file) => { if (!cancelled) setFeedFile(file); })
      .catch(() => { if (!cancelled) setFeedFileError(true); });
    return () => { cancelled = true; };
  }, [props.feedImageUrl, props.fileName]);

  const track = (action: string) => {
    void fetch("/api/analytics/result-share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event: "result_share_action",
        occurredAt: new Date().toISOString(),
        resultId: props.resultId,
        profileId: props.profileId,
        action,
      }),
    }).catch(() => undefined);
  };

  const shareUrl = async () => {
    try {
      if (canNativeShareUrl()) {
        await navigator.share({ title: props.title, text: props.text, url: props.url });
        track("native_share");
        setStatus({ type: "success", message: "공유 창을 열었어요." });
      } else {
        await copyText(props.url);
        track("link_copy");
        setStatus({ type: "success", message: "링크를 복사했어요." });
      }
    } catch (error) {
      if (!isShareCancellation(error)) {
        setStatus({ type: "error", message: "공유하지 못했어요. 링크 복사를 이용해 주세요." });
      }
    }
  };

  const shareImage = async () => {
    if (!feedFile) {
      setStatus({
        type: "error",
        message: feedFileError ? "이미지를 불러오지 못했어요." : "이미지를 준비하고 있어요.",
      });
      return;
    }
    try {
      if (canNativeShareFiles(feedFile)) {
        await navigator.share({ files: [feedFile], title: props.title, text: `${props.text}\n${props.url}` });
        track("image_share");
        setStatus({ type: "success", message: "이미지 공유 창을 열었어요." });
      } else {
        downloadFile(feedFile);
        track("image_save");
        setStatus({ type: "success", message: "결과 이미지를 저장했어요." });
      }
    } catch (error) {
      if (!isShareCancellation(error)) setStatus({ type: "error", message: "이미지를 공유하지 못했어요." });
    }
  };

  const saveImage = async (variant: "feed" | "story") => {
    setStatus({ type: "working", message: "이미지를 준비하고 있어요…" });
    try {
      const file = variant === "feed" && feedFile
        ? feedFile
        : await fetchImageFile(
            variant === "feed" ? props.feedImageUrl : props.storyImageUrl,
            variant === "feed" ? props.fileName : storyFileName,
          );
      downloadFile(file);
      track(variant === "feed" ? "image_save" : "story_image_save");
      setStatus({ type: "success", message: variant === "feed" ? "피드 이미지를 저장했어요." : "스토리 이미지를 저장했어요." });
    } catch {
      setStatus({ type: "error", message: "이미지를 저장하지 못했어요." });
    }
  };

  const copyLink = async () => {
    try {
      await copyText(props.url);
      track("link_copy");
      setStatus({ type: "success", message: "결과 링크를 복사했어요." });
    } catch {
      setStatus({ type: "error", message: "링크를 복사하지 못했어요." });
    }
  };

  return (
    <section className={styles.section} aria-labelledby="share-title">
      <div className={styles.heading}>
        <div>
          <p>SHARE YOUR RESULT</p>
          <h2 id="share-title">내 결과를 친구에게 보여주세요</h2>
        </div>
        <span>링크로 공유하거나 카드 이미지로 저장할 수 있어요.</span>
      </div>
      <div className={styles.primaryActions}>
        <button type="button" onClick={shareUrl}>공유하기</button>
        <button type="button" onClick={shareImage} disabled={!feedFile && !feedFileError}>
          {!feedFile && !feedFileError ? "이미지 준비 중" : "이미지로 공유"}
        </button>
      </div>
      <div className={styles.secondaryActions}>
        <button type="button" onClick={() => void saveImage("feed")}>피드 이미지 저장 · 4:5</button>
        <button type="button" onClick={() => void saveImage("story")}>스토리 이미지 저장 · 9:16</button>
        <button type="button" onClick={copyLink}>링크 복사</button>
      </div>
      <div className={styles.status} data-status={status.type} aria-live="polite">{status.message}</div>
    </section>
  );
}

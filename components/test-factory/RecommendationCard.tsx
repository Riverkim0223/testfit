import { ReelsMediaCard } from "@/components/reels-media";
import { getReelsMediaItem } from "@/data/reels-media.catalog";
import type { PublicRecommendation } from "@/lib/test-factory/types";
import styles from "./RecommendationCard.module.css";

export function RecommendationCard({ recommendation }: { recommendation: PublicRecommendation }) {
  if (recommendation.displayKind === "media" && recommendation.mediaContentId) {
    const content = getReelsMediaItem(recommendation.mediaContentId);
    if (content) {
      return (
        <section className={styles.mediaSection}>
          <div className={styles.heading}>
            <p>{recommendation.kicker}</p>
            <h2>{recommendation.title}</h2>
          </div>
          <ReelsMediaCard
            title={content.title}
            creator={content.creator}
            description={content.description}
            matchScore={recommendation.score}
            reason={recommendation.description}
            tags={recommendation.badges}
            media={content.media}
          />
        </section>
      );
    }
  }

  return (
    <article className={styles.card} data-kind={recommendation.displayKind}>
      <div className={styles.cardTop}>
        <div>
          <p>{recommendation.kicker}</p>
          <h2>{recommendation.title}</h2>
        </div>
        {recommendation.emoji ? <span className={styles.emoji}>{recommendation.emoji}</span> : null}
      </div>
      {recommendation.displayKind === "color" && recommendation.value ? (
        <div className={styles.colorPreview}>
          <span style={{ background: recommendation.value }} />
          <strong>{recommendation.value}</strong>
        </div>
      ) : null}
      <p className={styles.description}>{recommendation.description}</p>
      {recommendation.badges?.length ? (
        <ul className={styles.badges}>
          {recommendation.badges.map((badge) => <li key={badge}>{badge}</li>)}
        </ul>
      ) : null}
    </article>
  );
}

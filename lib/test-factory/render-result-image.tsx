import { ImageResponse } from "next/og";
import type { PublicTestResult } from "./types";
import { SHARE_IMAGE_SPECS, type ShareImageVariant } from "./share";
import { getSiteUrl } from "./site-url";

async function loadOptionalKoreanFont(): Promise<ArrayBuffer | null> {
  const configuredUrl = process.env.TEST_FACTORY_SHARE_FONT_URL;
  if (!configuredUrl) return null;

  try {
    const response = await fetch(new URL(configuredUrl, getSiteUrl()), {
      cache: "force-cache",
    });
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

function ScoreBar({
  label,
  value,
  accent,
  compact = false,
}: {
  label: string;
  value: number;
  accent: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: compact ? 5 : 8,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: compact ? 17 : 23,
          fontWeight: 700,
        }}
      >
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: compact ? 8 : 12,
          borderRadius: 999,
          background: "rgba(21,23,28,.10)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            width: `${Math.max(3, Math.min(100, value))}%`,
            height: "100%",
            borderRadius: 999,
            background: accent,
          }}
        />
      </div>
    </div>
  );
}

function ResultImage({
  result,
  variant,
}: {
  result: PublicTestResult;
  variant: ShareImageVariant;
}) {
  const isOg = variant === "og";
  const isStory = variant === "story";
  const padding = isOg ? 54 : isStory ? 72 : 64;
  const titleSize = isOg ? 58 : isStory ? 88 : 76;
  const recommendation = result.recommendations[0];
  const profileImageUrl = result.profileIllustration
    ? new URL(result.profileIllustration.src, getSiteUrl()).toString()
    : null;
  const illustrationSize = isOg ? 138 : isStory ? 310 : 238;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding,
        color: result.theme.text,
        backgroundImage: `radial-gradient(circle at 12% 8%, rgba(255,255,255,.42), transparent 30%), linear-gradient(145deg, ${result.theme.primary}, ${result.theme.secondary})`,
        fontFamily: "TestFactoryShare, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: isOg ? 22 : 29,
            fontWeight: 900,
            letterSpacing: ".13em",
          }}
        >
          {result.testTitle.toUpperCase()} RESULT
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: isOg ? 120 : 150,
            height: isOg ? 52 : 64,
            padding: "0 22px",
            borderRadius: 999,
            color: result.theme.text,
            background: "rgba(255,255,255,.94)",
            fontSize: isOg ? 22 : 28,
            fontWeight: 900,
          }}
        >
          {Math.round(result.fitScore)}% MATCH
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isOg ? "row" : "column",
          alignItems: isOg ? "center" : "stretch",
          gap: isOg ? 38 : 42,
          flex: 1,
          paddingTop: isOg ? 24 : 58,
          paddingBottom: isOg ? 18 : 42,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1.12,
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: "-.055em",
            }}
          >
            <span>{result.profileTitle}</span>
            {!profileImageUrl ? <span>{result.profileEmoji}</span> : null}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: isOg ? 610 : 880,
              marginTop: 24,
              fontSize: isOg ? 25 : 36,
              lineHeight: 1.38,
              fontWeight: 750,
              opacity: .96,
            }}
          >
            {result.profileSubtitle}
          </div>
          {result.secondaryProfile ? (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                padding: "12px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,.16)",
                fontSize: isOg ? 18 : 24,
                fontWeight: 750,
              }}
            >
              숨은 성향 · {result.secondaryProfile.title} {result.secondaryProfile.emoji}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: isOg ? 420 : "100%",
            minHeight: isOg ? 392 : isStory ? 860 : 620,
            padding: isOg ? 20 : 34,
            borderRadius: isOg ? 31 : 42,
            background: "rgba(255,255,255,.96)",
            boxShadow: "0 28px 80px rgba(32,24,77,.22)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: illustrationSize,
              height: illustrationSize,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: isOg ? 24 : 34,
              background: "#f8f7f4",
              boxShadow: `0 16px 36px ${result.theme.primary}22`,
            }}
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={result.profileIllustration?.alt ?? result.profileTitle}
                width={illustrationSize}
                height={illustrationSize}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: result.profileIllustration?.objectPosition ?? "center",
                }}
              />
            ) : (
              <div style={{ display: "flex", fontSize: isOg ? 74 : 118 }}>
                {result.profileEmoji}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: isOg ? 12 : 18,
              width: "100%",
              marginTop: isOg ? 14 : 24,
            }}
          >
            {result.axisScores.slice(0, 4).map((axis) => (
              <div
                key={axis.id}
                style={{
                  display: "flex",
                  width: "47%",
                }}
              >
                <ScoreBar
                  label={axis.label}
                  value={axis.value}
                  accent={result.theme.primary}
                  compact={isOg}
                />
              </div>
            ))}
          </div>

          {recommendation ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginTop: isOg ? 14 : 24,
                padding: isOg ? 16 : 25,
                borderRadius: 24,
                background: `${result.theme.primary}14`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: result.theme.primary,
                  fontSize: isOg ? 15 : 22,
                  fontWeight: 900,
                }}
              >
                {recommendation.kicker}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 7,
                  fontSize: isOg ? 20 : 30,
                  lineHeight: 1.22,
                  fontWeight: 900,
                }}
              >
                {recommendation.emoji ? `${recommendation.emoji} ` : ""}
                {recommendation.title}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "rgba(255,255,255,.96)",
          fontSize: isOg ? 20 : 26,
          fontWeight: 750,
        }}
      >
        <span>나와 닮은 결과를 확인해보세요</span>
        <span>TEST FACTORY</span>
      </div>
    </div>
  );
}

export async function createResultImageResponse(
  result: PublicTestResult,
  variant: ShareImageVariant,
): Promise<ImageResponse> {
  const spec = SHARE_IMAGE_SPECS[variant];
  const fontData = await loadOptionalKoreanFont();

  return new ImageResponse(<ResultImage result={result} variant={variant} />, {
    width: spec.width,
    height: spec.height,
    ...(fontData
      ? {
          fonts: [
            {
              name: "TestFactoryShare",
              data: fontData,
              weight: 700 as const,
              style: "normal" as const,
            },
          ],
        }
      : {}),
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "content-disposition": `inline; filename="${result.testSlug}-${result.profileId}-${variant}.png"`,
    },
  });
}

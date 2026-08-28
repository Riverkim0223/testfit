export async function fetchImageFile(imageUrl: string, fileName: string): Promise<File> {
  const response = await fetch(imageUrl, { credentials: "same-origin" });
  if (!response.ok) throw new Error(`Share image request failed: ${response.status}`);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || "image/png", lastModified: Date.now() });
}

export function canNativeShareUrl(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function canNativeShareFiles(file: File): boolean {
  return typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] });
}

export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const succeeded = document.execCommand("copy");
  textarea.remove();
  if (!succeeded) throw new Error("Clipboard copy failed");
}

export function downloadFile(file: File): void {
  const objectUrl = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
}

export function isShareCancellation(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

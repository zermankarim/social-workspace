/**
 * Extract image files from a paste / drop clipboard DataTransfer.
 * Returns an empty array when the event has no image items.
 */
export function getImageFilesFromDataTransfer(
  dataTransfer: DataTransfer | null,
): File[] {
  if (!dataTransfer) return [];

  const fromFiles = Array.from(dataTransfer.files).filter((file) =>
    file.type.startsWith("image/"),
  );
  if (fromFiles.length > 0) return fromFiles;

  const fromItems: File[] = [];
  for (const item of Array.from(dataTransfer.items)) {
    if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
    const file = item.getAsFile();
    if (file) fromItems.push(file);
  }
  return fromItems;
}

/**
 * If the clipboard contains images, return them for upload.
 * Otherwise return null so the caller can keep the default text paste.
 */
export function getPastedImageFiles(
  clipboardData: DataTransfer | null,
): File[] | null {
  const files = getImageFilesFromDataTransfer(clipboardData);
  if (files.length === 0) return null;
  return files;
}

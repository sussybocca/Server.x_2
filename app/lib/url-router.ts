export function resolveVirtualUrl(url: string) {
  if (!url.startsWith("server://")) {
    return `server://${url}`;
  }
  return url;
}

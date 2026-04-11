/**
 * Full page navigation for the pathname-based router (useRouter only reads pathname).
 */
export function navigateTo(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) {
    console.warn('navigateTo: invalid path', path);
    return;
  }
  window.location.href = path;
}

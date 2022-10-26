export function makeGetCurrentDate() {
  return function getCurrentDate(): string {
    return new Date().toLocaleString(
      Intl.DateTimeFormat().resolvedOptions().locale
    );
  };
}

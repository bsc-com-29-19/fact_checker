export function formatDate(
  date: Date = new Date(),
  locale: string = "default"
): string {
  const year = date.getFullYear();
  const month = date.toLocaleString(locale, { month: "long" });
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}, ${month} ${day}`;
}

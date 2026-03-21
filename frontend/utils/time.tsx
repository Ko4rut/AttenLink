export function formatSessionTime(date: Date) {
  const month = date.toLocaleString("en-US", { month: "long" }); // April
  const day = date.getDate(); // 22
  const year = date.getFullYear(); // 2026

  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  // giả sử session kéo dài 20 phút
  const endMinute = (date.getMinutes() + 20).toString().padStart(2, "0");

  return `${month} ${day} ${year} ${hour}:${minute}-${endMinute}`;
}
/**
 * Rules:
 * - < 60 seconds: A few seconds ago
 * - < 60 minutes: X minutes ago
 * - < 24 hours: X hours ago
 * - < 7 days: X days ago
 * - Same year: Month DD
 * - Different year: yyyy Month DD
 */

export default function formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (60 * 1000));
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (seconds < 60) {
        return "A few seconds ago";
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    if (days < 7) {
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    const oneYearMs = 365 * 24 * 60 * 60 * 1000;

    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();

    if (diffMs < oneYearMs) {
        return `${month} ${day}`;
    }

    const year = date.getFullYear();
    return `${year} ${month} ${day}`;

}
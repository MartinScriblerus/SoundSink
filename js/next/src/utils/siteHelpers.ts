export function getBaseUrl() {
    return process.env.VERCEL_ENV === "development" || "local"
        ? `http://localhost:3000`
        : process.env.NEXT_PUBLIC_URL
}
const baseUrl = getBaseUrl();

const DAILY_LIMIT = 5;
const STORAGE_KEY = "quiz_count_data";

export function getDailyLimit() {
    if (typeof window === "undefined") {
        // On server, return default
        return { date: new Date().toDateString(), count: 0 };
    }

    const today = new Date().toDateString();
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        const data = { date: today, count: 0 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    }

    const data = JSON.parse(stored);

    if (data.date !== today) {
        const reset = { date: today, count: 0 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
        return reset;
    }

    return data;
}

export function incrementDailyLimit() {
    if (typeof window === "undefined") return;

    const data = getDailyLimit();
    data.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

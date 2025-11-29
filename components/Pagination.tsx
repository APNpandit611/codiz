"use client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

const Pagination = ({
    page,
    count,
}: {
    page: number | undefined;
    count: number | undefined;
}) => {
    const router = useRouter();
    page = page ?? 1;
    count = count ?? 1;
    const changePage = (newPage: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", newPage.toString());
        router.push(`${window.location.pathname}?${params}`);
    };

    const getPageNumbers = (current: number, total: number) => {
        const pages: number[] = [];

        let start = Math.max(1, current - 1);
        let end = Math.min(total, current + 1);

        if (current === 1) end = Math.min(total, 3);
        if (current === total) start = Math.max(1, total - 2);

        for (let i = start; i <= end; i++) pages.push(i);

        return pages;
    };

    const totalPages = Math.ceil(count / ITEM_PER_PAGE);
    const pagesToShow = getPageNumbers(page, totalPages);
    const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
    const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;
    return (
        <div className="py-4 flex items-center justify-between text-gray-500">
            <button
                disabled={!hasPrev}
                className={`py-2 px-4 rounded-md bg-slate-300 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                onClick={() => changePage(page - 1)}
            >
                Prev
            </button>

            <div className="flex items-center justify-center gap-3 text-sm">
                {/* {Array.from(
                    { length: Math.ceil(count / ITEM_PER_PAGE) },
                    (_, i) => {
                        const pageIndex = i + 1;
                        return (
                            <button
                                key={pageIndex}
                                className={`px-2 py-1 rounded-sm text-white ${
                                    page === pageIndex ? "bg-gradient-to-r from-indigo-600 to-blue-600" : "bg-slate-300"
                                } cursor-pointer`}
                                onClick={() => changePage(pageIndex)}
                            >
                                {pageIndex}
                            </button>
                        );
                    }
                )} */}

                {pagesToShow.map((p) => (
                    <button
                        key={p}
                        className={`px-2 py-1 rounded-sm text-white 
                ${
                    p === page
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600"
                        : "bg-slate-300"
                } cursor-pointer`}
                        onClick={() => changePage(p)}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <button
                disabled={!hasNext}
                onClick={() => changePage(page + 1)}
                className={`py-2 px-4 rounded-md bg-slate-300 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;

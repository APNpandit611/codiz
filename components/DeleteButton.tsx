"use client";
import { useRouter } from "next/navigation";
import { deleteQuiz } from "./actions/saveQuiz";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Trash2 } from "lucide-react";

export const DeleteButton = ({ quizId }: { quizId: number }) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await deleteQuiz(quizId);
            if (res?.success) {
                toast("Quiz Deleted Successfully!");
            } else {
                toast("Failed to Delete Quiz!")
            }
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200/50"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Trash2 className="w-5 h-5 " />
            )}
        </button>
    );
};

// import { useEffect, useState } from "react";
// import { getDailyLimit } from "@/components/actions/quizLimit";

// export default function ChallengesRemaining() {
//     const [remaining, setRemaining] = useState<number | null>(null);

//     useEffect(() => {
//         // Runs only on the client
//         const getLimit = () => {
//             const limit = getDailyLimit();
//             setRemaining(15 - limit.count);
//         };
//         getLimit();
//     }, [remaining]);

//     if (remaining === null)
//         return <span className="text-sm text-gray-600">Loading...</span>;

//     return (
//         <span className="text-sm text-gray-600">
//             Challenges remaining today: {remaining}
//         </span>
//     );
// }

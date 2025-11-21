import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const Navbar = async () => {
    const user = await currentUser();
    return (
        // <div className="w-full bg-gray-100 shadow-sm sm:px-8 px-4 py-2">
        //     <div className="flex justify-between items-center max-w-7xl mx-auto">
        //         {/* Logo Section - Removed extra padding to align with content */}
        //         <div>
        //             <Link
        //                 href="/"
        //                 className="flex items-baseline space-x-1 text-gray-900 hover:text-indigo-600 transition-colors duration-200"
        //             >
        //                 <span className="text-xl sm:text-2xl font-bold tracking-tight">
        //                     Codiz
        //                 </span>
        //                 <span className="text-lg sm:text-xl font-light">
        //                     Generator
        //                 </span>
        //             </Link>
        //         </div>

        //         {/* User Section - Refined hover state and text color */}
        //         <div className="flex items-center gap-x-3 p-2">
        //             <p className="text-md text-slate-500">
        //                 {user?.fullName || "User"}
        //             </p>
        //             <UserButton
        //                 appearance={{
        //                     elements: {
        //                         userButtonAvatarBox:
        //                             "w-12 h-12 border-2 border-slate-200 shadow-sm",
        //                     },
        //                 }}
        //             />
        //         </div>
        //     </div>
        // </div>

        <header className="w-full bg-white shadow-md">
            <div className="flex justify-between items-center max-w-7xl mx-auto sm:px-8 px-4 py-4">
                {/* Logo Section with a subtle underline effect on hover */}
                <div>
                    <Link
                        href="/"
                        className="group flex items-baseline space-x-0.5"
                    >
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-indigo-600">
                            Codiz
                        </span>
                        <div className="h-[1px] w-full bg-indigo-600 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                        <span className="text-lg sm:text-xl font-extralight text-zinc-700">
                            AI
                        </span>
                    </Link>
                </div>

                {/* User Section with an integrated card feel */}
                <div className="flex flex-row items-center justify-between gap-10">
                    <Link href="/history" className="hover:underline text-sm uppercase font-semibold">
                        History
                    </Link>
                    <div className="flex items-center gap-x-3 p-2.5 shadow-md rounded-md">
                        <div className="hidden lg:flex lg:items-center lg:gap-3">
                            <div className="flex flex-col text-right">
                                <p className="text-sm font-semibold text-zinc-900">
                                    {user?.fullName || "User"}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Free Plan
                                </p>{" "}
                                {/* A nice touch! */}
                            </div>
                            <div className="w-px h-8 bg-zinc-300"></div>
                        </div>
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-10 h-10 shadow-sm",
                                    userButtonPopoverCard:
                                        "border border-zinc-200 shadow-lg",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

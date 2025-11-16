import Navbar from "@/components/Navbar";


export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen bg-gray-200">
            <Navbar />

            {children}
        </div>
    );
}

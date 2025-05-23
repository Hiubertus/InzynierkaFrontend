import type {Metadata} from "next";
import localFont from "next/font/local";
import {ReactNode} from "react";
import {Navbar} from "@/components";
import { StoreProvider } from "@/lib/session/StoreProvider";
import './globals.css'
import {Toaster} from "@/components/ui/toaster";
import {getInitialData} from "@/lib/session/userData/getInitialData";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: ReactNode;
}>) {
    const {accessToken, userData} = await getInitialData();

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
            <StoreProvider
                initialAccessToken={accessToken}
                initialUserData={userData}
            >
                <Navbar/>
                <div className="container mx-auto p-5 sm:p-7 lg:p-9">
                    <main>
                        {children}
                    </main>
                </div>
                <Toaster/>
            </StoreProvider>
            </body>
        </html>
);
}
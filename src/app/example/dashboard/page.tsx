"use client";

import { signOut, useSession, SessionProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    return (
        <SessionProvider>
            <DashboardContent />
        </SessionProvider>
    );
}

function DashboardContent() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/example/auth"); // ログインページにリダイレクト
        }
    }, [status, router]);

    if (status === "loading") {
        return <p className="text-center">読み込み中...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 space-y-4">
                <h1 className="text-2xl font-bold text-center">ダッシュボード</h1>
                {session ? (
                    <>
                        <p className="text-center">ようこそ、{session.user?.name}さん！</p>
                        <div className="space-y-2">
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => signOut()}
                            >
                                ログアウト
                            </Button>
                        </div>
                    </>
                ) : null}
            </Card>
        </div>
    );
}
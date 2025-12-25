"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alert, setAlert] = useState<
        { title: string; description: string; variant: "default" | "destructive" | null } | null
    >(null);

    const handleLogin = async () => {
        const result = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            setAlert({
                title: "ログイン失敗",
                description: result.error,
                variant: "destructive",
            });
        } else {
            setAlert({
                title: "ログイン成功",
                description: "ログインしました。",
                variant: "default",
            });
            router.push("/example/dashboard"); // ダッシュボードにリダイレクト
        }
    };

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setAlert({
                title: "エラー",
                description: "パスワードが一致しません",
                variant: "destructive",
            });
        } else {
            setAlert(null);
        }
    }, [password, confirmPassword]);
    
    const handleRegister = async () => {

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            setAlert({
                title: "登録成功",
                description: "会員登録が完了しました。",
                variant: "default",
            });
        } else {
            setAlert({
                title: "登録失敗",
                description: "会員登録に失敗しました。",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 space-y-4">
                <h1 className="text-2xl font-bold text-center">
                    {isLogin ? "ログイン" : "会員登録"}
                </h1>
                {alert && (
                    <Alert variant={alert.variant}>
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                    </Alert>
                )}
                <Input
                    type="text"
                    placeholder="ユーザ名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isLogin && (
                    <Input
                        type="password"
                        placeholder="パスワード（確認用）"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <Button
                    onClick={isLogin ? handleLogin : handleRegister}
                    className="w-full"
                >
                    {isLogin ? "ログイン" : "会員登録"}
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full"
                >
                    {isLogin ? "会員登録はこちら" : "ログインはこちら"}
                </Button>
            </Card>
        </div>
    );
}
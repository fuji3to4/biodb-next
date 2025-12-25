import { NextRequest, NextResponse } from "next/server";
import { hashPassword, saveUser } from "@/app/example/_lib/biodb";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
  }

  try {
    // Hash the password and save the user to the database
    const hashedPassword = await hashPassword(password);
    const user = await saveUser(username, hashedPassword);

    return NextResponse.json({ id: user.id, username: user.username }, { status: 201 });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
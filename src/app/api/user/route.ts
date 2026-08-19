import { NextRequest, NextResponse } from "next/server";

function cleanName(raw: unknown): string {
  if (!raw || typeof raw !== "string") return "Гость";
  let name = raw.trim();
  if (name.length === 0) return "Гость";
  name = name.replace(/[^a-zA-Zа-яА-ЯёЁәіңғүұқөөә\s\-]/g, "");
  name = name.substring(0, 50);
  if (name.length === 0) return "Гость";
  return name;
}

function cleanAge(raw: unknown): number {
  const num = Number(raw);
  if (!Number.isFinite(num) || num < 1 || num > 120) return 25;
  return Math.round(num);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = cleanName(body.name);
    const age = cleanAge(body.age);

    return NextResponse.json({ name, age });
  } catch {
    return NextResponse.json({ name: "Гость", age: 25 });
  }
}

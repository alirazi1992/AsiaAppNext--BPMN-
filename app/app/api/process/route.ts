// app/api/process/route.ts
import { NextResponse } from "next/server";

let processes = [
  {
    id: "1",
    name: "فرآیند مدیریت پروژه",
    description: "مدیریت پروژه‌های داخلی شرکت",
    modules: [
      { title: "برنامه‌ریزی", owner: "علی رضی" },
      { title: "اجرا", owner: "سینا کاظمی" },
    ],
  },
  {
    id: "2",
    name: "فرآیند جذب منابع انسانی",
    description: "مراحل جذب، استخدام و ارزیابی",
    modules: [
      { title: "مصاحبه اولیه", owner: "نسترن شریعتی" },
      { title: "ارزیابی نهایی", owner: "فرهاد مرادی" },
    ],
  },
];

// GET request
export async function GET() {
  return NextResponse.json(processes);
}

// POST request
export async function POST(req: Request) {
  const body = await req.json();
  const newProcess = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    description: body.description || "",
    modules: body.modules || [],
  };

  processes = [newProcess, ...processes];
  return NextResponse.json(newProcess, { status: 201 });
}

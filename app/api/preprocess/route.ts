import { NextResponse } from "next/server";
import { preprocessText, type PipelineOptions } from "@/lib/preprocessing";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      text?: unknown;
      options?: Partial<PipelineOptions>;
    };

    if (typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Teks masukan harus berupa string." },
        { status: 400 },
      );
    }

    if (body.text.length > 10000) {
      return NextResponse.json(
        { error: "Teks terlalu panjang. Batas demonstrasi adalah 10.000 karakter." },
        { status: 413 },
      );
    }

    return NextResponse.json(preprocessText(body.text, body.options));
  } catch {
    return NextResponse.json(
      { error: "Permintaan tidak dapat diproses." },
      { status: 400 },
    );
  }
}

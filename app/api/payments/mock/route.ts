import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 },
      );
    }

    // simulate gateway delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // fake transaction
    const transactionId = `TXN_${Date.now()}`;

    return NextResponse.json({
      success: true,
      transactionId,
      amount,
      status: "paid",
      paidAt: new Date(),
      method: "mock",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Payment failed" },
      { status: 500 },
    );
  }
}

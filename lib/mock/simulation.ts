import { NextResponse } from "next/server";

interface MockOptions {
    delay?: number; // ms
    failureRate?: number; // 0.0 to 1.0
}

const DEFAULT_OPTIONS: MockOptions = {
    delay: Number(process.env.MOCK_SERVICE_DELAY_MS) || 500,
    failureRate: Number(process.env.MOCK_ERROR_RATE) || 0,
};

export async function simulateNetworkCondition(options: MockOptions = {}) {
    if (process.env.NODE_ENV === 'production') return;

    const settings = { ...DEFAULT_OPTIONS, ...options };

    if (settings.delay && settings.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, settings.delay));
    }

    if (settings.failureRate && settings.failureRate > 0) {
        if (Math.random() < settings.failureRate) {
            throw new Error("SIMULATED_INTERNAL_SERVER_ERROR");
        }
    }
}

export async function mockHandler<T>(
    handler: () => Promise<T> | T,
    options?: MockOptions
) {
    try {
        await simulateNetworkCondition(options);
        const result = await handler();
        return NextResponse.json(result);
    } catch (error: any) {
        if (error.message === "SIMULATED_INTERNAL_SERVER_ERROR") {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "INTERNAL_ERROR",
                        message: "Simulated Backend Failure (Random)",
                    },
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "UNKNOWN_ERROR",
                    message: error.message || "An unexpected error occurred",
                },
            },
            { status: 500 }
        );
    }
}

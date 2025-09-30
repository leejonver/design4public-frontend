import "@testing-library/jest-dom/vitest";

// Vitest 환경에서만 사용되도록 보호
if (!globalThis.fetch && typeof process !== "undefined" && process.env.VITEST) {
  globalThis.fetch = async (input: string | URL | Request, init?: RequestInit) => {
    const { default: fetch } = await import("node-fetch");
    return fetch(input as any, init as any) as unknown as Promise<Response>;
  };
}

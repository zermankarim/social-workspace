"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f3f2ef",
          color: "#191919",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.png"
            alt="Social Workspace"
            width={64}
            height={64}
            style={{
              width: 64,
              height: 64,
              objectFit: "contain",
              margin: "0 auto 16px",
              borderRadius: 12,
            }}
          />
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
            {error.message || "Unexpected application error"}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: 0,
              borderRadius: 999,
              padding: "8px 16px",
              background: "#0a66c2",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

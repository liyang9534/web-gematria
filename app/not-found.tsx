export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            alignItems: "center",
            background: "#08080d",
            color: "#ffffff",
            display: "flex",
            fontFamily:
              'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            minHeight: "100vh",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <section style={{ maxWidth: "480px", textAlign: "center" }}>
            <p
              style={{
                color: "#fcd34d",
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: 1,
                margin: "0 0 16px",
              }}
            >
              404
            </p>
            <h1 style={{ fontSize: "28px", margin: "0 0 12px" }}>
              Page not found
            </h1>
            <p
              style={{
                color: "#d4d4d8",
                fontSize: "16px",
                lineHeight: 1.7,
                margin: "0 0 28px",
              }}
            >
              This page is outside the current reading path. Return home to
              decode another number.
            </p>
            <a
              href="/"
              style={{
                background: "#fcd34d",
                borderRadius: "8px",
                color: "#09090b",
                display: "inline-flex",
                fontSize: "14px",
                fontWeight: 700,
                padding: "12px 18px",
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </section>
        </main>
      </body>
    </html>
  );
}

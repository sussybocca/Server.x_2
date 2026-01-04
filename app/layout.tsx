// app/layout.tsx
import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Server.X",
  description: "Create and explore virtual servers in your own browser",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        {/* Full-screen flex container for your app */}
        <div className="flex flex-col h-screen w-screen bg-zinc-900 text-white overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "@bible-strong/avatar-react/styles.css";
import "./globals.css";
import { InteractiveAvatar } from "@/components/ui/InteractiveAvatar";
import FlappyPortfolio from "@/components/FlappyPortfolio";
import { SmoothScrollProvider } from "@/lib/scroll";

const interTight = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  variable: "--font-inter-tight",
  display: "swap",
  weight: "100 900",
});

const instrumentSerif = localFont({
  src: [
    {
      path: "../fonts/InstrumentSerif-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/InstrumentSerif-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: "Jatin Khandelwal — Full Stack Developer",
  description:
    "Personal portfolio of Jatin Khandelwal, Full Stack Developer and IIoT engineering student at GGSIPU USAR. Voice-first platforms, analytics command centers, and satellite road extraction.",
  metadataBase: new URL("https://jatinkhandelwal.dev"),
  openGraph: {
    title: "Jatin Khandelwal — Full Stack Developer",
    description:
      "Full Stack Developer specializing in responsive web applications, voice-first civic platforms, and occlusion-robust geospatial pipelines.",
    url: "https://jatinkhandelwal.dev",
    siteName: "Jatin Khandelwal Portfolio",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Jatin Khandelwal — Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jatin Khandelwal — Full Stack Developer",
    description:
      "Full Stack Developer specializing in responsive web applications, voice-first civic platforms, and occlusion-robust geospatial pipelines.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="antialiased selection:bg-[#0d0d0d] selection:text-[#f4f2ee]"
      >
        <Script
          id="remove-browser-extension-attributes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const knownAttributes = new Set([
                  'bis_skin_checked',
                  'bis_register',
                  'cz-shortcut-listen',
                ]);

                function isExtensionAttribute(name) {
                  return knownAttributes.has(name) || /^__processed_.*__$/i.test(name);
                }

                function cleanElement(element) {
                  Array.from(element.attributes).forEach((attribute) => {
                    if (isExtensionAttribute(attribute.name)) {
                      element.removeAttribute(attribute.name);
                    }
                  });
                }

                function cleanTree(node) {
                  if (!(node instanceof Element)) return;
                  cleanElement(node);
                  node.querySelectorAll('*').forEach(cleanElement);
                }

                cleanTree(document.documentElement);

                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes') {
                      if (isExtensionAttribute(mutation.attributeName || '')) {
                        cleanElement(mutation.target);
                      }
                    } else {
                      mutation.addedNodes.forEach(cleanTree);
                    }
                  });
                });

                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                });
              })();
            `,
          }}
        />
        <SmoothScrollProvider>
          {children}
          <InteractiveAvatar />
          <FlappyPortfolio />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

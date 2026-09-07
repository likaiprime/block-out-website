interface Window {
  gtag: (
    command: "js" | "config" | "event" | "consent",
    targetId: string | Date,
    config?: {
      page_path?: string;
      send_page_view?: boolean;
      [key: string]: unknown;
    },
  ) => void;
  dataLayer: unknown[];
}

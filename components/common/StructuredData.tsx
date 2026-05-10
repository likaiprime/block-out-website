type Json = Record<string, unknown> | unknown[];

export function StructuredData({ data }: { data: Json | Json[] }) {
  const payload = Array.isArray(data) ? data : data;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

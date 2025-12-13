export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout wraps the map page
  // The parent (public) layout already has Header
  // We just pass through the children
  return <div className="h-full">{children}</div>;
}

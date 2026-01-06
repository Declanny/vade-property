// Properties page overrides the parent layout to hide the navbar
// Footer, MobileHeader, and MobileBottomNav are inherited from parent (public) layout
export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


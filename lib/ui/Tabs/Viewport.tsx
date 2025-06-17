export default function Viewport({ children }: { children: React.ReactNode }) {
  return <div className="mx-2 mt-1 mb-2 px-2 py-1 flex-fill border rounded border-secondary d-flex flex-column flex-nowrap">{children}</div>;
}

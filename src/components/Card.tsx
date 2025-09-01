export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 12, padding: 16, boxShadow: "0 4px 14px rgba(0,0,0,.1)" }}>
      {children}
    </div>
  )
}

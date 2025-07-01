"use client"
export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ color: 'red', padding: 32 }}>
      <h2>Une erreur est survenue</h2>
      <pre>{error.message}</pre>
    </div>
  )
} 
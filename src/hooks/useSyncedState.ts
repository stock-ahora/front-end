import { useEffect, useState } from 'react'

export function useSyncedState(initialValue: number, propValue: number) {
  const [state, setState] = useState<number>(initialValue)

  useEffect(() => {
    setState(propValue)
  }, [propValue])

  return [state, setState] as const // Tuple return
}

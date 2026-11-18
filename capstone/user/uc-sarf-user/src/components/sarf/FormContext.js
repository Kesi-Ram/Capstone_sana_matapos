import { createContext, useContext } from 'react'

export const FormContext = createContext(null)

export function useSarf() {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useSarf must be used inside <SarfForm>')
  return ctx
}

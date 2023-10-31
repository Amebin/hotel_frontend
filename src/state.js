import { create } from 'zustand'

const globalState = create((set) => {
  return {
    loading: false,
    setLoading: (value) => set((state) => ({ loading: value }))
  }
})

export default globalState
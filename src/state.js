/**
 * https://refine.dev/blog/zustand-react-state/#getting-started-with-zustand
 * zustand es una de las distintas alternativas disponibles en React para manejar estados globales
 * En este caso creamos un gestor de estados llamado globalState, en el cual podremos configurar
 * distintas variables y métodos para compartirlos entre diversos componentes sin necesidad de pasar props
 */

import { create } from 'zustand'

const globalState = create((set) => {
  return {
    loading: false,
    setLoading: (value) => set((state) => ({ loading: value }))
  }
})

export default globalState
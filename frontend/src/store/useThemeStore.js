import {create} from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('preffered-theme') || 'synthwave',
    setTheme: (theme) => {
        localStorage.setItem('preffered-theme', theme);
         set({theme})}
}))
// frontend/src/lib/capacitor.ts
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { App } from '@capacitor/app'
import { Keyboard } from '@capacitor/keyboard'

export const isNativePlatform = (): boolean => {
    return Capacitor.isNativePlatform()
}

export const getPlatform = (): string => {
    return Capacitor.getPlatform()
}

export const isIOS = (): boolean => {
    return getPlatform() === 'ios'
}

export const isAndroid = (): boolean => {
    return getPlatform() === 'android'
}

export const initializeApp = async (): Promise<void> => {
    if (!isNativePlatform()) {
        console.log('Running in web browser')
        return
    }

    console.log('Initializing native app on:', getPlatform())

    try {
        // Configure Status Bar
        if (isIOS() || isAndroid()) {
            await StatusBar.setStyle({ style: Style.Light })
            await StatusBar.setBackgroundColor({ color: '#10b981' })

            // Show status bar
            await StatusBar.show()
        }
    } catch (error) {
        console.error('StatusBar configuration error:', error)
    }

    try {
        // Hide splash screen after app is ready
        await SplashScreen.hide({
            fadeOutDuration: 300
        })
    } catch (error) {
        console.error('SplashScreen error:', error)
    }

    try {
        // Handle keyboard events
        Keyboard.addListener('keyboardWillShow', (info) => {
            document.body.classList.add('keyboard-open')
            // Adjust scroll position if needed
        })

        Keyboard.addListener('keyboardWillHide', () => {
            document.body.classList.remove('keyboard-open')
        })
    } catch (error) {
        console.error('Keyboard listener error:', error)
    }

    try {
        // Handle back button (Android)
        App.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
                // Show exit confirmation
                if (confirm('Do you want to exit the app?')) {
                    App.exitApp()
                }
            } else {
                window.history.back()
            }
        })

        // Handle app state changes
        App.addListener('appStateChange', ({ isActive }) => {
            console.log('App state changed. Is active:', isActive)
            if (isActive) {
                // App came to foreground
                // Refresh data, check auth, etc.
            } else {
                // App went to background
                // Save state, pause timers, etc.
            }
        })

        // Handle app URL open (deep linking)
        App.addListener('appUrlOpen', (data) => {
            console.log('App opened with URL:', data)
            // Handle deep links
            const url = new URL(data.url)
            const path = url.pathname

            if (path) {
                window.location.href = path
            }
        })
    } catch (error) {
        console.error('App listener error:', error)
    }
}

export const exitApp = (): void => {
    if (isNativePlatform()) {
        App.exitApp()
    }
}

// Helper to handle safe area insets
export const getSafeAreaInsets = () => {
    if (!isNativePlatform()) return { top: 0, bottom: 0, left: 0, right: 0 }

    const style = getComputedStyle(document.documentElement)
    return {
        top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
    }
}

// Haptic feedback helper
export const hapticImpact = async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!isNativePlatform()) return

    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
        const impactStyle = {
            light: ImpactStyle.Light,
            medium: ImpactStyle.Medium,
            heavy: ImpactStyle.Heavy,
        }[style]

        await Haptics.impact({ style: impactStyle })
    } catch (error) {
        console.error('Haptics error:', error)
    }
}

// Vibrate helper
export const vibrate = async (duration: number = 100) => {
    if (!isNativePlatform()) return

    try {
        const { Haptics } = await import('@capacitor/haptics')
        await Haptics.vibrate({ duration })
    } catch (error) {
        console.error('Vibrate error:', error)
    }
}

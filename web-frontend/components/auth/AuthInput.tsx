'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    icon?: React.ReactNode
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full px-4 py-3 rounded-xl
              ${icon ? 'pl-12' : ''}
              bg-white/50 dark:bg-gray-800/50
              border-2 border-gray-200 dark:border-gray-700
              focus:border-primary focus:ring-4 focus:ring-primary/20
              transition-all duration-300
              placeholder:text-gray-400
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-shake">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

AuthInput.displayName = 'AuthInput'

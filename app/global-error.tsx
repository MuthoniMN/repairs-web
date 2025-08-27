'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
                        <p className="text-gray-600 mb-4">An unexpected error occurred. Please try again.</p>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="text-left mb-4 bg-gray-100 p-3 rounded">
                                <summary className="cursor-pointer font-medium">Error Details</summary>
                                <pre className="mt-2 text-xs overflow-auto">
                                    {error.message}
                                    {error.stack}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={reset}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
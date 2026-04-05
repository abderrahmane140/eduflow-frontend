export default function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        </div>
    )
}
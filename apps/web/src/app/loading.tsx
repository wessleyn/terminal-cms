export default function RootSkeleton () {
    return (
        <div className="d-flex h-screen w-full items-center justify-center">
            <svg
                className="h-12 w-12 animate-spin text-gray-200 dark:text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12a10 10 0 1 1 20 0" />
            </svg>
        </div>
    );
}
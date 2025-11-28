function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Something went wrong
      </h1>

      <p className="text-gray-700 mb-4">{error?.message}</p>

      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-primary text-white rounded-lg mt-4 hover:bg-primaryDark transition"
      >
        Try Again
      </button>
    </div>
  );
}

export default ErrorFallback;

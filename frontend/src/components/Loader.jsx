export default function Loader() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">

        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-600 dark:text-gray-300">
          Carregando sistema...
        </p>

      </div>
    </div>
  );
}
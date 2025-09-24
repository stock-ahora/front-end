export default function NotFoundPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center max-w-lg px-6">
                <h1 className="font-bold text-primary text-5xl mb-4">
                    Página no encontrada
                </h1>
                <h2 className="text-slate-600 text-lg mb-6">
                    Lo sentimos, no se ha encontrado algún recurso para el link actual.
                </h2>
                <a
                    href="/"
                    className="inline-block px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-soft transition-transform transform hover:-translate-y-1 bg-primary"
                >
                    Ir a la página principal
                </a>
                <div className="mt-10">
                    <img
                        src="/assets/img/illustrations/404.svg"
                        alt="Página no encontrada"
                        className="mx-auto max-h-64"
                    />
                </div>
            </div>
        </main>
    )
}

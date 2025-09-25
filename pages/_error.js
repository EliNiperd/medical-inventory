import { useRouter } from 'next/router';

function ErrorPage({ statusCode }) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-red-500 mb-4">¡Oops!</h1>
        <h2 className="text-2xl text-gray-800 font-semibold mb-2">
          {statusCode
            ? `Ocurrió un error ${statusCode} en el servidor`
            : 'Ocurrió un error en el cliente'}
        </h2>
        <p className="text-md text-gray-600 mb-6">
          Lamentamos las molestias. Por favor, intenta de nuevo más tarde o revisa tu conexión.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
        >
          Regresar a la página anterior
        </button>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;

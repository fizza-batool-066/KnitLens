import Button from "../components/Button";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <p className="text-6xl font-bold text-pink-400">404</p>
      <h1 className="mt-4 text-3xl font-bold text-brown">This stitch went missing</h1>
      <p className="mt-3 max-w-md text-gray-600">
        The page you are looking for is not in the KnitLens pattern.
      </p>
      <div className="mt-8">
        <Button to="/">Back home</Button>
      </div>
    </div>
  );
}

export default NotFound;

import { getServerByUrl } from "@/lib/server-loader";

export default async function ServerRenderer({ params }) {
  const url = decodeURIComponent(params.url);
  const server = await getServerByUrl(url);

  if (!server) {
    return (
      <div className="h-screen w-screen bg-red-900 text-white flex items-center justify-center">
        <h1 className="text-2xl">Server not found: {url}</h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white p-4">
      <h1 className="text-xl mb-2">{server.name}</h1>
      <pre className="bg-zinc-800 p-2 rounded overflow-auto">
        {JSON.stringify(server.files, null, 2)}
      </pre>
    </div>
  );
}

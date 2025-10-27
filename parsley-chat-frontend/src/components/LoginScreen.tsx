import logo from "../assets/ChatGPT Image Oct 27, 2025, 09_09_33 AM.png";

interface LoginScreenProps {
  username: string;
  connecting: boolean;
  error: string;
  onUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onConnect: () => void;
}


// This is just a placeholder so that I could test that more than one client could connect and recieve the chat history.
// we should refactor everything that i've done so that it has better structure.
export default function LoginScreen({
  username,
  connecting,
  error,
  onUsernameChange,
  onConnect,
}: LoginScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !connecting) {
      onConnect();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="bg-green-900 border-4 border-green-500 rounded-lg p-8 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="Logo" className="w-12 h-12 object-cover rounded-full rotate-45" />
          <h2 className="text-green-300 text-3xl tracking-wider text-center">
            PARSLEY-CHAT TERMINAL
          </h2>
        </div>
        <div className="text-green-400 text-center mb-6 text-lg">
          {">"} SYSTEM READY
        </div>
        <div className="mb-4">
          <label className="text-green-300 text-sm mb-2 block tracking-wider">
            ENTER USERNAME:
          </label>
          <input
            type="text"
            className="w-full bg-black border-2 border-green-500 text-green-300 px-4 py-3 text-lg outline-none focus:border-green-400 transition-colors"
            placeholder="username@terminal"
            value={username}
            onChange={onUsernameChange}
            onKeyDown={handleKeyDown}
            disabled={connecting}
          />
        </div>
        {error && (
          <div className="mb-4 text-red-400 text-sm border border-red-500 bg-red-900 bg-opacity-20 p-3 rounded">
            ERROR: {error}
          </div>
        )}
        {connecting && (
          <div className="mb-4 text-green-400 text-sm text-center">
            {">"} CONNECTING TO SERVER...
          </div>
        )}
        <button
          onClick={onConnect}
          disabled={connecting || !username.trim()}
          className="w-full bg-green-700 hover:bg-green-600 text-black font-bold py-3 px-6 border-2 border-green-400 transition-colors text-xl tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connecting ? "> CONNECTING..." : "> CONNECT"}
        </button>
      </div>
    </div>
  );
}

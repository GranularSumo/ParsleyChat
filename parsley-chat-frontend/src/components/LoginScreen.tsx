import { useEffect } from "react";
import logo from "../assets/ChatGPT Image Oct 27, 2025, 09_09_33 AM.png";
import { useConnectionContext } from "../contexts/ConnectionContext";
import { useNavigate } from 'react-router';


export default function LoginScreen() {

  const connectionContext = useConnectionContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (connectionContext.connected) {
      navigate("/chat");
    }
  }, [connectionContext.connected, navigate])

  function handleConnect() {
    if (connectionContext.username.trim()) {
      connectionContext.connect();
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  function handleUsernameInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    connectionContext.setUsername(value);
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="bg-green-900 border border-green-500 rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="Logo" className="w-12 h-12 object-cover rounded-full rotate-45" />
          <h2 className="text-green-300 text-3xl tracking-wider text-center">
            PARSLEY-CHAT TERMINAL
          </h2>
        </div>

        <div className="mb-4">
          <label className="text-green-300 text-sm mb-2 block tracking-wider">
            ENTER USERNAME:
          </label>
          <input
            type="text"
            className="w-full bg-black border rounded-lg border-green-500 text-green-300 px-4 py-3 text-lg outline-none focus:border-green-400 transition-colors"
            placeholder="username@terminal"
            value={connectionContext.username}
            onChange={handleUsernameInput}
            onKeyDown={handleKeyDown}
          />
        </div>
        {connectionContext.error && (
          <div className="mb-4 text-red-400 text-sm border border-red-500 bg-red-900 bg-opacity-20 p-3 rounded">
            ERROR: {connectionContext.error}
          </div>
        )}
        <button
          onClick={handleConnect}
          disabled={!connectionContext.username.trim()}
          className="w-full bg-green-700 hover:bg-green-600 text-black font-bold py-3 px-6 border rounded-lg border-green-400 transition-colors text-xl tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {"> CONNECT"}
        </button>
      </div>
    </div>
  );
}

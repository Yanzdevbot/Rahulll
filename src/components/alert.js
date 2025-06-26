'use client';

export default function Alert({ message, visible, onClose }) {
    if (!visible) return null;

    return (
        <alert>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-xl shadow-xl w-full max-w-sm flex flex-col items-center m-10">
                    <p className="mb-4">{message}</p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                    OK
                    </button>
                </div>
            </div>
        </alert>
    );
}

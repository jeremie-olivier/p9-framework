import { signIn } from 'next-auth/react';
import { ConnectAndSIWE } from './ConnectAndSIWE';
import { Button } from './ui/Button';

interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthPopup({ isOpen, onClose }: AuthPopupProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        // Only close if clicking the backdrop itself, not its children
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-[400px] space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Sign in to P9 Framework</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full justify-center"
                    >
                        Sign in with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-zinc-900 text-zinc-400">or</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <ConnectAndSIWE />
                    </div>
                </div>
            </div>
        </div>
    );
} 
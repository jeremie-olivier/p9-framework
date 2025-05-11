"use client";

import Link from 'next/link';
import AuthButton from '@/components/SignIn';
import { Button } from '@/components/ui/Button';
import {
  Logomark,
  User,
  More,
  Brain,
} from '@/components/Icons';
import { ConnectAndSIWE } from './ConnectAndSIWE';

export default function Navigation() {
  return (
    <>
      <header className="flex flex-col items-center justify-between py-4 px-2 w-[76px] h-screen fixed top-0 left-0 bg-zinc-900/60 backdrop-blur-md z-50">
        <div className="flex flex-col items-center space-y-6 mt-4">
          <Link
            href="/"
            className="h-10 w-10 flex items-center justify-center"
          >
            <Logomark className="w-full h-full" />
          </Link>
          <nav className="flex flex-col items-center justify-center space-y-4 mt-6">
            <Button size="icon" variant="ghost" asChild>
              <Link href="/assessment">
                <Brain className="w-full h-full" />
              </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild>
              <Link href="/profile">
                <User className="w-full h-full" />
              </Link>
            </Button>
          </nav>
        </div>
        <Button size="icon" variant="ghost" asChild>
          <Link href="/more">
            <More className="w-full h-full" />
          </Link>
        </Button>
      </header>
      <AuthButton />
      <ConnectAndSIWE />

    </>
  );
};

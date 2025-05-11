import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between p-8 pb-20 gap-8 sm:gap-16 sm:p-20">
      <p className="text-center sm:text-left">© {(new Date().getFullYear())} Plebs Network. All Rights Reserved.</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href='/whitepaper.pdf' className="hover:underline">
          Whitepaper
        </Link>
        <Link href='/policy' className="hover:underline">
          Privacy Policy
        </Link>
        <Link href='/terms' className="hover:underline">
          Terms of Service
        </Link>
        <Link href='mailto:support@plebs.net' className="hover:underline">
          Contact
        </Link>
      </div>
    </footer>
  );
}

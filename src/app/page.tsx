import Link from "next/link";
import { ArchetypeGrid } from "@/components/ArchetypeGrid";
import { archetypes } from "@/lib/archetypes";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-12">
        <h2 className="flex flex-col items-center justify-center gap-2 text-[48px] leading-[72px]">
          Discover Your P9 Archetype
        </h2>
        <p>Scientific. Adaptive. Community-driven personality insights—powered by AI.</p>
        <div className="flex gap-4">
          <Button
            asChild
            size="lg"
          >
            <Link
              href="/assessment"
            >
              <span className="z-1">Take the Assessment</span>
              <svg className="z-1" width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12h12.5m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
          >
            <Link
              href="/archetypes"
            >
              <span className="z-1">Explore the Archetypes</span>
              <svg className="z-1" width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12h12.5m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </Link>
          </Button>
        </div>
      </div>

      <div
        className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      >
        <ArchetypeGrid archetypes={archetypes} />
      </div>
    </>
  );
}

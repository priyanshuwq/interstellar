import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-10 md:py-12 px-4 sm:px-6 border-t border-white/5 relative z-10 bg-void">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="font-display text-xl md:text-2xl tracking-[0.3em] text-foreground mb-6 md:mb-8">INTERSTELLAR</h2>

        <p className="font-serif italic text-sm md:text-base text-muted max-w-md mx-auto mb-8 md:mb-12 px-4">
          &quot;Once you&apos;re a parent, you&apos;re the ghost of your children&apos;s future.&quot;
        </p>

        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between w-full font-mono text-[10px] tracking-widest text-muted/50 pt-6 md:pt-8 border-t border-white/5">
          <p>© 2026 LAZARUS MISSIONS</p>
          <p>
            MADE BY <Link href="https://shekhr.dev" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white hover:underline transition-all">Priyanshu</Link>
          </p>
          <p>STATUS: DATA RELAY SECURE</p>
        </div>
      </div>
    </footer>
  );
}

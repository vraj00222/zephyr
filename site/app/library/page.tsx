import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { RevealCell } from "@/components/library/reveal-cell";
import type { ShowcasePaper } from "@/lib/types";

const HAIRLINE = "#e5e0d5";
const INDIGO = "#2e4788";

/* fresh pressings land in data/papers — always read the shelf live */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "The Library — Zéphyr",
    description:
      "Every paper the press has re-set — selected for consequence and novelty.",
  };
}

async function loadPapers(): Promise<ShowcasePaper[]> {
  const dir = path.join(process.cwd(), "data", "papers");
  let files: string[] = [];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  const papers: ShowcasePaper[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      papers.push(
        JSON.parse(await readFile(path.join(dir, f), "utf8")) as ShowcasePaper,
      );
    } catch {
      /* skip corrupt file */
    }
  }
  return papers.sort(
    (a, b) =>
      (b.meta?.importance?.score ?? 0) - (a.meta?.importance?.score ?? 0) ||
      a.title.localeCompare(b.title),
  );
}

function cover(slug: string): { art?: string; svg?: string } {
  const pub = path.join(process.cwd(), "public", "posters");
  if (existsSync(path.join(pub, "art", `${slug}.png`)))
    return { art: `/posters/art/${slug}.png` };
  if (existsSync(path.join(pub, `${slug}.svg`)))
    return { svg: `/posters/${slug}.svg` };
  return {};
}

function MetaStrip({ cells }: { cells: [string, string][] }) {
  return (
    <div
      className="grid grid-cols-3 divide-x border-y"
      style={{ borderColor: HAIRLINE }}
    >
      {cells.map(([label, value]) => (
        <div
          key={label}
          className="min-w-0 px-3 py-2.5"
          style={{ borderColor: HAIRLINE }}
        >
          <p className="font-mono text-[8.5px] tracking-[0.2em] text-mist uppercase">
            {label}
          </p>
          <p className="mt-1 truncate text-[12.5px] text-ink/85">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default async function LibraryPage() {
  const papers = await loadPapers();

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <Nav />

      {/* header */}
      <header className="px-5 pt-36 pb-14 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p
              className="font-mono text-[11px] tracking-[0.28em] uppercase"
              style={{ color: INDIGO }}
            >
              The Library
            </p>
            <h1 className="mt-5 font-serif text-[clamp(3rem,5.5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance">
              The papers the press has{" "}
              <em className="text-cobalt">re&#8209;set</em>.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-mist">
              Selected for consequence, novelty, and how badly the originals
              needed re-setting.
            </p>
          </div>
          <div className="w-full shrink-0 lg:w-[360px]">
            <MetaStrip
              cells={[
                ["Editions", String(papers.length).padStart(2, "0")],
                ["Window", "Pressed today"],
                ["Method", "Editorial"],
              ]}
            />
          </div>
        </div>
      </header>

      {/* grid */}
      <main className="px-5 pb-24 sm:px-8">
        <div
          className="mx-auto grid max-w-6xl grid-cols-1 border-t border-l md:grid-cols-2 lg:grid-cols-3"
          style={{ borderColor: HAIRLINE }}
        >
          {papers.map((p, i) => {
            const { art, svg } = cover(p.slug);
            const kicker =
              p.meta?.field.split("·")[1]?.trim() ?? p.venue;
            return (
              <RevealCell key={p.slug} index={i} className="min-w-0">
                <Link
                  href={`/paper/${p.slug}`}
                  className="group flex h-full flex-col border-r border-b p-6 sm:p-7"
                  style={{ borderColor: HAIRLINE }}
                >
                  <p className="font-mono text-[13px] font-medium tracking-[0.1em] text-cobalt">
                    {String(i + 1).padStart(2, "0")}
                  </p>

                  {/* mini poster cover */}
                  <div
                    className="mt-5 rotate-[0.5deg] border bg-white p-4 shadow-[0_14px_36px_-22px_rgba(22,19,16,0.4)] transition-all duration-500 ease-out-expo group-hover:-translate-y-1.5 group-hover:rotate-0 group-hover:shadow-[0_26px_52px_-24px_rgba(22,19,16,0.5)]"
                    style={{ borderColor: HAIRLINE }}
                  >
                    <p
                      className="truncate font-mono text-[8px] tracking-[0.22em] uppercase"
                      style={{ color: INDIGO }}
                    >
                      {kicker}
                    </p>
                    <h3 className="mt-2 line-clamp-3 font-serif text-[22px] leading-[1.15] font-medium tracking-[-0.01em]">
                      {p.title}
                    </h3>
                    <div className="mt-3.5">
                      {art ? (
                        /* generated art carries its own garbled title band — crop it */
                        <div
                          className="overflow-hidden"
                          style={{ aspectRatio: "1000 / 640" }}
                        >
                          <Image
                            src={art}
                            alt={p.posterCaption ?? p.tldr}
                            width={1000}
                            height={860}
                            unoptimized
                            priority={i < 3}
                            className="h-auto w-full"
                          />
                        </div>
                      ) : svg ? (
                        <Image
                          src={svg}
                          alt={p.tldr}
                          width={1000}
                          height={860}
                          unoptimized
                          className="h-auto w-full"
                        />
                      ) : (
                        <p className="font-serif text-[13px] leading-relaxed text-mist italic">
                          {p.tldr}
                        </p>
                      )}
                    </div>
                    <div
                      className="mt-3.5 border-t pt-2.5"
                      style={{ borderColor: HAIRLINE }}
                    >
                      <p className="text-center font-mono text-[7.5px] tracking-[0.3em] text-mist uppercase">
                        Zéphyr · Pressed by Mistral
                      </p>
                    </div>
                  </div>

                  {/* repeated title, 1kpapers style */}
                  <h2 className="mt-6 font-serif text-[26px] leading-[1.12] font-medium tracking-[-0.015em] text-balance">
                    {p.title}
                  </h2>

                  <div className="mt-auto pt-5">
                    <MetaStrip
                      cells={[
                        ["Published", p.venue],
                        [
                          "Importance",
                          p.meta ? `${p.meta.importance.score}/10` : "—",
                        ],
                        ["Read time", p.readingTime],
                      ]}
                    />
                    <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-cobalt">
                      Read the edition{" "}
                      <span className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </div>
                </Link>
              </RevealCell>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

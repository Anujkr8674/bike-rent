import { cn } from "@/lib/utils";

type RichHtmlContentProps = {
  html: string;
  className?: string;
};

/**
 * Renders Tiptap HTML. Uses Tailwind arbitrary selectors (utilities layer) so lists/headings
 * win over Tailwind preflight (`list-style: none`, `h2 { font-size: inherit }`).
 */
export function RichHtmlContent({ html, className }: RichHtmlContentProps) {
  if (!html?.trim()) return null;
  return (
    <div
      className={cn(
        "rich-html-content max-w-none text-sm leading-relaxed text-zinc-600",
        /* Headings */
        "[&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-zinc-900",
        "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-zinc-900",
        "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-900",
        /* Paragraph spacing */
        "[&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
        "[&_p:empty]:m-0 [&_p:empty]:hidden",
        /* Lists – preflight strips markers without explicit utilities */
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-1 [&_li]:list-item [&_li]:pl-1",
        /* Tiptap wraps list text in <p> – keep marker visible */
        "[&_li>p]:m-0 [&_li>p]:inline",
        "[&_li>p+p]:mt-2 [&_li>p+p]:block",
        "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-500",
        "[&_a]:text-blue-600 [&_a]:underline",
        "[&_strong]:font-semibold [&_strong]:text-zinc-900",
        "[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// 1. Add the tocTree builder in the JS frontmatter
const tocTreeCode = `const tocTree = [];
let currentH2 = null;
headings.filter(h => h.depth <= 3).forEach(h => {
  if (h.depth === 2 || h.depth === 1) {
    currentH2 = { ...h, children: [] };
    tocTree.push(currentH2);
  } else if (h.depth === 3 && currentH2) {
    currentH2.children.push(h);
  } else {
    tocTree.push({ ...h, children: [] });
  }
});`;

c = c.replace('const { Content, headings } = await render(entry);', 'const { Content, headings } = await render(entry);\n\n' + tocTreeCode);

// 2. Replace the TOC rendering
const oldToc = `<nav class="toc">
              <ul class="space-y-3">
                {headings.filter(h => h.depth <= 3).map(h => (
                  <li class={h.depth === 3 ? "pl-4" : ""}>
                    <a href={"#" + h.slug} class="toc-link block text-sm font-medium text-slate-400 hover:text-brand-neon transition-colors border-l-2 border-transparent hover:border-brand-neon pl-3 -ml-[14px]">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>`;

const newToc = `<nav class="toc">
              <ul class="space-y-3">
                {tocTree.map(h2 => (
                  <li>
                    {h2.children.length > 0 ? (
                      <details class="group" open={!h2.text.toUpperCase().includes('FAQ')}>
                        <summary class="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-slate-400 hover:text-brand-neon transition-colors border-l-2 border-transparent hover:border-brand-neon pl-3 -ml-[14px]">
                          <a href={"#" + h2.slug} class="toc-link block flex-grow" onclick="event.stopPropagation();">{h2.text}</a>
                          <svg class="w-3 h-3 transition-transform group-open:rotate-180 text-slate-500 ml-2 shrink-0 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </summary>
                        <ul class="pl-4 mt-2 space-y-2 border-l border-white/5 ml-[2px]">
                          {h2.children.map(h3 => (
                            <li>
                              <a href={"#" + h3.slug} class="toc-link block text-xs font-medium text-slate-500 hover:text-brand-neon transition-colors pl-3 border-l-2 border-transparent hover:border-brand-neon -ml-[2px]">
                                {h3.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <a href={"#" + h2.slug} class="toc-link block text-sm font-medium text-slate-400 hover:text-brand-neon transition-colors border-l-2 border-transparent hover:border-brand-neon pl-3 -ml-[14px]">
                        {h2.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <style>
              details > summary::-webkit-details-marker {
                display: none;
              }
            </style>`;

c = c.replace(oldToc, newToc);

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('TOC replaced!');

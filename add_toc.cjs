const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// 1. Add headings to the render call
c = c.replace(/const \{ Content \} = await render\(entry\);/, 'const { Content, headings } = await render(entry);');

// 2. Add TOC to sidebar and make it sticky
const sidebarOld = `<div class="space-y-8">`;
const sidebarNew = `<div class="space-y-8 sticky top-24">
        <!-- TOC -->
        {headings && headings.length > 0 && (
          <div class="bg-brand-dark border border-white/5 p-6 rounded-xl hidden lg:block">
            <h3 class="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase mb-4 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
              目录导航
            </h3>
            <nav class="toc">
              <ul class="space-y-3">
                {headings.filter(h => h.depth <= 3).map(h => (
                  <li class={h.depth === 3 ? "pl-4" : ""}>
                    <a href={"#" + h.slug} class="toc-link block text-sm font-medium text-slate-400 hover:text-brand-neon transition-colors border-l-2 border-transparent hover:border-brand-neon pl-3 -ml-[14px]">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}`;
c = c.replace(sidebarOld, sidebarNew);

// 3. Add client-side script for TOC highlighting
const scriptBlock = `
<script>
  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".toc-link");
    if (links.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => {
            a.classList.remove('text-brand-neon', 'border-brand-neon');
            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.classList.add('text-brand-neon', 'border-brand-neon');
              a.classList.remove('text-slate-400', 'border-transparent');
            } else {
              a.classList.add('text-slate-400', 'border-transparent');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -80% 0px' });
    
    document.querySelectorAll('.brand-content-rendered h2, .brand-content-rendered h3').forEach(h => {
      if (h.id) observer.observe(h);
    });
  });
</script>
`;
c = c.replace(/<\/Layout>/, scriptBlock + '\n</Layout>');

// 4. Add CSS to make headings larger
const styleBlock = `
<style is:global>
  .brand-content-rendered h2 {
    font-size: 1.875rem !important; /* text-3xl */
    line-height: 2.25rem !important;
    font-weight: 700 !important;
    color: white !important;
    margin-top: 3rem !important;
    margin-bottom: 1.5rem !important;
    scroll-margin-top: 6rem;
  }
  .brand-content-rendered h3 {
    font-size: 1.5rem !important; /* text-2xl */
    line-height: 2rem !important;
    font-weight: 700 !important;
    color: #f8fafc !important; /* slate-50 */
    margin-top: 2rem !important;
    margin-bottom: 1rem !important;
    scroll-margin-top: 6rem;
  }
  .brand-content-rendered h2::before, .brand-content-rendered h3::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 1em;
    background-color: #38bdf8; /* brand-neon */
    margin-right: 0.75rem;
    vertical-align: -0.15em;
    border-radius: 2px;
  }
</style>
`;
c = c.replace(/<\/Layout>/, styleBlock + '\n</Layout>');

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Updated [slug].astro with TOC and large headings');

const fs = require('fs');
let c = fs.readFileSync('src/pages/brands/[slug].astro', 'utf8');

// Insert floating button before </Layout>
const floatingButton = `
  <!-- Floating Purchase Button -->
  {(brand.purchase?.url || brand.aff) && (
    <div id="floating-purchase" class="fixed bottom-6 right-6 z-50 opacity-0 translate-y-4 pointer-events-none transition-all duration-300">
      <a 
        href={brand.purchase?.url || brand.aff} 
        data-departure-link={brand.purchase?.cloaked !== false ? 'true' : undefined}
        class="flex items-center gap-2 px-6 py-3 bg-brand-neon text-brand-dark font-bold text-sm rounded-full shadow-[0_4px_20px_rgba(56,189,248,0.4)] hover:bg-white hover:shadow-[0_4px_30px_rgba(56,189,248,0.6)] transition-all uppercase tracking-wider"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        购买 {brand.name}
      </a>
    </div>
  )}
`;

c = c.replace('</Layout>', floatingButton + '\n</Layout>');

// Add the scroll show/hide script
const floatingScript = `
<script>
  document.addEventListener("DOMContentLoaded", () => {
    const fab = document.getElementById("floating-purchase");
    if (!fab) return;
    
    let lastScrollY = 0;
    const showThreshold = 600;
    
    const update = () => {
      const y = window.scrollY;
      const atBottom = (window.innerHeight + y) >= (document.body.offsetHeight - 100);
      
      if (y > showThreshold && !atBottom) {
        fab.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
        fab.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
      } else {
        fab.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
        fab.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
      }
      lastScrollY = y;
    };
    
    window.addEventListener("scroll", update, { passive: true });
    update();
  });
</script>
`;

// Insert before </Layout>
c = c.replace('</Layout>', floatingScript + '\n</Layout>');

fs.writeFileSync('src/pages/brands/[slug].astro', c);
console.log('Added floating purchase button');

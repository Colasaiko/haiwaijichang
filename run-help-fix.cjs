const fs = require('fs');
let astro = fs.readFileSync('src/pages/help.astro', 'utf8');

astro = astro.replace(/\{\[\s*\{\s*name:\s*"[\s\S]*?\]\.map\(topic => \(/, '{quickLinks.map(topic => (');
astro = astro.replace(/>([^>]*?&rarr;)</g, '>{routeHelpLinkText}<'); // Wait, there are two of them, one for route, one for scenario. Let's be precise.
astro = astro.replace(/<a href="\/technology"[^>]*>([^<]*)<\/a>/, '<a href="/technology" class="mt-6 block w-full py-2 bg-white/5 text-center text-xs text-slate-400 hover:text-white rounded border border-white/10 transition-colors uppercase tracking-widest">{routeHelpLinkText}</a>');
astro = astro.replace(/<a href="\/use-cases"[^>]*>([^<]*)<\/a>/, '<a href="/use-cases" class="mt-6 block w-full py-2 bg-white/5 text-center text-xs text-slate-400 hover:text-white rounded border border-white/10 transition-colors uppercase tracking-widest">{scenarioHelpLinkText}</a>');

astro = astro.replace(/<h3 class="text-3xl font-bold">[^<]*<\/h3>/, '<h3 class="text-3xl font-bold">{troubleshooting.title}</h3>');
astro = astro.replace(/<p class="text-slate-400 mt-4">[^<]*<\/p>/, '<p class="text-slate-400 mt-4">{troubleshooting.desc}</p>');
astro = astro.replace(/\{\[\s*\{\s*step:\s*"Step 1"[\s\S]*?\]\.map\(item => \(/, '{troubleshooting.steps.map(item => (');

astro = astro.replace(/<h2 class="text-3xl font-bold mb-4">[^<]*<\/h2>/, '<h2 class="text-3xl font-bold mb-4">{contact.title}</h2>');
astro = astro.replace(/<p class="text-slate-400 mb-10 max-w-xl mx-auto">\s*[^<]*\s*<\/p>/, '<p class="text-slate-400 mb-10 max-w-xl mx-auto">\n        {contact.desc}\n      </p>');

fs.writeFileSync('src/pages/help.astro', astro);

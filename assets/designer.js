/* DESIGNER BAR — designer furniture, not the product.
 *
 * A 28px bar injected at the very top of every page: the project name, DESIGN,
 * quick-jumps between the Home directions, the compare index and the review palette. Not one byte of it is written into a page's markup, so there is
 * nothing to strip when porting. Everything below it is the product.
 *
 * The palette is resolved before first paint by the inline head script on each page
 * (?palette=key, then the remembered choice); this file only wires the switcher.
 * There is no theme toggle: the site ships light only, the way travel sites do.
 */
(function () {
    var SRC = (document.currentScript && document.currentScript.src) || '';
    var HOME = [
        ['e-pole-pole.html', 'A · Pole pole'],
        ['c-tanzanite.html', 'B · Tanzanite'],
        ['a-kibao.html', 'C · Kibao']
    ];

    var css = '' +
        '.tn-dbar{position:relative;z-index:1000;height:28px;display:flex;align-items:center;gap:14px;padding:0 14px;' +
        'background:#0f0f0e;color:#9b978d;font:10.5px/1 ui-monospace,"SF Mono",Menlo,monospace;letter-spacing:.08em;' +
        'text-transform:uppercase;overflow-x:auto;scrollbar-width:none;white-space:nowrap}' +
        '.tn-dbar::-webkit-scrollbar{display:none}' +
        '.tn-dbar a{color:#9b978d;text-decoration:none}.tn-dbar a:hover{color:#f3efe6}' +
        '.tn-dbar .tn-b{color:#f3efe6;font-weight:600}.tn-dbar .tn-d{color:#e0a340;border:1px dashed #e0a34088;padding:3px 6px;border-radius:4px}' +
        '.tn-dbar .tn-on{color:#f3efe6;border-bottom:1px solid #e0a340;padding-bottom:2px}' +
        '.tn-dbar .tn-sp{flex:1}.tn-dbar button{font:inherit;letter-spacing:inherit;text-transform:inherit;color:#9b978d;' +
        'background:none;border:1px solid #3a3833;border-radius:4px;padding:3px 8px;cursor:pointer}.tn-dbar button:hover{color:#f3efe6}' +
        '.tn-pal{display:inline-flex;align-items:center;gap:6px}.tn-pal select{font:inherit;letter-spacing:.02em;text-transform:none;color:#f3efe6;' +
        'background:#1c1b19;border:1px solid #3a3833;border-radius:4px;padding:2px 4px;max-width:260px}' +
        '.tn-pal i{width:30px;height:10px;border-radius:2px;box-shadow:0 0 0 1px #3a3833}';

    // Palette switcher. 14 Tanzanian-sourced palettes (assets/palettes.js), each light and dark.
    // "Direction default" removes the attribute so the page's own palette shows.
    function paletteSelect() {
        var list = window.TN_PALETTES || [], cur = document.documentElement.getAttribute('data-palette') || 'default';
        return '<label class="tn-pal"><span>Palette</span><select>' +
            '<option value="default"' + (cur === 'default' ? ' selected' : '') + '>Direction default</option>' +
            list.map(function (p) {
                return '<option value="' + p.key + '"' + (cur === p.key ? ' selected' : '') + '>' + p.name + ' — ' + p.source + '</option>';
            }).join('') + '</select><i></i></label>';
    }

    function swatch(bar) {
        var cur = document.documentElement.getAttribute('data-palette'), i = bar.querySelector('.tn-pal i');
        var p = (window.TN_PALETTES || []).filter(function (x) { return x.key === cur; })[0];
        i.style.background = p ? 'linear-gradient(90deg,' + p.swatch[0] + ' 0 34%,' + p.swatch[1] + ' 34% 67%,' + p.swatch[2] + ' 67%)' : 'transparent';
        i.style.display = p ? 'inline-block' : 'none';
    }

    // Inside the Screens viewer the frame is the product only — no bar.
    if (window.self !== window.top) { return; }

    document.addEventListener('DOMContentLoaded', function () {
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // Paths are resolved from this script's own URL, so the bar works at any depth —
        // a variants/home page or a page deep inside sites/<direction>/.
        var root = SRC.replace(/assets\/designer\.js.*$/, '');
        var rel = location.pathname.slice(location.pathname.indexOf(new URL(root, location.href).pathname) + new URL(root, location.href).pathname.length);
        var site = (rel.match(/^sites\/([a-z-]+)\//) || [])[1];
        var route = site ? rel.replace(/^sites\/[a-z-]+\//, '') : '';
        var here = rel.split('/').pop();
        var SITES = [['pole-pole', 'A · Pole pole'], ['tanzanite', 'B · Tanzanite'], ['kibao', 'C · Kibao']];
        var bar = document.createElement('div');
        bar.className = 'tn-dbar';
        bar.innerHTML = '<a class="tn-b" href="' + root + 'index.html">tanzanianzuri</a><span class="tn-d">Design</span>' +
            (site
                ? SITES.map(function (h) {
                    return '<a href="' + root + 'sites/' + h[0] + '/' + route + location.search + '"' + (h[0] === site ? ' class="tn-on"' : '') + '>' + h[1] + '</a>';
                }).join('') + '<span style="color:#5e5b55">' + (route || 'home') + '</span>'
                : HOME.map(function (h) {
                    return '<a href="' + root + 'variants/home/' + h[0] + location.search + '"' + (here === h[0] ? ' class="tn-on"' : '') + '>' + h[1] + '</a>';
                }).join('')) +
            '<a href="' + root + 'screens.html?p=' + encodeURIComponent(rel) + '">Screens · mobile/tablet/desktop</a>' +
            '<span class="tn-sp"></span>' + paletteSelect();
        document.body.insertBefore(bar, document.body.firstChild);


        swatch(bar);
        bar.querySelector('.tn-pal select').addEventListener('change', function () {
            var v = this.value;
            if (v === 'default') { document.documentElement.removeAttribute('data-palette'); }
            else { document.documentElement.setAttribute('data-palette', v); }
            try { localStorage.setItem('tn-palette', v); } catch (e) { /* not remembered */ }
            swatch(bar);
        });

    });
})();

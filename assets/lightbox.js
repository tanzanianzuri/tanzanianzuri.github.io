/* Photo preview. Any gallery photo (.gal .ph) opens full-size in an overlay with previous / next,
   Escape to close. Product code — ships with the site.
   → In the app: a Stimulus controller; the gallery is a Sulu media collection. */
(function () {
    var css = '.lb{position:fixed;inset:0;z-index:200;background:rgba(8,8,10,.92);display:none;align-items:center;justify-content:center;padding:52px 64px}' +
        '.lb.on{display:flex}.lb img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;box-shadow:0 30px 80px -30px #000}' +
        '.lb button{position:absolute;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);border-radius:50%;width:42px;height:42px;font:20px/1 system-ui;cursor:pointer;display:grid;place-items:center}' +
        '.lb button:hover{background:rgba(255,255,255,.22)}.lb .x{top:14px;right:14px}.lb .p{left:12px;top:50%;transform:translateY(-50%)}.lb .n{right:12px;top:50%;transform:translateY(-50%)}' +
        '.lb .c{position:absolute;left:0;right:0;bottom:14px;text-align:center;color:rgba(255,255,255,.7);font:11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.06em}' +
        '.gal .ph{cursor:zoom-in}@media(max-width:760px){.lb{padding:56px 10px 40px}.lb .p,.lb .n{width:36px;height:36px}}';
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

    var box = document.createElement('div'); box.className = 'lb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Photo');
    box.innerHTML = '<button class="x" aria-label="Close">×</button><button class="p" aria-label="Previous">‹</button><img alt=""><button class="n" aria-label="Next">›</button><div class="c"></div>';
    document.body.appendChild(box);
    var img = box.querySelector('img'), cap = box.querySelector('.c'), set = [], i = 0;

    function show(k) {
        i = (k + set.length) % set.length;
        var src = set[i];
        img.src = src.currentSrc || src.src; img.alt = src.alt || '';
        cap.textContent = (src.alt ? src.alt + ' · ' : '') + (i + 1) + ' / ' + set.length;
        box.classList.add('on'); document.documentElement.style.overflow = 'hidden';
    }
    function close() { box.classList.remove('on'); document.documentElement.style.overflow = ''; }

    document.addEventListener('click', function (e) {
        var ph = e.target.closest('.gal .ph');
        if (ph) {
            e.preventDefault();
            var gal = ph.closest('.gal');
            set = [].map.call(gal.querySelectorAll('.ph img'), function (x) { return x; });
            show([].indexOf.call(gal.querySelectorAll('.ph'), ph));
        }
    });
    box.querySelector('.x').addEventListener('click', close);
    box.querySelector('.p').addEventListener('click', function () { show(i - 1); });
    box.querySelector('.n').addEventListener('click', function () { show(i + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) { close(); } });
    document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('on')) { return; }
        if (e.key === 'Escape') { close(); } else if (e.key === 'ArrowLeft') { show(i - 1); } else if (e.key === 'ArrowRight') { show(i + 1); }
    });
})();

/* Renders Keepo component cards. Prefers the compiled design-system bundle
   (window.<Namespace>) and falls back to transpiling the sibling .jsx files in
   the browser, so every card also renders standalone.

   Usage in a card:
     <script type="text/Keepo-jsx" id="card">
       ({ Button }) => <Button>Ajouter</Button>
     </script>
     <script>KeepoCard(['Button'])</script>
*/
(function () {
  var BABEL_OPTS = { presets: [["react", { runtime: "classic" }]] };

  function findNamespace(names) {
    for (var k in window) {
      try {
        var v = window[k];
        if (
          v &&
          typeof v === "object" &&
          names.every(function (n) {
            return typeof v[n] === "function";
          })
        )
          return v;
      } catch (e) {
        /* cross-origin property, skip */
      }
    }
    return null;
  }

  function basename(n) {
    return n.split("/").pop();
  }

  async function fromSource(names, prelude, extra) {
    var all = (prelude || []).concat(names);
    var sources = await Promise.all(
      all.map(function (n) {
        return fetch(n + ".jsx?v=" + Date.now(), { cache: "no-store" }).then(
          function (r) {
            return r.text();
          },
        );
      }),
    );
    var src = sources
      .join("\n")
      .replace(/^\s*import[^;]+;\s*$/gm, "")
      .replace(/\bexport\s+/g, "");
    var code = window.Babel.transform(src, BABEL_OPTS).code;
    var exported = names.map(basename).concat(extra || []);
    return new Function(
      "React",
      code + "\nreturn {" + exported.join(",") + "};",
    )(window.React);
  }

  function compileRender(source) {
    var code = window.Babel.transform(source, BABEL_OPTS).code.replace(
      /;\s*$/,
      "",
    );
    return new Function("React", "return (" + code + ");")(window.React);
  }

  window.KeepoCard = async function (names, opts) {
    opts = opts || {};
    var host = document.getElementById(opts.mount || "root");
    try {
      var comps =
        (!opts.prelude && findNamespace(names.map(basename))) ||
        (await fromSource(names, opts.prelude, opts.extra));
      var render =
        opts.render ||
        compileRender(
          document.getElementById(opts.source || "card").textContent,
        );
      if (opts.expose) window[opts.expose] = comps;
      window.ReactDOM.createRoot(host).render(
        window.React.createElement(function () {
          return render(comps);
        }),
      );
      setTimeout(function () {
        if (window.lucide) window.lucide.createIcons();
      }, 60);
    } catch (err) {
      host.innerHTML =
        '<pre style="font:12px/1.5 var(--font-mono);color:var(--coral-600);white-space:pre-wrap">' +
        String((err && err.message) || err) +
        "</pre>";
      throw err;
    }
  };
})();

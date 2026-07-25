// Renders the page's x-dc template to an HTML string, outside a browser.
//
// The dc-runtime does this in the DOM at boot. A generated page has to be a file
// somebody can host, and a test has to be able to assert on what a visitor would
// see, so the same template needs a second, static renderer. This is that — not a
// general template engine, just the subset the CV page uses:
//
//   {{ path.to.value }}   in text and in attribute values
//   <sc-if value="{{ x }}">        keep the children when x is truthy
//   <sc-for list="{{ xs }}" as="p">  repeat the children, with $index
//   style="{{ obj }}"     a render-value that is an object becomes inline CSS
//   onClick="{{ fn }}"    dropped: a static file has no handler to bind
//   <image-slot>          becomes an <img>, or its typographic placeholder
//
// Expressions are dotted paths and nothing else — there is no eval here, and no
// arithmetic in the template for there to be.
(function (g) {

  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr']);
  // attributes the dc-runtime reads for its placeholder mode, meaningless in a
  // rendered file
  const RUNTIME_ATTRS = /^(hint-|data-dc-)/;

  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

  // `camelCase` render-value keys to CSS property names, for a style object.
  const cssProp = (k) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
  const styleString = (obj) => Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => cssProp(k) + ':' + v).join(';');

  // A scope is a chain of frames, innermost first, so an sc-for's loop variable
  // shadows nothing and falls through to the render values.
  const lookup = (scopes, path) => {
    const parts = path.split('.');
    for (const scope of scopes) {
      if (scope && Object.prototype.hasOwnProperty.call(scope, parts[0])) {
        let v = scope;
        for (const p of parts) {
          if (v === undefined || v === null) return undefined;
          v = v[p];
        }
        return v;
      }
    }
    return undefined;
  };

  const ONLY_EXPR = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  const ANY_EXPR = /\{\{\s*([^}]+?)\s*\}\}/g;

  // A value used as text. Functions and objects are template plumbing, not copy.
  const asText = (v) => (v === undefined || v === null || typeof v === 'function' ||
    typeof v === 'object') ? '' : String(v);

  function interpolate(str, scopes) {
    return str.replace(ANY_EXPR, (_, expr) => {
      const raw = expr.trim();
      if (raw === 'true') return 'true';
      if (raw === 'false') return 'false';
      return asText(lookup(scopes, raw));
    });
  }

  // A minimal, forgiving tag scanner. The template is hand-written HTML we
  // control, so this does not have to survive the open web — but it does have to
  // leave inline <style>, <script> and <svg> bodies alone.
  const RAW_TEXT = new Set(['style', 'script']);

  function parse(html) {
    const root = { tag: '#root', attrs: {}, children: [] };
    const stack = [root];
    let i = 0;
    const push = (node) => stack[stack.length - 1].children.push(node);

    while (i < html.length) {
      const lt = html.indexOf('<', i);
      if (lt < 0) { push({ text: html.slice(i) }); break; }
      if (lt > i) push({ text: html.slice(i, lt) });

      if (html.startsWith('<!--', lt)) {
        const end = html.indexOf('-->', lt);
        i = end < 0 ? html.length : end + 3;
        continue;
      }
      if (html.startsWith('<!', lt)) {
        const end = html.indexOf('>', lt);
        push({ text: html.slice(lt, end + 1) });
        i = end + 1;
        continue;
      }
      if (html.startsWith('</', lt)) {
        const end = html.indexOf('>', lt);
        const name = html.slice(lt + 2, end).trim().toLowerCase();
        for (let k = stack.length - 1; k > 0; k--) {
          if (stack[k].tag === name) { stack.length = k; break; }
        }
        i = end + 1;
        continue;
      }

      const end = findTagEnd(html, lt);
      const inner = html.slice(lt + 1, html[end - 1] === '/' ? end - 1 : end);
      const sp = inner.search(/[\s/]/);
      const tag = (sp < 0 ? inner : inner.slice(0, sp)).toLowerCase();
      const node = { tag, attrs: parseAttrs(sp < 0 ? '' : inner.slice(sp)), children: [] };
      push(node);
      i = end + 1;

      if (VOID.has(tag) || html[end - 1] === '/') continue;
      if (RAW_TEXT.has(tag)) {
        const close = html.toLowerCase().indexOf('</' + tag, i);
        const stop = close < 0 ? html.length : close;
        node.children.push({ text: html.slice(i, stop), raw: true });
        i = stop < html.length ? html.indexOf('>', stop) + 1 : stop;
        continue;
      }
      stack.push(node);
    }
    return root;
  }

  // `>` inside a quoted attribute value does not close the tag.
  function findTagEnd(html, from) {
    let q = null;
    for (let i = from + 1; i < html.length; i++) {
      const c = html[i];
      if (q) { if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === '>') return i;
    }
    return html.length;
  }

  const ATTR = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  function parseAttrs(s) {
    const out = {};
    // the template uses `style` twice on some elements (a base and a :hover
    // variant); the first one is the real one, so earlier wins
    let m;
    while ((m = ATTR.exec(s))) {
      const k = m[1];
      if (k === '/' || out[k] !== undefined) continue;
      out[k] = m[2] ?? m[3] ?? m[4] ?? '';
    }
    return out;
  }

  function renderNodes(nodes, scopes, out) {
    for (const n of nodes) renderNode(n, scopes, out);
  }

  function renderNode(n, scopes, out) {
    if (n.text !== undefined) {
      out.push(n.raw ? n.text : interpolate(n.text, scopes));
      return;
    }
    if (n.tag === 'sc-if') {
      const v = lookup(scopes, (n.attrs.value || '').replace(ONLY_EXPR, '$1').trim());
      if (v) renderNodes(n.children, scopes, out);
      return;
    }
    if (n.tag === 'sc-for') {
      const list = lookup(scopes, (n.attrs.list || '').replace(ONLY_EXPR, '$1').trim());
      const as = n.attrs.as || 'it';
      (Array.isArray(list) ? list : []).forEach((item, idx) => {
        renderNodes(n.children, [{ [as]: item, $index: idx }, ...scopes], out);
      });
      return;
    }
    if (n.tag === 'image-slot') {
      out.push(renderImageSlot(n, scopes));
      return;
    }
    if (n.tag === '#root') { renderNodes(n.children, scopes, out); return; }

    out.push('<' + n.tag + renderAttrs(n.attrs, scopes) + '>');
    if (VOID.has(n.tag)) return;
    renderNodes(n.children, scopes, out);
    out.push('</' + n.tag + '>');
  }

  function renderAttrs(attrs, scopes) {
    let s = '';
    for (const [k, raw] of Object.entries(attrs)) {
      if (RUNTIME_ATTRS.test(k)) continue;
      // a handler has nothing to bind to in a file
      if (/^on[A-Z]/.test(k) || /^on[a-z]+$/.test(k)) continue;
      const only = raw.match(ONLY_EXPR);
      if (only) {
        const v = lookup(scopes, only[1].trim());
        if (v === undefined || v === null || v === false || typeof v === 'function') continue;
        if (typeof v === 'object') {
          const css = styleString(v);
          if (css) s += ' ' + k + '="' + escAttr(css) + '"';
          continue;
        }
        s += ' ' + k + '="' + escAttr(v) + '"';
        continue;
      }
      s += ' ' + k + '="' + escAttr(interpolate(raw, scopes)) + '"';
    }
    return s;
  }

  // <image-slot> is a custom element the browser upgrades. A static file gets the
  // same two states it has: the image when there is one, the typographic
  // placeholder when there is not.
  function renderImageSlot(n, scopes) {
    const get = (k) => {
      const raw = n.attrs[k];
      if (raw === undefined) return '';
      const only = raw.match(ONLY_EXPR);
      const v = only ? lookup(scopes, only[1].trim()) : interpolate(raw, scopes);
      return (v === undefined || v === null || typeof v === 'object') ? '' : String(v);
    };
    const src = get('src'), style = get('style'), fit = get('fit') || 'contain';
    const label = get('placeholder');
    if (src) {
      return '<img src="' + escAttr(src) + '" alt="' + escAttr(label) +
        '" loading="lazy" style="' + escAttr(style + ';object-fit:' + fit) + '">';
    }
    // the placeholder the page already falls back to: the name, set small
    return '<span style="' + escAttr(style +
      ';display:flex;align-items:center;font-family:\'Bricolage Grotesque\';' +
      'font-weight:600;font-size:15px;letter-spacing:-.01em;color:oklch(0.42 0.05 152)') +
      '">' + esc(label) + '</span>';
  }

  // Splits the template into the <helmet> block, which belongs in <head>, and the
  // body markup.
  function splitTemplate(templateHtml) {
    const open = templateHtml.indexOf('<helmet>');
    const close = templateHtml.indexOf('</helmet>');
    if (open < 0 || close < 0) return { helmet: '', body: templateHtml };
    return {
      helmet: templateHtml.slice(open + '<helmet>'.length, close),
      body: templateHtml.slice(0, open) + templateHtml.slice(close + '</helmet>'.length),
    };
  }

  // The x-dc element's own markup, lifted out of a full index.html.
  function extractTemplate(indexHtml) {
    const open = indexHtml.indexOf('<x-dc>');
    const close = indexHtml.lastIndexOf('</x-dc>');
    if (open < 0 || close < 0) throw new Error('no <x-dc> template in that page');
    return indexHtml.slice(open + '<x-dc>'.length, close);
  }

  // Renders template markup against render values. Returns the two halves so a
  // caller can assemble a page around them.
  function renderTemplate(templateHtml, vals) {
    const { helmet, body } = splitTemplate(templateHtml);
    const out = [];
    renderNodes(parse(body).children, [vals], out);
    return { head: helmet, body: out.join('') };
  }

  g.CV_RENDER = {
    renderTemplate, extractTemplate, splitTemplate,
    // exported for tests and for the download assembler in a later ticket
    parse, interpolate, styleString,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);

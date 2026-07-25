// One call: a profile document in, a complete page out.
//
// This is the join between the profile document, the page template and the static
// renderer. A later ticket makes the output self-contained — inlining the runtime
// and the globe's geometry so the file opens over file:// — but the join belongs
// here, and it is already the single call tests assert against.
(function (g) {

  const { profileRenderVals, migrateProfile } = g.CV_PROFILE;
  const { renderTemplate, extractTemplate } = g.CV_RENDER;

  const escAttr = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // A page's own <title> and description. The visitor's name comes first so a
  // browser tab and a search result show them, not the template's author.
  function metaFor(doc) {
    const id = doc.identity || {};
    const title = [id.name, id.headline].filter(Boolean).join(' — ') || 'Profile';
    const description = id.summary || id.about || '';
    return { title, description };
  }

  // Every revealed element on the page starts at opacity 0 and is brought in by
  // the runtime's IntersectionObserver. A generated page does not carry that
  // observer yet, so without this override the file renders correct markup that
  // nobody can read. The override is deliberately narrow and is what a later
  // ticket drops once the runtime is inlined and the motion is real again.
  const REVEAL_OVERRIDE =
    '<style>/* No reveal observer in a generated file yet: show what it says. */\n' +
    '[data-reveal]{opacity:1 !important;transform:none !important;transition:none !important}\n' +
    '</style>\n';

  // opts: { template, strings, lang?, vw?, now? }
  //   template — the markup of the <x-dc> element, or a whole index.html
  //   strings  — the i18n blocks, i.e. window.CV_I18N
  function renderProfilePage(doc, opts) {
    const d = migrateProfile(doc);
    const template = (opts.template || '').includes('<x-dc>')
      ? extractTemplate(opts.template)
      : opts.template;

    const vals = profileRenderVals(d, opts.strings, {
      vw: opts.vw, now: opts.now,
    });
    const { head, body } = renderTemplate(template, vals);
    const { title, description } = metaFor(d);
    const code = (d.settings || {}).lang || 'en';
    const htmlLang = code === 'en' ? 'en-GB' : code;

    return '<!DOCTYPE html>\n' +
      '<html lang="' + escAttr(htmlLang) + '">\n' +
      '<head>\n' +
      '<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>' + escAttr(title) + '</title>\n' +
      (description ? '<meta name="description" content="' + escAttr(description) + '">\n' : '') +
      head + REVEAL_OVERRIDE +
      '</head>\n<body>\n' + body + '\n</body>\n</html>\n';
  }

  g.CV_GENERATE = { renderProfilePage, metaFor };
})(typeof globalThis !== 'undefined' ? globalThis : window);

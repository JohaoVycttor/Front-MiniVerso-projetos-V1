# Frontend integration

The root project is the runnable application. Run its dev/build commands; the two received source folders remain reference copies.

- Front-MiniVerso-projetos-V1-main: the six base portfolio projects and the projects grid were already present in the root application. The merge checks IDs and slugs instead of creating duplicate projects. Original informational routes are served by the existing /o-estudio and /solucoes aliases; additional CMS info pages use app/[page]/page.js.
- Front-MiniVerso-projetos-V1-feat-pagina-laboratorio-quimica: the chemistry content, heading, year, background, gallery, highlights, presentation duration, shared dialog player and next-project navigation are integrated into the existing registered detail blocks. New assets are namespaced under public/imported.

The chemistry page is /projetos/laboratorio-virtual-de-quimica. The featured preview on /projetos links to it. Header/footer, animations and responsive styles are shared with the root application. The chemistry page is editable under /admin > integrated portfolio > complete project page.

Data migration uses lib/import-miniverso.cjs. Run node scripts/integrate-miniverso-sources.cjs for a read-only preview, or pass --apply to merge. Existing project.detail overrides take precedence, so repeating the import does not reset CMS edits. The three custom projects already in the root database are retained.

The source folders contain placeholder presentation/gallery entries and no actual presentation video. Set the media URL, poster and duration in the admin editor when files are available. Video playback uses the shared native video dialog; missing sources show the existing configurable unavailable-media message.

Verification: node scripts/cms-contract-qa.cjs; node scripts/import-integration-qa.cjs; next build. See CMS-BACKEND.md for the external backend contract; that connection still requires service configuration.

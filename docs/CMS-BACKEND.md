# Editable website and backend contract

All public routes read content through lib/db.js. The current administrative interface is /admin; its existing session authentication protects /api/admin/content. UI components render registered content blocks. New component types require a renderer and validation; arbitrary executable HTML/JS is not accepted as content.

## Editable documents

- home: ordered sections; hero, text, cards, projects, services, process, contact and CTA; layout variants, colors, images and form copy.
- site: brand, shared header/footer, links, page titles/descriptions and card interactions. Header has transparentTop, background, scrolledBackground, scrollThreshold and sticky. interactions has cardHover and cardEntrance.
- studio: ordered sections, images, text, cards, layout, spacing and visibility.
- solutions: catalog cards, comparison rows, process steps and contact banners, including image position and flipImage.
- contactPage: background, sections, channels, form labels and response messages.
- portfolio: list-page sections, categories, component copy, media and projects. Each project.detail controls its complete page: background, overlay, animations and ordered blocks (hero, media, facts, story, benefits, gallery, next, contact, text). Blocks support columns, stacked and centered layouts, visibility and editable items.

GET /api/admin/content returns these documents with fallback values populated. PUT /api/admin/content accepts {"type":"site","content":{...}} (or another document name above), validates it and persists it. Invalid data returns 400; unauthenticated requests return 401. Existing POST/DELETE endpoints maintain the legacy services/projects lists. Media fields accept local or HTTP(S) URLs; files must already exist at those URLs. File upload/storage is a separate backend responsibility.

## Connect an external backend

Without configuration, persistence uses atomic writes to data/content.json. To switch all reads and writes to your backend, set server environment variables:

CONTENT_API_URL=https://your-backend.example/content
CONTENT_API_TOKEN=your-server-only-token

Restart the server after changing environment variables. The browser continues using the existing authenticated Next.js API; the token is never sent to the browser. Do not use NEXT_PUBLIC variables for these values.

The backend URL must support:

1. GET: return the complete content document, in the same shape as data/content.json. Optional ETag header enables conflict detection.
2. PUT: accept the complete updated document as JSON; persist it atomically and return any successful 2xx response. If the GET provided ETag, writes include If-Match. Return 409 or 412 when the revision has changed.
3. If CONTENT_API_TOKEN is set, accept Authorization: Bearer <token>.

Requests have a 10-second timeout. Remote errors are propagated; they never fall back to overwriting local content. Mutations are serialized inside each Next.js process. For multiple application instances, backend ETags and atomic persistence are required to prevent lost updates.

No external backend has been configured by this change. The current site keeps using local persistence until CONTENT_API_URL is supplied.

## Verification

Run the existing build and: node scripts/cms-contract-qa.cjs
The contract check validates persisted/default documents, editable configurations and media URL rejection, and simulates remote persistence with ETag conflict detection without contacting a backend or changing live content.

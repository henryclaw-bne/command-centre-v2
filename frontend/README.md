Design system & UI boilerplate for Command Centre v2.

Setup

1. From `frontend` run:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

Notes

- This scaffolding uses Tailwind CSS. If `npm install` hasn't been run, `@tailwind` directives are present in `app/globals.css` but styles won't compile.
- Components live in `components/` and the global layout now uses `AppShell`.
- Recommended packages added to `package.json`: `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, `@tanstack/react-table`.

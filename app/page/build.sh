rm -rf ../../docs
npx tsc -b
npx shadcn build -o ../shadcn
npx vite build
cd ../browser-extension
pnpm dlx shadcn@latest add --overwrite ../shadcn/data-viewer-app.json

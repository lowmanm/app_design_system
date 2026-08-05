// This package has no runtime TypeScript API: `node build.mjs` reads
// ../tokens/dist/json/*.json and writes a plain CommonJS/ESM Tailwind preset
// to dist/preset.{cjs,mjs} - see README.md. Consume it from a Tailwind v3
// config with:
//
//   module.exports = {
//     presets: [require('@app-design-system/tailwind-preset')],
//     content: [...],
//   };
export {};

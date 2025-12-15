// next.config.mjs
const nextConfig = {
  //output: 'standalone',
  output: undefined, // ✅ fuerza a Next.js a NO usar standalone
  // Configuración más específica para el tracing
  experimental: {
    externalDir: true,
    outputFileTracingRoot: process.cwd(),
    serverComponentsExternalPackages: ['tesseract.js'],
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto'],
    },
    outputFileTracingExcludes: {
      '*': ['node_modules/@swc/core', 'node_modules/@next/swc'],
    },
  },

  // Excluir específicamente el problema de tracing

  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppression de 'output: export' pour permettre les routes API dynamiques
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // Configuration pour les domains externes (UploadThing)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;

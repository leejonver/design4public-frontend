/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ftuudbxhffnbzjxgqagp.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
        // Image optimization settings
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp'],
    },
};

export default nextConfig;

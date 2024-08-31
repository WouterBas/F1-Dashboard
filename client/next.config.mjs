/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/static/images/**",
      },
      {
        protocol: "https",
        hostname: "api.f1-dashboard.app",
        port: "",
        pathname: "/static/images/**",
      },
    ],
  },
};

export default nextConfig;

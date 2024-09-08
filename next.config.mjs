import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript:{
        ignoreBuildErrors: true,
    },
    eslint:{
        ignoreDuringBuilds: true,
    },
};

export default withSentryConfig(nextConfig, {
    org: "ritika-4c",
    project: "javascript-nextjs",

    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
});

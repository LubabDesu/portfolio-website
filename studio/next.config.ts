import type { NextConfig } from "next";

const config: NextConfig = {
    serverExternalPackages: ["@huggingface/transformers"],
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            sharp$: false,
            "onnxruntime-node$": false,
        };
        return config;
    },
};

export default config;

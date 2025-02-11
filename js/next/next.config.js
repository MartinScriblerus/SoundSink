const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand({ parsed: { ...process.env } });

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, options) {
    const { isServer } = options;




    if (!isServer) {
      config.devtool = 'source-map'; // Enables source maps for client-side code
    }


    // config.module.rules.push({
    //   test: /tune\.js$/,
    //   use: 'ignore-loader', // Tells Webpack to ignore this file
    // });


    config.cache = {
      type: 'filesystem', // This can help with performance and reduce some warnings
    };
    config.devtool = 'source-map'; 

    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            swcMinify: true,  // Enable SWC minification
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });

    return config;
  },

  // Add custom headers
  async headers() {
    return [
      {
        // Specify the path or pattern for which you want to set headers
        source: "/:path*", // Apply to all paths
        headers: [
          {
            key: "Cache-Control",
            value: "max-age=3600, must-revalidate", // Adjust the max-age as needed
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
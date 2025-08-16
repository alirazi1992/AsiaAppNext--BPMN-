/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
};
const nextConfig = {
  experimental: {
    dynamicImport: true,
    useFileSystemPublicRoutes: false,
  },
  env: {
    API_URL: process.env.API_URL,
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm)$/, // انواع فایل‌های باینری
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]', // نام فایل خروجی
                },
            },
        ],
    },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};
// export default nextConfig

module.exports = nextConfig;

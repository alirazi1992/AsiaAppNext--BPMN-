const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',],
  theme: {
    extend: {},
    direction: {
      'rtl': 'rtl',
      'ltr': 'ltr',
    },
  },
  plugins: [],
  fontFamily: {
    IranSans: ['IranSans'],
    EnUltraLight: ['EnUltraLight'],
    EnThin: ['EnThin'],
    EnRegular: ['EnRegular'],
    EnMedium: ['EnMedium'],
    EnLight: ['EnLight'],
    EnHeavy: ['EnHeavy'],
    EnExtraBold: ['EnExtraBold'],
    EnExtraBlack: ['EnExtraBlack'],
    EnDemiBold: ['EnDemiBold'],
    EnBold: ['EnBold'],
    EnBlack: ['EnBlack'],
    FaUltraLight: ['FaUltraLight'],
    FaThin: ['FaThin'],
    FaRegular: ['FaRegular'],
    FaMedium: ['FaMedium'],
    FaLight: ['FaLight'],
    FaHeavy: ['FaHeavy'],
    FaExtraBold: ['FaExtraBold'],
    FaExtraBlack: ['FaExtraBlack'],
    FaDemiBold: ['FaDemiBold'],
    FaBold: ['FaBold'],
    FaBlack: ['FaBlack'],

  }

});
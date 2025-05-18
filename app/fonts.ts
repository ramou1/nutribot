import localFont from 'next/font/local';

export const effra = localFont({
  src: [
    {
      path: '../public/fonts/Effra-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Effra-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Effra-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Effra-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Effra-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/Effra-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/Effra-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/Effra-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Effra-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/Effra-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/Effra-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/Effra-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/Effra-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../public/fonts/Effra-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../public/fonts/Effra-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/fonts/Effra-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: '--font-effra',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

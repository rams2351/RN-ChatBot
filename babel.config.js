module.exports = api => {
  const environment = api.env();

  const moduleResolverPlugin = [
    'module-resolver',
    {
      root: ['./'],
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      alias: {
        '@assets': './src/assets',
        '@types': './src/types',
        '@utils': './src/utils',
        '@custom-components': './src/components',
        '@screens': './src/screens',
        '@services': './src/services/',
      },
    },
  ];

  const inlineImportPlugin = [
    'babel-plugin-inline-import',
    {
      extensions: ['.svg'],
    },
  ];

  const plugins = [
    'react-native-reanimated/plugin',
    inlineImportPlugin,
    moduleResolverPlugin,
  ];

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ...plugins,
    ],
  };
};

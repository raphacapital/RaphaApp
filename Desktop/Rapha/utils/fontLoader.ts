import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'NeueHaasDisplayRoman': require('../components/fonts/NeueHaasDisplayRoman.ttf'),
    'NeueHaasDisplayMediu': require('../components/fonts/NeueHaasDisplayMediu.ttf'),
    'NeueHaasDisplayBold': require('../components/fonts/NeueHaasDisplayBold.ttf'),
    'NeueHaasDisplayLight': require('../components/fonts/NeueHaasDisplayLight.ttf'),
    'NeueHaasDisplayThin': require('../components/fonts/NeueHaasDisplayThin.ttf'),
  });
};

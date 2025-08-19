import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'NeueHaasDisplayRoman': require('../assets/fonts/NeueHaasDisplayRoman.ttf'),
    'NeueHaasDisplayMediu': require('../assets/fonts/NeueHaasDisplayMediu.ttf'),
    'NeueHaasDisplayBold': require('../assets/fonts/NeueHaasDisplayBold.ttf'),
    'NeueHaasDisplayLight': require('../assets/fonts/NeueHaasDisplayLight.ttf'),
    'NeueHaasDisplayThin': require('../assets/fonts/NeueHaasDisplayThin.ttf'),
  });
};

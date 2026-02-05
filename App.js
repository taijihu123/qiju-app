import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HousingProvider } from './src/contexts/HousingContext';
import { UserProvider } from './src/contexts/UserContext';
import MainNavigator from './src/app/navigation/MainNavigator';
import { theme } from './src/common/styles/theme';

// 应用入口，包裹上下文提供者和导航容器
export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <HousingProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </HousingProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

import {Text} from '@custom-components/Text';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatScreen from '@screens/ChatScreen';
import Welcome from '@screens/Welcome';
import {useDatabase} from '@services/Database';
import {IUser} from '@types';
import React, {useCallback} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <StatusBar translucent barStyle={'dark-content'} />
      <AppNavigation />
    </SafeAreaView>
  );
};

export default App;

const AppNavigation: React.FC = () => {
  const [user, setUser] = useDatabase<IUser | undefined>('userData');

  const logoutUser = useCallback(() => {
    setUser({} as any);
  }, []);

  return (
    <NavigationContainer>
      {user && user.email ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Chat"
            options={{
              headerShown: true,
              headerRight(props) {
                return (
                  <TouchableOpacity activeOpacity={0.8} onPress={logoutUser}>
                    <Text>Logout</Text>
                  </TouchableOpacity>
                );
              },
            }}
            component={ChatScreen}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="Welcome"
            component={Welcome}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
  },
});

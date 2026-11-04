import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import BadgerNewsStack from './BadgerNewsStack';
import BadgerPreferencesScreen from '../screens/BadgerPreferencesScreen';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();
function BadgerTabs() {
    return (
        <Tab.Navigator initialRouteName="BadgerNews">
            <Tab.Screen
                name="BadgerNews"
                component={BadgerNewsStack}
                options={({ route }) => ({
                    title: 'News',
                    headerShown: false,
                    tabBarStyle: getFocusedRouteNameFromRoute(route) === 'Article'
                        ? { display: 'none' }
                        : undefined,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="newspaper" color={color} size={size} />
                    ),
                })}
            />
            <Tab.Screen
                name="BadgerPreferences"
                component={BadgerPreferencesScreen}
                options={{
                    title: 'Preferences',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default BadgerTabs;
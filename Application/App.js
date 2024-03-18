import React from 'react';
import Home from './components/Home';
import Games from './components/Games';
import About from './components/About';
import Lectures from './components/Lectures';
import Profile from './components/Profile'
import { Quizes } from './components/Quiz/Quizes';
import { QuizScreen } from './components/Quiz/QuizScreen';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Lectures"
                component={Lectures}
                options={{
                    headerTitle: 'Lectures',
                    headerStyle: {
                        height: 100,
                        backgroundColor: 'blue',
                        borderBottomWidth: 2,
                        borderBottomColor: '#17DAE8',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 24,
                        fontWeight: 'bold',
                        textShadowColor: 'blueviolet',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 5,
                    },
                    headerTitleContainerStyle: {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="Quizes"
                component={Quizes}
                options={{
                    headerTitle: 'Quizes',
                    headerStyle: {
                        height: 100,
                        backgroundColor: 'blue',
                        borderBottomWidth: 2,
                        borderBottomColor: '#17DAE8',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 24,
                        fontWeight: 'bold',
                        textShadowColor: 'blueviolet',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 5,
                    },
                    headerTitleContainerStyle: {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="QuizScreen"
                component={QuizScreen}
                options={{
                    headerTitle: 'Quiz',
                    headerStyle: {
                        height: 100,
                        backgroundColor: 'blue',
                        borderBottomWidth: 2,
                        borderBottomColor: '#17DAE8',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 24,
                        fontWeight: 'bold',
                        textShadowColor: 'blueviolet',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 5,
                    },
                    headerTitleContainerStyle: {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    headerTitleAlign: 'center',
                }}
            />
        </Stack.Navigator>
    );
}


export default function Navigate() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: 'purple',
                    tabBarStyle: { backgroundColor: 'black' },
                }}
            >
                <Tab.Screen
                    name='HomeStack'
                    component={HomeStack}
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <Ionicons name='home' size={20} color={color} />,
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name='Games'
                    component={Games}
                    options={{
                        title: 'Games',
                        tabBarIcon: ({ color }) => <Ionicons name='game-controller' size={20} color={color} />,
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name='About'
                    component={About}
                    options={{
                        title: 'About',
                        tabBarIcon: ({ color }) => <Ionicons name='settings' size={20} color={color} />,
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name='Profile'
                    component={Profile}
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color }) => <Ionicons name='person' size={20} color={color} />,
                        headerShown: false,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

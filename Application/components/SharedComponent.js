import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Font from 'expo-font';

const SharedComponent = ({ children }) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadFonts = async () => {
        await Font.loadAsync({
            'Anta': require('../assets/fonts/Anta/Anta-Regular.ttf')
        });
        setFontsLoaded(true);
    };

    useEffect(() => {
        const loadAsyncData = async () => {
            await loadFonts();
            setIsLoading(false);
        };

        loadAsyncData();
    }, []);

    if (!fontsLoaded || isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Loading fonts...</Text>
            </View>
        );
    }

    return children;
};

export default SharedComponent;

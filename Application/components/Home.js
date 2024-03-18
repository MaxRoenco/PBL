import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import Header from './header';
import { Loading } from './Loading';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const fetchPost = () => {
        setIsLoading(true);
        setCourses([
            { text: 'HTML', key: '1', image: require('../assets/html.png') },
            { text: 'CSS', key: '2', image: require('../assets/css.png') },
            { text: 'JavaScript', key: '3', image: require('../assets/js.png') },
            { text: 'Python', key: '4', image: require('../assets/python.png') },
        ]);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchPost();
        loadFonts();
    }, []);

    const navigateToLectures = (course) => {
        navigation.navigate('Lectures', { course });
    }

    const loadFonts = async () => {
        if (!fontsLoaded) {
            await Font.loadAsync({
                'Anta': require('../assets/fonts/Anta/Anta-Regular.ttf')
            });
            setFontsLoaded(true);
        }
    }

    if (!fontsLoaded || isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <View style={styles.container}>
            <Header text='List of courses' />
            <ScrollView style={styles.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                <View style={styles.content}>
                    {courses.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.box} onPress={() => navigateToLectures(item)}>
                            <Image source={item.image} style={styles.image} />
                            <Text style={styles.text}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: '#448aff',
    },
    contentScroll: {
        width: '100%',
        flex: 1
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 30,
        width: '70%',
        marginVertical: 10,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'blueviolet',
        borderRadius: 15,
    },
    text: {
        textAlign: 'center',
        color: 'white',
        marginLeft: 10,
        fontFamily: 'Anta',
    },
    image: {
        width: 50,
        height: 50,
    },
    email: {
        padding: 20,
    },
});

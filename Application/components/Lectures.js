import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { gStyle } from '../styles/styles';
import { Loading } from './Loading';
import { Quizes } from './Quiz/Quizes';
import { useNavigation } from '@react-navigation/native';

export default function Lectures({ route }) {
    const { course } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [lecturesList, setLecturesList] = useState([]);
    const navigation = useNavigation();

    const selectedCourse = lecturesList.find(item => item.key === course.text);

    const fetchPost = () => {
        setIsLoading(true);
        setLecturesList([
            { key: 'HTML', items: ['lesson 1', 'lesson 2', 'lesson 3', 'lesson 4', 'lesson 5'] },
            { key: 'CSS', items: ['lesson 1', 'lesson 2', 'lesson 3', 'lesson 4', 'lesson 5'] },
            { key: 'JavaScript', items: ['lesson 1', 'lesson 2', 'lesson 3', 'lesson 4', 'lesson 5'] },
            { key: 'Python', items: ['lesson 1', 'lesson 2', 'lesson 3', 'lesson 4', 'lesson 5'] },
        ]);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    useEffect(fetchPost, []);

    const handleQuizesPress = () => {
        navigation.navigate('Quizes', { course });
    };

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <View style={gStyle.container} >
            <ScrollView style={gStyle.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                <View style={styles.content}>
                    {selectedCourse && selectedCourse.items.map((lecture, index) => (
                        <TouchableOpacity key={index} style={gStyle.boxes}>
                            <Text style={gStyle.text}>{lecture}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={gStyle.boxes} onPress={handleQuizesPress}>
                        <Text style={gStyle.text}>Quizes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Anta',
    },
});

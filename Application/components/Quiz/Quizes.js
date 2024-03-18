import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { gStyle } from "../../styles/styles";
import { Loading } from "../Loading";
import { useNavigation } from '@react-navigation/native';

export const Quizes = ({ route }) => {
    const [listOfQuizes, setListOfQuizes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { course } = route.params;
    const navigation = useNavigation();

    const fetchPost = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setListOfQuizes([
            { key: 'HTML', items: ['quiz 1', 'quiz 2', 'quiz 3', 'quiz 4', 'quiz 5', 'quiz 6', 'quiz 7', 'quiz 8', 'quiz 9', 'quiz 10'] },
            { key: 'CSS', items: ['quiz 1', 'quiz 2', 'quiz 3', 'quiz 4', 'quiz 5', 'quiz 6', 'quiz 7', 'quiz 8', 'quiz 9', 'quiz 10'] },
            { key: 'JavaScript', items: ['quiz 1', 'quiz 2', 'quiz 3', 'quiz 4', 'quiz 5', 'quiz 6', 'quiz 7', 'quiz 8', 'quiz 9', 'quiz 10'] },
            { key: 'Python', items: ['quiz 1', 'quiz 2', 'quiz 3', 'quiz 4', 'quiz 5', 'quiz 6', 'quiz 7', 'quiz 8', 'quiz 9', 'quiz 10'] },
        ]);
        setIsLoading(false);
    };

    const selectedCourse = listOfQuizes.find(item => item.key === course.text);

    const handleQuizPress = (quiz) => {
        navigation.navigate('QuizScreen', { course, quiz });
    }

    useEffect(() => {
        fetchPost();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (!selectedCourse) {
        return (
            <View style={gStyle.container}>
                <Text>No quizzes found for this course.</Text>
            </View>
        );
    }

    return (
        <View style={gStyle.container}>
            <ScrollView style={gStyle.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                <View style={gStyle.content}>
                    {selectedCourse && selectedCourse.items.map((quiz, index) => (
                        <TouchableOpacity key={index} style={gStyle.boxes} onPress={() => handleQuizPress(quiz)}>
                            <Text style={gStyle.text}>{quiz}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

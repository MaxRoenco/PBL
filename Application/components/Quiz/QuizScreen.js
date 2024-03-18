import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, Button } from "react-native";
import { gStyle } from "../../styles/styles";
import { Loading } from "../Loading";
import axios from "axios";

export const QuizScreen = ({ route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState(new Set());
    const { course, quiz } = route.params;

    const fetchPost = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };


    const fetchData = () => {
        axios.get('https://65e30c1688c4088649f53968.mockapi.io/htmlLectures')
            .then(({ data }) => {
                setItems(data);
            })
            .catch(err => {
                console.error(err);
                alert('Error fetching data. Please try again later.');
            });
    };

    useEffect(() => {
        console.log('Course:', course);
        console.log('Quiz:', quiz);
        console.log(selectedAnswers);
        fetchPost();
        fetchData();
    }, []);


    if (isLoading) {
        return <Loading />;
    }

    const filteredItems = items.filter(item => item.course === course.text && item.quiz === quiz);

    const Result = () => {
        let correctCount = 0;

        return (
            <View style={gStyle.container}>
                <ScrollView style={gStyle.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                    <View style={gStyle.content}>
                        {filteredItems.map((item, index) => {
                            const isCorrect = selectedAnswers.has(item.answers[item.correct]);
                            if (isCorrect) {
                                correctCount++;
                            }
                            return (
                                <TouchableOpacity key={index} style={styles.itemContainer}>
                                    <Text style={styles.question}>{item.question}</Text>
                                    {item.answers.map((answer, answerIndex) => (
                                        <Text
                                            key={answerIndex}
                                            style={[
                                                styles.answer,
                                                {
                                                    color:
                                                        selectedAnswers.has(answer) && answerIndex == item.correct
                                                            ? 'green'
                                                            : selectedAnswers.has(answer) && answerIndex != item.correct
                                                                ? 'red'
                                                                : 'white',
                                                },
                                            ]}
                                        >
                                            {answer}
                                        </Text>
                                    ))}
                                    <Text style={styles.correctAnswer}>Correct Answer: {item.answers[item.correct]}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>Number of Correct Answers: {correctCount}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    };




    const handleResult = () => {
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const addArrayOfAnswers = (answer) => {
        const updatedSelectedAnswers = new Set(selectedAnswers);
        updatedSelectedAnswers.add(answer);
        setSelectedAnswers(updatedSelectedAnswers);
    };


    if (filteredItems.length > 0) {
        return (
            <View style={gStyle.container}>
                <ScrollView style={gStyle.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                    <View style={gStyle.content}>
                        {showResult ? (
                            <Result />
                        ) : (
                            <>
                                <View style={styles.itemContainer}>
                                    <Text style={styles.question}>{filteredItems[currentQuestionIndex].question}</Text>
                                    {filteredItems[currentQuestionIndex].answers.map((answer, answerIndex) => (
                                        <TouchableOpacity key={answerIndex} style={styles.answer}
                                            onPress={() => {
                                                addArrayOfAnswers(answer);
                                                if (currentQuestionIndex < filteredItems.length - 1) {
                                                    handleNextQuestion();
                                                    console.log(selectedAnswers);
                                                } else {
                                                    handleResult(selectedAnswers);
                                                }
                                            }}>
                                            <Text>{answer}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button style={styles.button} title="RESULT" onPress={() => handleResult(selectedAnswers)} />
                                    {currentQuestionIndex < filteredItems.length - 1 && (
                                        <Button style={styles.button} title="NEXT" onPress={handleNextQuestion} />
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    } else {
        return (
            <View style={gStyle.container}>
                <ScrollView style={gStyle.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                    <View style={gStyle.content}>
                        <Text>Quiz was not found</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 20,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    answerContainer: {
        marginTop: 10,
    },
    answer: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
    },
    answerText: {
        marginLeft: 20,
    },
    correctAnswer: {
        color: 'green',
        marginLeft: 20,
    },
    wrongAnswer: {
        color: 'red',
        marginLeft: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 300,
        bottom: 0,
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: 'blue',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 30,
    }
});

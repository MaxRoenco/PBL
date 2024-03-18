import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import Header from './header';
import { gStyle } from '../styles/styles'
import { Loading } from './Loading';

export default function About() {
    const [isLoading, setIsLoading] = useState(false);

    const fetchPost = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchPost();
    }, []);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header text='About' />
            <ScrollView style={styles.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                <View style={styles.content}>
                    <Text style={gStyle.text}>It seems like you've entered "Lorem". Is there anything specific you'd like to know or discuss about lorem ipsum text? It's often used as a placeholder or filler text in designs and mockups.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: '#448aff',
    },
    contentScroll: {
        flex: 1,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
});

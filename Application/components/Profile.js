import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Modal, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import Header from './header';
import { gStyle } from '../styles/styles'
import { Ionicons, Fontisto } from '@expo/vector-icons';
import Form from './form';
import { Loading } from './Loading';

export default function About() {
    const [modalWindow, setModalWindow] = useState(false);
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
            <Modal visible={modalWindow} animationType="slide" onRequestClose={() => setModalWindow(false)}>
                <View style={styles.modalwindow}>
                    <Ionicons name='return-up-back' size={50} color={'white'} style={styles.iconclose} onPress={() => setModalWindow(false)} />
                    <Form />
                </View>
            </Modal>
            <Header text='Profile' />
            <ScrollView style={styles.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                <View style={styles.content}>
                    <Text style={gStyle.text}>It seems like you've entered "Lorem". Is there anything specific you'd like to know or discuss about lorem ipsum text? It's often used as a placeholder or filler text in designs and mockups.</Text>
                    <Fontisto name='email' size={100} style={styles.email} onPress={() => setModalWindow(true)} />
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
    modalwindow: {
        flex: 1,
    },
    iconclose: {
        padding: 10
    },
    contentScroll: {
        flex: 1,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
    email: {
        marginTop: 20,
        color: 'white',
    }
});

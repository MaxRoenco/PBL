import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import Header from './header';
import { gStyle } from '../styles/styles';
import { Loading } from './Loading';


export default function Games() {

    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const fetchPost = () => {
        setIsLoading(true);
        const gameList = [
            { title: 'Game 1', id: '1' },
            { title: 'Game 2', id: '2' },
            { title: 'Game 3', id: '3' },
            { title: 'Game 4', id: '4' },
            { title: 'Game 5', id: '5' },
            { title: 'Game 6', id: '6' },
            { title: 'Game 7', id: '7' },
        ];
        setGames(gameList);
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
        <SafeAreaView style={styles.container} >
            <Header text='List of Games' />
            <ScrollView style={gStyle.contentScroll} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPost} />}>
                <View style={styles.content}>
                    {games.map(game => (
                        <View key={game.id} style={styles.boxes}>
                            <Text style={gStyle.text}>{game.title}</Text>
                        </View>
                    ))}
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
    boxes: {
        width: '80%',
        padding: 30,
        backgroundColor: 'blueviolet',
        borderRadius: 10,
        borderWidth: 2,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

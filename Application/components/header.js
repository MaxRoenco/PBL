import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function Header({ text }) {
    return (
        <View style={styles.main}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        paddingTop: 10,
        minHeight: 100,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: 'blueviolet',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    }
});

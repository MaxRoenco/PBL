import { StyleSheet } from "react-native";
import * as Font from 'expo-font';

const loadFonts = () => {
    return Font.loadAsync({
        'Anta': require('../assets/fonts/Anta/Anta-Regular.ttf')
    });
}

export const gStyle = StyleSheet.create({
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
    boxes: {
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
        fontFamily: 'Anta',
    },
    title: {
        fontSize: 20,
        color: '#333',
    },
    loadingbox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#448aff'
    },
})
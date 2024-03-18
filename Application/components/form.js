import React from 'react';
import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import { Formik } from 'formik';
import Header from './header';

export default function About() {
    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.header}>Register Form</Text>
            <Formik
                initialValues={{ name: '', mail: '' }}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {(props) => (
                    <View>
                        <TextInput
                            style={styles.input}
                            value={props.values.name}
                            placeholder='Input your name'
                            onChangeText={props.handleChange('name')} />
                        <TextInput
                            style={styles.input}
                            value={props.values.mail}
                            placeholder='Input your email'
                            onChangeText={props.handleChange('mail')} />
                        <Button title='Register' onPress={props.handleSubmit} />
                    </View>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#448aff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 20,
        borderWidth: 2,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 10,
        borderColor: 'silver',
    },
});

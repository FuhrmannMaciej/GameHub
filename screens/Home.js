import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';

const Home = () => {

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{flexDirection: 'row'}}>
                <Entypo name="camera" size={28} color={colors.lightGray} style={styles.camera}/>
                <FontAwesome name="search" size={24} color={colors.lightGray} style={styles.search}/>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity
                onPress={() => navigation.navigate("Chat")}
                style={styles.chatButton}
            >
                <Entypo name="chat" size={28} color={colors.lightGray} />
            </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            
        </View>
    );
    };

    export default Home;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: "#fff",
        },
        chatButton: {
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 15
        },
        camera: {
            marginLeft: 15,
        },
        search: {
            marginLeft: 15,
            borderBottomWidth: 2,
            borderBottomColor: colors.lightGray,
            paddingBottom: 5,
            width: 280
        }
    });
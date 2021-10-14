import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Procurar(props) {
    const [nickname, setNickname] = useState('');
    
    const buscarPlayer = () => {
        
        if (nickname != '') {
            props.setShowCarregamento(true);
            props.setDesabilitarView(true);
        }
        
        props.gerarSession(props.navigation, nickname)

    }

    return (
        <View style={styles.ViewPrincipal}>
            <View style={styles.container}>
                <Text style={{ ...styles.tituloDestaque, position: 'absolute' }}>Procurar</Text>
                <View style={styles.ViewCenter}>
                    <View style={styles.TextInputFundo}>
                        <TextInput value={nickname} onChangeText={v => setNickname(v)} placeholderTextColor="#78888B" placeholder="Nickname" style={styles.TextInput}></TextInput>
                        <Feather style={styles.iconUser} name="user" size={30} />
                    </View>
                    {
                        (props.showCarregamento)
                            ?
                            <View style={styles.ViewCarregamento}>
                                <ActivityIndicator size="large" color='#19a1bd' />
                                <Text style={styles.textCarregamento}>Procurando...</Text>
                            </View>
                            :
                            <View />
                    }
                    <TouchableOpacity onPress={() => buscarPlayer()} style={styles.btnBuscar}><Text style={styles.TextBtnBuscar}>BUSCAR</Text></TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    ViewPrincipal: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#19a1bd',
    },
    tituloDestaque: {
        padding: 10,
        color: '#072c33',
        fontSize: 75,
        fontFamily: 'Lato_700Bold',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        textShadowColor: 'rgba(0,0,0,0.5)',
    },
    btnBuscar: {
        width: 379,
        height: 64,
        backgroundColor: '#007187',
        elevation: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    TextBtnBuscar: {
        fontSize: 20,
        fontFamily: 'Lato_900Black'
    },
    ViewCarregamento: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        position: 'absolute',
        elevation: 6
    },
    textCarregamento: {
        color: 'black',
        paddingLeft: 15
    },
    iconUser: {
        position: 'absolute',
        marginLeft: 15
    },
    TextInput: {
        width: 379,
        height: 64,
        borderRadius: 10,
        marginLeft: 55,
        fontFamily: 'Roboto_400Regular',
        fontSize: 17
    },
    TextInputFundo: {
        borderRadius: 10,
        backgroundColor: 'white',
        width: 379,
        height: 64,
        alignItems: 'center',
        elevation: 5,
        flexDirection: 'row'
    },
    ViewCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})


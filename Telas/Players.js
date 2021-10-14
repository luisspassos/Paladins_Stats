import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function Historico(props) {
    return (
        <ScrollView style={styles.scrollView}>
            <Text style={styles.tituloDestaque}>Players</Text>
            {
                (props.infosPlayerAba == '')
                    ?
                    <View>
                        <Text style={styles.TextInfosNull}>Não há nada aqui. Pesquise por players para serem adicionados nesta aba.</Text>
                    </View>
                    :
                    <TouchableOpacity onPress={() => props.LimparHistorico()} style={styles.btnLimparHistorico}>
                        <Text style={styles.TextLimparHistorico}>Limpar Histórico</Text>
                    </TouchableOpacity>
            }

            <View style={styles.viewCenter}>
                
                {

                    props.infosPlayerAba.map(val => {
                        return (
                            
                                <View style={styles.boxHistorico}>
                                    <Image source={{ uri: val.Avatar }} style={styles.imagem} />
                                    <View style={styles.Textos}>
                                        <Text style={styles.Nick}>{val.Nick}</Text>
                                        <Text style={styles.Elo}>{val.Elo}</Text>
                                        <Text style={styles.UltimoOnline}>Online em {val.horarioBR}.</Text>
                                    </View>
                                </View>
                        )
                    }).reverse()
                }

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    TextInfosNull: {
        padding: 20,
        fontFamily: 'Roboto_700Bold',
        color: '#0F6070',
        fontSize: 20
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
    scrollView: {
        backgroundColor: '#19A1BD',
    },
    btnLimparHistorico: {
        backgroundColor: '#007187',
        elevation: 5,
        width: 163,
        borderRadius: 10,
        marginLeft: 15,
        marginBottom: 10
    },
    TextLimparHistorico: {
        padding: 10,
        fontFamily: 'Roboto_700Bold',
        color: '#072c33',
        fontSize: 17
    },
    viewCenter: {
        flex: 1,
        alignItems: 'center'
    },
    boxHistorico: {
        backgroundColor: 'white',
        width: 379,
        height: 120,
        borderRadius: 10,
        elevation: 2,
        marginTop: 10,
        marginBottom: 10
    },
    imagem: {
        width: 143,
        height: 120,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        overlayColor: '#19a1bd'
    },
    Textos: {
        marginLeft: 155,
        position: 'absolute'
    },
    Nick: {
        color: '#072C33',
        fontFamily: 'Roboto_700Bold',
        fontSize: 21
    },
    Elo: {
        color: '#0F6070',
        fontFamily: 'Roboto_400Regular',
        fontSize: 19
    },
    UltimoOnline: {
        color: '#0F6070',
        fontFamily: 'Roboto_400Regular',
        fontSize: 13,
        marginTop: 30,
        marginLeft: 3
    }
})
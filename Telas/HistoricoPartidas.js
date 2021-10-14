import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import moment from 'moment';

export default function HistoricoPartidas(props) {
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.viewCenter}>
                
                {
                    props.partidas[props.partidas.length - 1].Champion == null
                        ?
                        <View></View>
                        :
                        props.partidas.map((val, index) => {
                            if (index < 20) {
                                return (
                                    <View style={styles.boxHistorico}>
                                        {
                                            props.imagensChamp.map(valor => {
                                                if (valor.Name == val.Champion) {
                                                    return (
                                                        <Image source={{ uri: valor.ChampionIcon_URL }} style={styles.imagem} />
                                                    )
                                                }
                                            })
                                        }
                                        <View style={styles.Textos}>
                                            <Text style={styles.Champion}>{val.Champion}</Text>
                                            <Text style={styles.KDA}>{val.Kills}/{val.Deaths}/{val.Assists}</Text>
                                            <Text style={styles.Horario}>Data: {moment(val.Match_Time).subtract(3, "hours").format('DD/MM/YYYY HH:mm:ss')}.</Text>
                                        </View>
                                    </View>
                                )
                            }
                        })

                }

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
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
        marginBottom: 10,
        justifyContent: 'center',
    },
    imagem: {
        width: 143,
        height: 120,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
    Textos: {
        marginLeft: 155,
        position: 'absolute'
    },
    Champion: {
        color: '#072C33',
        fontFamily: 'Roboto_700Bold',
        fontSize: 21
    },
    KDA: {
        color: '#0F6070',
        fontFamily: 'Roboto_400Regular',
        fontSize: 19
    },
    Horario: {
        color: '#0F6070',
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
    }
})
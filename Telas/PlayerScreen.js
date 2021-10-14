import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function Player(props) {

    props.setDesabilitarView(false)
    props.setShowCarregamento(false)

    return (
        props.infosPlayerAba == ''
        ?
        <View />
        :
        <View style={{ ...styles.container, alignItems: 'center' }}>
            
            <View style={styles.FundoAvatar}>
            <Image source={{ uri: props.infosPlayerAba[props.infosPlayerAba.length - 1].Avatar }} style={styles.Avatar} />
            </View>
            <Text style={styles.infosElo}>{props.infosPlayerAba[props.infosPlayerAba.length - 1].Elo}{"\n"}(Rank. {props.infosPlayerAba[props.infosPlayerAba.length - 1].Rank})</Text>
            <Image source={{ uri: props.infosPlayerAba[props.infosPlayerAba.length - 1].ImagemElo }} style={styles.ImagemElo} />
            <View style={{ width: 377, height: 175, backgroundColor: '#007187', marginTop: 10, borderRadius: 10, elevation: 5 }}>
            <Text style={styles.infosPlayer}>Pontos: {props.infosPlayerAba[props.infosPlayerAba.length - 1].Pontos}{"\n"}Taxa de Vitória: {props.infosPlayerAba[props.infosPlayerAba.length - 1].TaxaVitoria}%{"\n"}Vitórias/Derrotas: {props.infosPlayerAba[props.infosPlayerAba.length - 1].Vitorias}/{props.infosPlayerAba[props.infosPlayerAba.length - 1].Derrotas}{"\n"}Temporada: {props.infosPlayerAba[props.infosPlayerAba.length - 1].Temporada}</Text><Text style={styles.UltimaOnline}>Última vez online: {props.infosPlayerAba[props.infosPlayerAba.length - 1].horarioBR}</Text>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#19a1bd',
      },
    FundoAvatar: { 
        height: 180, 
        width: 200, 
        backgroundColor: '#007187', 
        elevation: 5, 
        borderRadius: 10,
        marginTop: 20, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    Avatar: { 
        width: 180, 
        height: 160, 
        borderRadius: 10,
        overlayColor: '#007187',

    },
    infosElo: { 
        textAlign: 'center', 
        fontFamily: 'Roboto_700Bold', 
        color: '#072c33', 
        fontSize: 30 
    },
    ImagemElo: { 
        width: 170, 
        height: 215, 
        marginTop: 10 
    },
    infosPlayer: { 
        color: '#072C33', 
        fontFamily: 'Roboto_700Bold', 
        fontSize: 23, 
        padding: 10 
    },
    UltimaOnline: { 
        textAlign: "center", 
        color: '#072C33', 
        fontFamily: 'Roboto_700Bold', 
        fontSize: 16 
    }
})
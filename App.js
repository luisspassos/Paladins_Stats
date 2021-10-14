const md5 = require('md5');
const moment = require('moment');
const Tiers = require('./assets/Tiers');

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ToastAndroid, Keyboard, TouchableOpacity } from 'react-native';
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Procurar from './Telas/ProcurarScreen.js';
import Players from './Telas/Players.js';
import Player from './Telas/PlayerScreen.js';
import PlayerConsole from './Telas/PlayerScreenConsole';
import HistoricoPartidas from './Telas/HistoricoPartidas';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  let [fontsLoaded] = useFonts({
    Lato_700Bold,
    Lato_900Black,
    Lato_400Regular,
    Roboto_700Bold,
    Roboto_400Regular
  });

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@player', jsonValue)
    } catch (e) { }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@player')
        return jsonValue != null ? setInfosPlayerAba(JSON.parse(jsonValue)) : console.log('erro');
      } catch (e) { }
    }
    getData()
  }, [])

  const [infosPlayerAba, setInfosPlayerAba] = useState([]);
  const [desabilitarView, setDesabilitarView] = useState(false);
  const [showCarregamento, setShowCarregamento] = useState(false);
  const [imagensChamp, setImagensChamp] = useState([]);
  const [partidas, setPartidas] = useState([]);
  infosPlayerAba != '' ? storeData(infosPlayerAba) : false;

  const ToastNickInvalido = () => {
    ToastAndroid.showWithGravity(
      'Nick inválido ou perfil privado. (Também certifique-se de espaços em branco no nick.)',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
  };

  const ToastBottom = (mensagem) => {
    ToastAndroid.showWithGravity(
      mensagem,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  const Erro = (e) => {
    console.log(e);
    ToastNickInvalido();
    setShowCarregamento(false);
    setDesabilitarView(false);
  }

  const LimparHistorico = () => {
    ToastBottom('Histórico limpo com sucesso.');
    setInfosPlayerAba([])
    storeData([])
  }

  function ProcurarScreen({ navigation }) {
    return (
      <Procurar showCarregamento={showCarregamento} setShowCarregamento={setShowCarregamento} infosPlayerAba={infosPlayerAba} setDesabilitarView={setDesabilitarView} gerarSession={gerarSession} navigation={navigation} />
    );
  }

  function PlayersScreen({ navigation }) {
    return (
      <Players infosPlayerAba={infosPlayerAba} navigation={navigation} LimparHistorico={LimparHistorico} />
    );
  }

  function HistoricoPartida({ navigation }) {
    return (
      <HistoricoPartidas imagensChamp={imagensChamp} partidas={partidas} />
    );
  }

  function PlayerScreen() {
    return (
      <Player setDesabilitarView={setDesabilitarView} setShowCarregamento={setShowCarregamento} infosPlayerAba={infosPlayerAba} />
    );
  }

  function PlayerScreenConsole() {
    return (
      <PlayerConsole infosPlayerAba={infosPlayerAba} />
    );
  }

  const gerarSession = async (navigation, nick) => {

    Keyboard.dismiss()

    const endPoint = 'https://api.paladins.com/paladinsapi.svc';
    const devId = '3673';
    const apiKey = '5FB7F5C547DF4CED966DEE10C6607418';

    function generateSignature(method) {
      return md5(`${devId}${method}${apiKey}${moment.utc().format('YYYYMMDDHHmmss')}`);
    }

    if (nick == '') {
      return ToastBottom('Adicione um nick para ser buscado.');
    }

    try {
      const responseSessionID = await fetch(`${endPoint}/createsessionJson/${devId}/${generateSignature('createsession')}/${moment.utc().format('YYYYMMDDHHmmss')}`)

      const responseSessionIDJSON = await responseSessionID.json();

      const sessionID = responseSessionIDJSON.session_id;

      const responseSearchPlayer = await fetch(`${endPoint}/searchplayersJson/${devId}/${generateSignature('searchplayers')}/${sessionID}/${moment.utc().format('YYYYMMDDHHmmss')}/${nick}`)

      const responseSearchPlayerJSON = await responseSearchPlayer.json();

      if (responseSearchPlayerJSON[0] == 0 || responseSearchPlayerJSON[0].Name.toLowerCase()
        != nick.toLowerCase()) {
        return Erro();
      }
      const playerid = responseSearchPlayerJSON[0].player_id;

      const responseGetPlayer = await fetch(`${endPoint}/getplayerJson/${devId}/${generateSignature('getplayer')}/${sessionID}/${moment.utc().format('YYYYMMDDHHmmss')}/${playerid}`)

      const responseMatchHistory = await fetch(`${endPoint}/getmatchhistoryJson/${devId}/${generateSignature('getmatchhistory')}/${sessionID}/${moment.utc().format('YYYYMMDDHHmmss')}/${playerid}`)

      const responseMatchHistoryJSON = await responseMatchHistory.json();

      const responseChampions = await fetch(`${endPoint}/getchampionsJson/${devId}/${generateSignature('getchampions')}/${sessionID}/${moment.utc().format('YYYYMMDDHHmmss')}/10`)

      const responseChampionsJSON = await responseChampions.json();

      const responseGetPlayerJSON = await responseGetPlayer.json();

      if (responseGetPlayerJSON[0].Id == 0) {
        return Erro();
      }
      setPartidas(responseMatchHistoryJSON)
      setImagensChamp(responseChampionsJSON)

      const infosPlayer = {
        Nick: responseGetPlayerJSON[0].hz_player_name,
        ImagemElo: responseGetPlayerJSON[0].RankedKBM.Tier == 26 && responseGetPlayerJSON[0].RankedKBM.Rank <= 100 && responseGetPlayerJSON[0].RankedKBM.Tier == 26 && responseGetPlayerJSON[0].RankedKBM.Rank > 0 ? Tiers.Tiers[27][1] : Tiers.Tiers[responseGetPlayerJSON[0].RankedKBM.Tier][1],
        Rank: responseGetPlayerJSON[0].RankedKBM.Rank,
        Avatar: responseGetPlayerJSON[0].AvatarURL || 'https://pbs.twimg.com/profile_images/1153773155816804354/ptQRsA7s_400x400.jpg',
        Pontos: responseGetPlayerJSON[0].RankedKBM.Points,
        Vitorias: responseGetPlayerJSON[0].RankedKBM.Wins,
        Derrotas: responseGetPlayerJSON[0].RankedKBM.Losses,
        Temporada: responseGetPlayerJSON[0].RankedKBM.Season,
        TaxaVitoria: +((responseGetPlayerJSON[0].RankedKBM.Wins / (responseGetPlayerJSON[0].RankedKBM.Wins + responseGetPlayerJSON[0].RankedKBM.Losses) * 100).toFixed(1)) || '0',
        horarioBR: moment(responseGetPlayerJSON[0].Last_Login_Datetime).subtract(3, "hours").format('DD/MM/YYYY HH:mm:ss'),
        Elo: responseGetPlayerJSON[0].RankedKBM.Tier == 26 && responseGetPlayerJSON[0].RankedKBM.Rank <= 100 && responseGetPlayerJSON[0].RankedKBM.Rank > 0 ? Tiers.Tiers[27][0] : Tiers.Tiers[responseGetPlayerJSON[0].RankedKBM.Tier][0],

        EloC: responseGetPlayerJSON[0].RankedController.Tier == 26 && responseGetPlayerJSON[0].RankedController.Rank <= 100 && responseGetPlayerJSON[0].RankedController.Rank > 0 ? Tiers.Tiers[27][0] : Tiers.Tiers[responseGetPlayerJSON[0].RankedController.Tier][0],
        RankC: responseGetPlayerJSON[0].RankedController.Rank,
        PontosC: responseGetPlayerJSON[0].RankedController.Points,
        VitoriasC: responseGetPlayerJSON[0].RankedController.Wins,
        DerrotasC: responseGetPlayerJSON[0].RankedController.Losses,
        TemporadaC: responseGetPlayerJSON[0].RankedController.Season,
        TaxaC: +((responseGetPlayerJSON[0].RankedController.Wins / (responseGetPlayerJSON[0].RankedController.Wins + responseGetPlayerJSON[0].RankedController.Losses) * 100).toFixed(1)) || '0',
        ImagemEloC: responseGetPlayerJSON[0].RankedController.Tier == 26 && responseGetPlayerJSON[0].RankedController.Rank <= 100 && responseGetPlayerJSON[0].RankedController.Rank > 0 ? Tiers.Tiers[27][1] : Tiers.Tiers[responseGetPlayerJSON[0].RankedController.Tier][1],

      }

      setInfosPlayerAba([...infosPlayerAba, infosPlayer])
      navigation.navigate("Player")


    } catch (e) {
      return Erro(e);
    }
  }

  const TabsApp = () => {
    return (
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconSearch;
            let iconClipboard;
            if (route.name === 'Procurar') {
              iconSearch = 'search'

            } else if (route.name === 'Players') {
              iconClipboard = 'clipboard-text'
            }
            return (
              <View style={styles.TabsIconCenter}>
                <Ionicons style={styles.IconSearch} name={iconSearch} color={color} size={40} />
                <MaterialCommunityIcons style={styles.iconClipboard} name={iconClipboard} color={color} size={40} />
              </View>
            );
          },
          tabBarPressColor: 'transparent',
        })}
        tabBarOptions={{
          activeTintColor: '#0F6070',
          inactiveTintColor: '#072C33',
          showLabel: true,
          showIcon: true,
          tabStyle: { height: 80 },
          indicatorStyle: { backgroundColor: '#0F6070', height: 5 },
          style: { elevation: 0, backgroundColor: '#19A1BD', fontFamily: 'Lato_900Black' },
          labelStyle: { fontFamily: 'Lato_900Black', fontSize: 17 }
        }}
      >
        <Tab.Screen name="Procurar" component={ProcurarScreen} />
        <Tab.Screen name="Players" component={PlayersScreen} />
      </Tab.Navigator>
    )
  }

  const TabsAppPlat = () => {
    return (
      <Tab.Navigator
        tabBarVisible={false}
        tabBarOptions={{
          activeTintColor: '#0F6070',
          inactiveTintColor: '#072C33',
          showLabel: true,
          tabStyle: { height: 40 },
          indicatorStyle: { backgroundColor: '#0F6070', height: 3 },
          style: { elevation: 0, backgroundColor: '#19A1BD', fontFamily: 'Lato_900Black' },
          labelStyle: { fontFamily: 'Lato_900Black', fontSize: 18 },
        }}
      >
        <Tab.Screen name="PC" component={PlayerScreen} />
        <Tab.Screen name="CONSOLE" component={PlayerScreenConsole} />
        <Tab.Screen name="HISTÓRICO" component={HistoricoPartida} />
      </Tab.Navigator>
    )
  }

  const AbasApp = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Procurar" component={TabsApp} />
        <Stack.Screen options={({ navigation }) => ({ headerStyle: { backgroundColor: '#19A1BD', height: 80 }, headerTintColor: '#072C33', headerTitleStyle: { fontSize: 30, fontFamily: 'Roboto_700Bold' }, headerTitle: infosPlayerAba == '' ? '' : infosPlayerAba[infosPlayerAba.length - 1].Nick, headerBackImage: () => (<TouchableOpacity onPress={() => navigation.navigate("Procurar")}><Ionicons name="arrow-back" size={35} color="#072C33" /></TouchableOpacity>), headerPressColor: 'black' })} name="Player" component={TabsAppPlat} />
      </Stack.Navigator>
    )
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (

      <View pointerEvents={desabilitarView ? 'none' : 'auto'} style={styles.container}>
        <NavigationContainer theme={{ colors: { background: '#19a1bd' } }}>
          <StatusBar hidden />
          {AbasApp()}
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#19a1bd',
  },
  TabsIconCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  IconSearch: {
    width: 50,
    marginBottom: 32
  },
  iconClipboard: {
    width: 50,
    position: 'absolute',
    bottom: 23,
    textAlign: 'center'
  }
});
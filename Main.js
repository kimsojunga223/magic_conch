import React, {Component, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import 'react-native-gesture-handler';
import axios from 'axios';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import HappyEmo from '../svg/HappyEmo1';
import BestEmo from '../svg/BestEmo1';
import SadEmo from '../svg/SadEmo1';
import AngryEmo from '../svg/AngryEmo1';
import SosoEmo from '../svg/SosoEmo1';
import Write from '../svg/Write';
import Calendar from '../screens/Calendar';
import Rectangle from '../images/Rectangle.png';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.clalendercontainer}>
          <View style={styles.RectContainer}>
            <Image source={Rectangle} />
          </View>
          <Calendar navigation={this.props.navigation} />
        </View>
        <View style={styles.writeBtn}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push('Record');
            }}>
            <Write />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  clalendercontainer: {
    marginTop: 30,
  },
  RectContainer: {
    flex: 1,
    bottom: 70,
    right: 6,
  },
  writeBtn: {
    position: 'absolute',
    top: 550,
    left: 325,
  },
});

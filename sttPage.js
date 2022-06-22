import React, {Component, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import SoundPlayer from 'react-native-sound-player';

export default class SttPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordName: this.props.route.params.recordName,
      sttText: this.props.route.params.sttResult,

      voiceDuration: this.props.route.params.recordduration,
      voiceTime: 0,
      nowPlayingTime: 0,
      timer: null,
    };
  }

  componentDidMount() {
    let time = parseInt(this.state.voiceDuration.replace(':', ''));
    time = parseInt(time / 100) * 60 + (time % 100);
    this.setState({voiceTime: time});
  }

  audioPlay = () => {
    try {
      SoundPlayer.playUrl(
        'file:///data/user/0/com.magicconch/files/' +
          this.state.recordName +
          '.wav',
      );
      this.startTimer();
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  audioStop = () => {
    try {
      SoundPlayer.pause();
      this.stopTimer();
    } catch (e) {
      console.log(`cannot stop the sound file`, e);
    }
  };

  startTimer = () => {
    var num = 0;
    let timer = setInterval(() => {
      num = Number(num) + 1;
      this.setState({nowPlayingTime: num});

      if (num > this.state.voiceTime) {
        this.stopTimer();
      }
    }, 1000);

    this.setState({timer: timer});
  };

  stopTimer = () => {
    clearInterval(this.state.timer);
    this.setState({nowPlayingTime: 0});
  };

  render = () => {
    return (
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Icon name={'arrow-back-outline'} size={37} />
          </TouchableOpacity>
          <View style={styles.audioContainer}>
            <View style={styles.playBox}>
              <TouchableOpacity onPress={() => this.audioPlay()}>
                <Icon name={'play-circle-outline'} size={35} />
              </TouchableOpacity>
            </View>
            <View style={styles.pauseBox}>
              <TouchableOpacity onPress={() => this.audioStop()}>
                <Icon name={'pause-circle-outline'} size={35} />
              </TouchableOpacity>
            </View>
            <View style={styles.progressbarContainer}>
              {this.state.voiceTime !== 0 && this.state.nowPlayingTime !== 0 ? (
                <Progress.Bar
                  progress={this.state.nowPlayingTime / this.state.voiceTime}
                  color={'#E2CCFB'}
                  width={200}
                  height={10}
                />
              ) : (
                <Progress.Bar width={200} height={10} color={'#E2CCFB'} />
              )}
            </View>
            <View style={styles.timebox}>
              <Text style={{fontFamily: 'nationalB', right: 10}}>
                {parseInt(this.state.nowPlayingTime / 60)}:
                {parseInt(this.state.nowPlayingTime % 60) < 10
                  ? '0' + parseInt(this.state.nowPlayingTime % 60)
                  : parseInt(this.state.nowPlayingTime % 60)}
                /{this.state.voiceDuration}
              </Text>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.contentBox}>
              <KeyboardAwareScrollView
                extraHeight={100}
                enableOnAndroid={true}
                contentContainerStyle={{height: -30}}
                resetScrollToCoords={{x: 0, y: 0}}
                scrollEnabled={true}
                enableAutomaticScroll={true}>
                <View>
                  <TextInput
                    value={this.state.sttText}
                    multiline={true}
                    onChangeText={text => this.setState({sttText: text})}
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonBox}>
              <Button
                title="다음"
                color={'#E2CCFB'}
                onPress={() => {
                  this.props.navigation.navigate('ImagUpload', {
                    recordName: this.props.route.params.recordName,
                    isEmo: this.props.route.params.isEmo,
                    isRecom: this.props.route.params.isRecom,
                    sttText: this.state.sttText,
                    recordurl: this.props.route.params.recordurl,
                    recordduration: this.props.route.params.recordduration,
                  });
                  console.log(this.state.sttText);
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  topContainer: {
    //backgroundColor:'red',
    height: 30,
    paddingTop: 10,
    paddingLeft: 10,
  },

  audioContainer: {
    //backgroundColor: 'grey',
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 10,
  },

  progressbarContainer: {
    //backgroundColor: 'greay',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },

  progressbarBox: {
    backgroundColor: 'blue',
  },

  timebox: {
    marginLeft: 25,
    marginTop: 5,
  },

  playBox: {
    //backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  pauseBox: {
    //backgroundColor: 'violet',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    //backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentBox: {
    //backgroundColor: 'orange',
    height: 600,
    width: 320,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
  },

  buttonContainer: {
    //backgroundColor: 'brown',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonBox: {
    width: 300,
  },
});

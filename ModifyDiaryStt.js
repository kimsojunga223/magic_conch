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
import axios from 'axios';

export default class SttPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diaryId: this.props.route.params.diaryId,
      voiceId: '',
      voiceDuration: 0,
      text: '',
      timer: null,
      nowPlayingTime: 0,
    };
  }

  componentDidMount() {
    this.getDiary();
  }

  getDiary = () => {
    console.log('getDiary');
    axios
      .get('http://202.31.201.231/diaries/' + this.state.diaryId)
      .then(({data}) => {
        this.setState({
          voiceId: data.voiceId,
          voiceDuration: data.voiceDuration,
          text: data.text,
        });
        this.requestToPermissions();
      })
      .catch(error => {
        console.log(error);
        if (error.response) {
          if (error.response.status === 404) {
            console.log('일기없음');
          } else if (error.response.status === 401) {
            console.log('조회 권한 없음');
            Alert.alert('조회 불가한 일기입니다.');
          } else if (error.response.status === 500) {
            console.log('파일없음(테스토용)');
          } else {
            console.log('일기 조회 실패');
            console.log(e);
          }
        }
      });
  };

  requestToPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Music',
          message: 'App needs access to your Files... ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.startDownload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  startDownload = () => {
    let isFileExist = '';
    RNFetchBlob.fs
      .exists(
        '/data/user/0/com.magicconch/files/' + this.state.voiceId + '.wav',
      )
      .then(exist => {
        isFileExist = exist;
        console.log('파일 존재: ', isFileExist);

        if (isFileExist == false) {
          console.log('startDownload...');
          const audioUrl =
            'http://202.31.201.231/mediafiles/' + this.state.voiceId;
          const pathFile = RNFetchBlob.fs.dirs.DocumentDir;
          RNFetchBlob.config({
            fileCache: true,
            path: pathFile + '/' + voiceId + '.wav',
          })
            .fetch('GET', audioUrl)
            .then(res => {
              console.log('The file is save to ', res.path());
            })
            .catch(err => {
              console.log('err', err);
            });
        }
      })
      .catch(err => {
        console.log('file exists error: ', err);
      });
  };

  audioPlay = () => {
    try {
      SoundPlayer.playUrl(
        'file:///data/user/0/com.magicconch/files/' +
          this.state.voiceId +
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

      if (num > this.state.voiceDuration) {
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
        {this.state.getDiary === false ? this.getDiary() : null}
        <View>
          <View style={styles.topContainer}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Diary', {
                  id: this.state.diaryId,
                });
              }}>
              <Icon name={'arrow-back-outline'} size={37} />
            </TouchableOpacity>
          </View>

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
              {this.state.voiceDuration !== 0 &&
              this.state.nowPlayingTime !== 0 ? (
                <Progress.Bar
                  progress={
                    this.state.nowPlayingTime /
                    parseInt(this.state.voiceDuration)
                  }
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
                /{parseInt(this.state.voiceDuration / 60)}:
                {parseInt(this.state.voiceDuration % 60) < 10
                  ? '0' + parseInt(this.state.voiceDuration % 60)
                  : parseInt(this.state.voiceDuration % 60)}
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
                    value={this.state.text}
                    multiline={true}
                    onChangeText={text => this.setState({text: text})}
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
                  this.props.navigation.navigate('EditEtcSetting', {
                    sttText: this.state.text,
                    id: this.state.diaryId,
                  });
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
    paddingTop: 5,
    paddingLeft: 10,
    height: 40,
  },

  audioContainer: {
    //backgroundColor: 'grey',
    flexDirection: 'row',
    marginTop: 20,
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
    bottom: 5,
    width: 300,
  },
});

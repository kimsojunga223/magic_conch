import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Button,
  TouchableOpacity,
  ScrollView,
  LogBox,
  PermissionsAndroid,
} from 'react-native';
import {Colors} from 'react-native-paper';
import * as Progress from 'react-native-progress';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import {Directions} from 'react-native-gesture-handler';
import Previous from '../svg/Previous';

LogBox.ignoreLogs(['new NativeEventEmitter']);

export default class Diary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //myNickname: '',
      diaryId: this.props.route.params.id,
      voiceId: '',
      voiceDuration: 0,
      photoId: '',
      text: '',
      privacy: '',
      date: '',
      feeling: '',
      emotionRecogResult: '',
      tags: [],
      writterNickname: '',
      likeCount: '',
      isLikedPrincipal: false,

      nowPlayingTime: 0,
      timer: null,
    };
  }

  componentDidMount() {
    this.getDiary();
  }

  getDiary = async () => {
    console.log('getDiary');
    axios
      .get('http://202.31.201.231/diaries/' + this.state.diaryId)
      .then(({data}) => {
        this.setState({
          voiceId: data.voiceId,
          voiceDuration: data.voiceDuration,
          photoId: data.photoId,
          text: data.text,
          privacy: data.privacy,
          date: data.date,
          feeling: data.feeling,
          emotionRecogResult: data.emotionRecogResult,
          tags: data.tags,
          writterNickname: data.writterNickname,
          likeCount: data.likeCount,
          isLikedPrincipal: data.isLikedByPrincipal,
        });
        this.requestToPermissions();
      })
      .catch(error => {
        console.log(error);
        if (error.response) {
          if (error.response.status === 404) {
            console.log('일기없음');
            this.props.navigation.push('navi');
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
            path: pathFile + '/' + this.state.voiceId + '.wav',
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
      const path =
        '/data/user/0/com.magicconch/files/' + this.state.voiceId + '.wav';
      SoundPlayer.playUrl(path);

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
    this.setState({nowPlayingTime: 0});
    clearInterval(this.state.timer);
  };

  like = () => {
    console.log('하트클릭');
    axios
      .post('http://202.31.201.231/likes?diaryId=' + this.state.diaryId)
      .then(response => {
        console.log(response.data);
        this.setState({isLikedPrincipal: true});
        this.getDiary();
      })
      .catch(error => {
        console.log('error');
        if (error.response) {
          if (error.response.status === 409) {
            console.log('중복 공감 => 공감 취소');
          } else {
            console.log('공감 에러');
            console.log(error);
          }
        }
      });
  };

  likeCancel = () => {
    console.log('공감 취소');
    axios
      .delete('http://202.31.201.231/likes?diaryId=' + this.state.diaryId)
      .then(response => {
        console.log(response.data);
        this.setState({isLikedPrincipal: false});
        this.getDiary();
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log('공감내역 없음');
          }
        }
      });
  };

  removeDiary = () => {
    axios
      .delete('http://202.31.201.231/diaries/' + this.state.diaryId)
      .then(response => {
        console.log(response.data);
        Alert.alert('일기가 삭제되었습니다.');
        this.props.navigation.push('navi');
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log('일기 없음');
            Alert.alert('일기가 존재하지 않습니다.');
          } else if (error.response.status === 401) {
            console.log('권한 없음');
            Alert.alert('접근 권한이 없습니다.');
          }
        }
        console.log('일기삭제 에러', error);
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.rootConatiner}>
        <ScrollView>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('navi');
              }}>
              <View style={styles.Previous}>
                <Previous />
              </View>
            </TouchableOpacity>
            <View style={styles.topContainer}>
              <View style={styles.dateBox}>
                <Text style={styles.dateFont}>{this.state.date}</Text>
              </View>
              <View style={styles.editBox1}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ModifyDiaryStt', {
                      diaryId: this.state.diaryId,
                    });
                  }}>
                  <Icon name={'pencil-outline'} size={20} />
                </TouchableOpacity>
              </View>
              <View style={styles.editBox2}>
                <TouchableOpacity onPress={() => this.removeDiary()}>
                  <Icon name={'trash-outline'} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.audioContainer}>
                <View style={styles.audioButtonBox1}>
                  <TouchableOpacity onPress={() => this.audioPlay()}>
                    <Icon name={'play-circle-outline'} size={35} />
                  </TouchableOpacity>
                </View>
                <View style={styles.audioButtonBox2}>
                  <TouchableOpacity onPress={() => this.audioStop()}>
                    <Icon name={'pause-circle-outline'} size={35} />
                  </TouchableOpacity>
                </View>
                <View style={styles.audioBarBox}>
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
                <View style={styles.audioTimeBox}>
                  <Text style={styles.audioTimeFont}>
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

              <View style={styles.photoBox}>
                {this.state.photoId !== null ? (
                  <Image
                    source={{
                      uri:
                        'http://202.31.201.231/mediafiles/' +
                        this.state.photoId,
                    }}
                    style={{width: 390, height: 390}}
                  />
                ) : null}
              </View>
              <View style={styles.textBox}>
                <Text style={{fontFamily: 'nationalB'}}>{this.state.text}</Text>
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.heartBox}>
                {this.state.isLikedPrincipal === false ? (
                  <Icon
                    name={'heart-outline'}
                    size={20}
                    onPress={() => this.like()}
                  />
                ) : (
                  <Icon
                    name={'heart'}
                    size={20}
                    onPress={() => this.likeCancel()}
                  />
                )}
              </View>
              <View style={styles.heartTextBox}>
                <Text>{this.state.likeCount}</Text>
              </View>
              <View style={styles.tagBox}>
                {this.state.tags.map(tag => (
                  <Text style={{fontFamily: 'nationalB'}}>
                    &#035;{tag}&nbsp;&nbsp;
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  rootConatiner: {
    flex: 1,
    backgroundColor: 'white',
  },
  Previous: {
    top: 20,
    left: 20,
  },
  topContainer: {
    flexDirection: 'row', //자식 가로로 배치
    top: 30,
  },
  dateBox: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  dateFont: {
    fontFamily: 'nationalB',
    fontSize: 24,
  },

  editBox1: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 180,
    flexDirection: 'row',
    right: 30,
  },

  editBox2: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
    flexDirection: 'row',
    right: 30,
  },

  contentContainer: {
    alignItems: 'center',
    top: 30,
  },

  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  audioButtonBox1: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  audioButtonBox2: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  audioBarBox: {
    width: 210,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },

  audioTimeBox: {
    width: 85,
    height: 40,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  audioTimeFont: {
    fontFamily: 'nationalB',
    fontSize: 13,
  },

  photoBox: {
    width: 390,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textBox: {
    width: 360,
    marginTop: 10,
  },

  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },

  heartBox: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },

  heartTextBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  heartTextFont: {
    fontFamily: 'nationalB',
    fontSize: 25,
  },

  tagBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    flexDirection: 'row',
  },

  tagFont: {
    fontSize: 30,
  },
});

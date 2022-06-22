import 'react-native-gesture-handler';
import React, {useState, useEffect, Component} from 'react';
import {
  FlatList,
  LogBox,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Button,
  TouchableOpacity,
  ScrollView,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import {Colors} from 'react-native-paper';
import * as Progress from 'react-native-progress';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/Ionicons';
import 'react-native-gesture-handler';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

LogBox.ignoreLogs(['new NativeEventEmitter']);

export default class Community extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTags: '',
      timer: null,
      datas: [
        {
          diaryId: '',
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
          likeCount: 0,
          isLikedByPrincipal: '',
          nowPlayingTime: 0,
        },
      ],
    };
  }

  componentDidMount() {
    this.search(null);
  }

  requestToPermissions = async voiceId => {
    try {
      console.log('권한요청');
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
        this.startDownload(voiceId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  startDownload = voiceId => {
    let isFileExist = '';
    RNFetchBlob.fs
      .exists('/data/user/0/com.magicconch/files/' + voiceId + '.wav')
      .then(exist => {
        isFileExist = exist;
        console.log('파일 존재: ', isFileExist);

        if (isFileExist === true) {
          this.audioPlay(voiceId);
        } else {
          console.log('startDownload...');
          const audioUrl = 'http://202.31.201.231/mediafiles/' + voiceId;
          const pathFile = RNFetchBlob.fs.dirs.DocumentDir;
          RNFetchBlob.config({
            fileCache: true,
            path: pathFile + '/' + voiceId + '.wav',
          })
            .fetch('GET', audioUrl)
            .then(res => {
              console.log('The file is save to ', res.path());
              this.audioPlay(voiceId);
            })
            .catch(err => {
              console.log('err', err);
            });
        }
      })
      .catch(err => {
        console.log('file exists: ', err);
      });
  };

  audioPlay = voiceId => {
    try {
      const audioUrl = '/data/user/0/com.magicconch/files/' + voiceId + '.wav';
      SoundPlayer.playUrl(audioUrl);

      this.startTimer(voiceId);
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  audioStop = voiceId => {
    try {
      SoundPlayer.pause();

      this.stopTimer(voiceId);
    } catch (e) {
      console.log(`cannot stop the sound file`, e);
    }
  };

  startTimer = voiceId => {
    var num = 0;
    let timer = setInterval(() => {
      num = Number(num) + 1;
      const newData = this.state.datas.map(item =>
        item.voiceId === voiceId ? {...item, nowPlayingTime: num} : item,
      );
      this.setState({datas: newData});

      const dataItem = this.state.datas.filter(
        item => item.voiceId === voiceId,
      );
      const audioTime = parseInt(dataItem[0].voiceDuration);
      if (num > audioTime) {
        this.audioStop(voiceId);
      }
    }, 1000);

    this.setState({timer: timer});
  };

  stopTimer = voiceId => {
    clearInterval(this.state.timer);
    const newData = this.state.datas.map(item =>
      item.voiceId === voiceId ? {...item, nowPlayingTime: 0} : item,
    );
    this.setState({datas: newData});
  };

  search = tags => {
    console.log(this.state.searchTags);
    const pageNum = '1';
    let url = '';
    if (tags === null) {
      url = 'http://202.31.201.231/diaries';
    } else {
      url = 'http://202.31.201.231/diaries?key=' + tags + '&page=' + pageNum;
    }

    axios
      .get(url)
      .then(({data}) => {
        console.log(data);

        const newDatas = data.map(item => ({...item, nowPlayingTime: 0}));
        this.setState({
          datas: newDatas,
        });
      })
      .catch(error => {
        console.log('검색 에러');
        console.log(error);
      });
  };

  like = diaryId => {
    console.log('공감 : ', diaryId);
    axios
      .post('http://202.31.201.231/likes?diaryId=' + diaryId)
      .then(response => {
        console.log(response.data);
        this.search(this.state.searchTags);
      })
      .catch(error => {
        console.log('error');
        if (error.response) {
          if (error.response.status === 409) {
            console.log('중복 공감 => 공감 취소');
            this.likeCancel();
          } else {
            console.log('공감 에러');
            console.log(error);
          }
        }
      });
  };

  likeCancel = diaryId => {
    console.log('공감 취소 : ', diaryId);
    axios
      .delete('http://202.31.201.231/likes?diaryId=' + diaryId)
      .then(response => {
        this.search(this.state.searchTags);
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log('공감내역 없음');
            this.like();
          }
        }
      });
  };

  reportAlert = diaryId => {
    Alert.alert(
      '게시글을 신고하시겠습니까?',
      '',
      [
        {
          text: '취소',
          onPress: () => console.log('취소클릭함'),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            axios
              .post('http://202.31.201.231/reports?diaryId=' + diaryId)
              .then(response => {
                console.log('신고 성공 : ', diaryId);
                console.log(response);
                Alert.alert('신고 완료하였습니다.');
              })
              .catch(error => {
                if (error.response) {
                  if (error.response.status === 409) {
                    console.log('중복신고');
                    Alert.alert('이미 신고하였습니다.');
                  } else {
                    console.log('신고 오류');
                    console.log(error);
                  }
                }
              });
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  renderItem = ({item}) => {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.rootConatiner}>
            <View style={styles.topContainer}>
              <View style={styles.nicknameBox}>
                <Text style={styles.nicknameFont}>{item.accountNickname}</Text>
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.dateFont}>{item.date}</Text>
              </View>

              <View style={styles.declareBox}>
                <TouchableOpacity
                  onPress={() => this.reportAlert(item.diaryId)}>
                  <Image
                    source={require('../images/declare.png')}
                    style={{width: 20, height: 20}}></Image>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.audioContainer}>
                <View style={styles.audioButtonBox1}>
                  <Icon
                    name={'play-circle-outline'}
                    size={35}
                    onPress={() => this.requestToPermissions(item.voiceId)}
                  />
                </View>
                <View style={styles.audioButtonBox2}>
                  <Icon
                    name={'pause-circle-outline'}
                    size={35}
                    onPress={() => this.audioStop(item.voiceId)}
                  />
                </View>
                <View style={styles.audioBarBox}>
                  {item.voiceDuration !== 0 && item.nowPlayingTime !== 0 ? (
                    <Progress.Bar
                      progress={
                        item.nowPlayingTime / parseInt(item.voiceDuration)
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
                    {parseInt(item.nowPlayingTime / 60)}:
                    {parseInt(item.nowPlayingTime % 60) < 10
                      ? '0' + parseInt(item.nowPlayingTime % 60)
                      : parseInt(item.nowPlayingTime % 60)}
                    /{parseInt(item.voiceDuration / 60)}:
                    {parseInt(item.voiceDuration % 60) < 10
                      ? '0' + parseInt(item.voiceDuration % 60)
                      : parseInt(item.voiceDuration % 60)}
                  </Text>
                </View>
              </View>

              <View style={styles.photoBox}>
                {item.photoId !== null ? (
                  <Image
                    source={{
                      uri: 'http://202.31.201.231/mediafiles/' + item.photoId,
                    }}
                    style={{width: 390, height: 390}}
                  />
                ) : null}
              </View>
              <View style={styles.textBox}>
                <Text style={{fontFamily: 'Sunflower-Medium'}}>
                  {item.text}
                </Text>
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.heartBox}>
                <TouchableOpacity>
                  {item.isLikedByPrincipal == true ? (
                    <Icon
                      name={'heart'}
                      size={20}
                      onPress={() => this.likeCancel(item.diaryId)}
                    />
                  ) : (
                    <Icon
                      name={'heart-outline'}
                      size={20}
                      onPress={() => this.like(item.diaryId)}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.heartTextBox}>
                <Text style={{fontFamily: 'Sunflower-Bold'}}>
                  {item.likeCount}
                </Text>
              </View>
              <View style={styles.tagBox}>
                {item.tags.map(tag => (
                  <Text style={{fontFamily: 'Sunflower-Medium'}}>
                    &#035;{tag}&nbsp;&nbsp;
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  render = () => {
    return (
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBarBox}>
            <View style={styles.searchBox}>
              <TextInput
                style={{fontFamily: 'Sunflower_Bold'}}
                onChangeText={searchTags =>
                  this.setState({searchTags: searchTags})
                }
              />
            </View>
            <View style={styles.searchImageBox}>
              <TouchableOpacity
                onPress={() => this.search(this.state.searchTags)}>
                <Icon name={'search-outline'} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <FlatList
          data={this.state.datas}
          renderItem={this.renderItem}
          keyExtractor={item => {
            item.diaryId;
          }}></FlatList>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  rootConatiner: {
    //backgroundColor:"yellow",
    borderBottomWidth: 1,
  },

  searchContainer: {
    //backgroundColor:'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },

  searchBarBox: {
    //backgroundColor:'yellow',
    width: 335,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
  },

  searchBox: {
    //backgroundColor:'violet',
    width: 300,
    height: 45,
    justifyContent: 'center',
    paddingLeft: 15,
  },

  searchImageBox: {
    //backgroundColor:'orange',
  },

  topContainer: {
    //backgroundColor: 'pink',
    flexDirection: 'row',
    paddingLeft: 20,
  },

  nicknameBox: {
    //backgroundColor:'skyblue',
    justifyContent: 'center',
    //alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    right: 15,
    width: 75,
  },

  nicknameFont: {
    fontSize: 20,
    fontFamily: 'Sunflower_Bold',
  },

  dateBox: {
    //backgroundColor:'red',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    right: 15,
  },

  dateFont: {
    fontSize: 15,
    fontFamily: 'Sunflower-Medium',
  },

  declareBox: {
    //backgroundColor:'purple',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 155,
    flexDirection: 'row',
  },

  contentContainer: {
    //backgroundColor: 'violet',
    alignItems: 'center',
  },

  audioContainer: {
    //backgroundColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
  },

  audioButtonBox1: {
    //backgroundColor: 'blue',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  audioButtonBox2: {
    //backgroundColor: 'pink',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  audioBarBox: {
    //backgroundColor: '#ff5000',
    width: 200,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  audioTimeBox: {
    //backgroundColor: 'blue',
    width: 85,
    height: 40,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  audioTimeFont: {
    fontSize: 16,
  },

  photoBox: {
    //backgroundColor: 'skyblue',
    width: 390,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textBox: {
    //backgroundColor: 'yellow',
    width: 360,
    marginTop: 10,
  },

  bottomContainer: {
    //backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  heartBox: {
    //backgroundColor: 'grey',
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },

  heartTextBox: {
    //backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  heartTextFont: {
    fontSize: 25,
  },

  tagBox: {
    //backgroundColor: 'brown',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    flexDirection: 'row',
  },

  tagFont: {
    fontSize: 30,
  },
});

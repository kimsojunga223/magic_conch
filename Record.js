import React, {Component} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';

import Voice from '@react-native-community/voice';
import moment from 'moment';
import axios from 'axios';

import RecordIcon from '../svg/RecordIcon';
import FinishIcon from '../svg/FinishIcon';
import Previous from '../svg/Previous';

export default class Record extends Component {
  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);

    this.state = {
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      startDisable: false,
      isRecording: false,
      isnum: 0,
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      recordName: '',
      isEmo: '',
      isRecom: '',
      sttResult: '',
      recordurl: '',
      recordduration: '',
    };
  }

  //STT코드
  onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
    this.setState({started: '√'});
  };

  onSpeechRecognized = e => {
    console.log('onSpeechRecognized: ', e);
    this.setState({recognized: '√'});
  };

  onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    this.setState({end: '√'});
  };

  onSpeechError = e => {
    console.log('onSpeechError: ', e);
    this.setState({error: JSON.stringify(e.error)});
  };

  onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    this.setState({results: e.value});

    const newResultStr = this.state.sttResult + e.value[0];
    this.setState({sttResult: newResultStr});
    console.log('resultStr: ', newResultStr);
  };

  onSpeechPartialResults = e => {
    console.log('onSpeechPartialResults: ', e);
    this.setState({partialResults: e.value});
  };

  onSpeechVolumeChanged = e => {
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({pitch: e.value});
  };

  //기능 시작
  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
      sttResult: '',
    });
    try {
      await Voice.start('ko-KR');
    } catch (e) {
      console.error(e);
    }

    if (this.isRecording) {
      return Promise.resolve();
    }

    const hasPermission = await this.requestMicrophonePermission();

    if (!hasPermission) {
      return console.log('거부');
    }

    //timer start part
    let timer = setInterval(() => {
      var num = (Number(this.state.seconds_Counter) + 1).toString(),
        count = this.state.minutes_Counter;

      if (Number(this.state.seconds_Counter) == 59) {
        count = (Number(this.state.minutes_Counter) + 1).toString();
        num = '00';
      }

      this.setState({
        minutes_Counter: count.length == 1 ? '0' + count : count,
        seconds_Counter: num.length == 1 ? '0' + num : num,
      });

      if (this.state.minutes_Counter >= 5) {
        this.compulsionStop();
      }
    }, 1000);
    this.setState({timer});

    this.setState({startDisable: true});

    this.setState({recordName: moment()});

    //record start part
    this.setState({isRecording: true});
    console.log('click_start_record');
    this.setState({isnum: 1});
    return SoundRecorder.start(
      SoundRecorder.PATH_DOCUMENT + `/${this.state.recordName}.wav`,
      {
        source: Platform.select({
          android: SoundRecorder.SOURCE_MIC,
        }),
        format: Platform.select({
          android: SoundRecorder.FORMAT_MPEG_4,
        }),
        encoder: Platform.select({
          android: SoundRecorder.ENCODER_AAC,
        }),
      },
    );
  };

  //기능 종료
  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }

    SoundRecorder.stop().then(result => {
      console.log('stopped recording, audio file saved at: ' + result.path);
      this.setState({recordurl: result.path});
    });

    this.setState({isRecording: false});

    //timer stop part
    clearInterval(this.state.timer);

    //추가 0603
    this.setState({
      startDisable: false,
      recordduration:
        (parseInt(this.state.minutes_Counter) % 10) +
        ':' +
        this.state.seconds_Counter,
    });

    console.log(this.state.results);
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };

  componentDidMount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  };

  //초과하였을 경우 강제 종료
  compulsionStop = async () => {
    //record stop part
    SoundRecorder.stop().then(result => {
      console.log('stopped recording, audio file saved at: ' + result.path);
      this.setState({recordurl: result.path});
    });

    this.setState({isRecording: false});

    //timer stop part
    clearInterval(this.state.timer);

    //추가 0603
    this.setState({
      startDisable: false,
      recordduration:
        (parseInt(this.state.minutes_Counter) % 10) +
        ':' +
        this.state.seconds_Counter,
    });
    console.log(this.state.results);

    Alert.alert('5분이 초과되었습니다. \n자동으로 음성 녹음이 완료됩니다.');
  };

  //handlClick 이 부분 교체 0603
  handlClick = () => {
    if (this.state.recordurl == '') {
      Alert.alert(
        '녹음하지않으셨습니다. \n녹음 후 다음으로 넘어갈 수있습니다.',
      );
    } else {
      const formData = new FormData();
      var voice = {
        uri: 'file://' + this.state.recordurl,
        type: 'audio/wav',
        name: this.state.recordName + '.wav',
      };
      formData.append('voice', voice);
      console.log(formData);
      console.log(voice);
      axios
        .post('http://202.31.201.231/diaries/emotionRecogResult', formData, {
          headers: {'content-type': 'multipart/form-data'},
          transformRequest: formData => formData,
        })
        .then(({data}) => {
          console.log(data);
          this.setState({isEmo: data});
          if (data == 'POSITIVE') {
            this.setState({isRecom: 'happy'});
          } else if (data == 'NEGATIVE') {
            this.setState({isRecom: 'angry'});
          } else {
            this.setState({isRecom: 'soso'});
          }
          this.props.navigation.navigate('SttPage', {
            recordName: this.state.recordName,
            isEmo: this.state.isEmo,
            isRecom: this.state.isRecom,
            sttResult: this.state.sttResult,
            recordurl: this.state.recordurl,
            recordduration: this.state.recordduration, //추가 0603
          });
        })
        .catch(e => {
          console.error(e);
        });
    }
  };

  render() {
    const {isRecording, isnum} = this.state;
    return (
      <SafeAreaView style={styles.Totalcontainer}>
        <View style={styles.Previous}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push('navi');
            }}>
            <Previous />
          </TouchableOpacity>
        </View>
        <Text style={styles.counterText}>
          {this.state.minutes_Counter} : {this.state.seconds_Counter}
        </Text>
        <View style={styles.record}>
          {isRecording === true && (
            <TouchableOpacity onPress={this._stopRecognizing}>
              <FinishIcon />
            </TouchableOpacity>
          )}
          {isRecording === false && isnum == 0 && (
            <TouchableOpacity onPress={this._startRecognizing}>
              <RecordIcon />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.btn1}>
          <Button
            title="다음"
            color={'#E2CCFB'}
            onPress={() => this.handlClick()}
            disabled={isRecording}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  Totalcontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  Previous: {
    top: 20,
    left: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 35,
    fontFamily: 'NanumGothic-ExtraBold',
    top: 230,
    left: 140,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  record: {
    top: 270,
    left: 170,
  },
  btn1: {position: 'absolute', width: 250, top: 670, left: 80},
});

import React, {Component} from 'react';
import {
  Dimensions,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  CommonActions,
} from 'react-native';
import moment from 'moment';

import SwitchToggle from 'react-native-switch-toggle';
import Tags from 'react-native-tags';
import 'react-native-gesture-handler';
import axios from 'axios';

import HappyEmo from '../svg/HappyEmo';
import BestEmo from '../svg/BestEmo';
import SadEmo from '../svg/SadEmo';
import AngryEmo from '../svg/AngryEmo';
import SosoEmo from '../svg/SosoEmo';
import Previous from '../svg/Previous';
import Recommend from '../svg/Recommend';
import SelectEmo from '../svg/SelectEmo';
import SelectEmo1 from '../svg/SelectEmo1';

var positiveTag = [
  {id: 1, value: '😆'},
  {id: 2, value: '😍'},
  {id: 3, value: '🥳'},
  {id: 4, value: '😅'},
  {id: 5, value: '😗'},
];
var neutalityTag = [
  {id: 1, value: '😐'},
  {id: 2, value: '🤨'},
  {id: 3, value: '🙄'},
  {id: 4, value: '😬'},
  {id: 5, value: '🥴'},
];
var negativeTag = [
  {id: 1, value: '😱'},
  {id: 2, value: '😭'},
  {id: 3, value: '🤬'},
  {id: 4, value: '😤'},
  {id: 5, value: '😷'},
];
// 감정분석 결과에 따른 나타내는 임티 모양 변경
export default class EtcSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmo: this.props.route.params.isEmo,
      isOn: false,
      isRecom: this.props.route.params.isRecom, //감정 추천
      isSelectfeeling: null, // 사용자가 선택한 임티
      privacy: 'PRIVATE',
      text: this.props.route.params.sttText,
      tags: '',
      photo: '',
      voice: '',
      isTagCircle: '',
      isTag: '',
      recordduration: this.props.route.params.recordduration, //추가 0603
    };
  }
  //isrecom -> 감정분석 모델에서 가져오게 된 감정을 추천해준다.

  selectEmo = EmoState => {
    if (EmoState == 1) {
      this.setState({isSelectfeeling: 1});
      this.setState({isRecom: null});
    } else if (EmoState == 2) {
      this.setState({isSelectfeeling: 2});
      this.setState({isRecom: null});
    } else if (EmoState == 3) {
      this.setState({isSelectfeeling: 3});
      this.setState({isRecom: null});
    } else if (EmoState == 4) {
      this.setState({isSelectfeeling: 4});
      this.setState({isRecom: null});
    } else if (EmoState == 5) {
      this.setState({isSelectfeeling: 5});
      this.setState({isRecom: null});
    }
  };

  toggle = () => {
    this.setState({isOn: !this.state.isOn});
    if (this.state.isOn == true) {
      this.setState({privacy: 'PRIVATE'});
    } else {
      this.setState({privacy: 'PUBLIC'});
    }
  };

  finalSave = async () => {
    const formData = new FormData();
    formData.append('text', this.state.text);
    formData.append('privacy', this.state.privacy);
    if (this.state.isSelectfeeling == null) {
      Alert.alert('오늘의 감정 미선택입니다. \n선택해주세요.');
    } else {
      formData.append('feeling', this.state.isSelectfeeling);
    }
    formData.append('date', moment().format('YYYY-MM-DD'));
    formData.append('voiceDuration', this.state.recordduration);
    if (this.state.isTag == '') {
      Alert.alert('음성 분석 추천 태그 미선택입니다. \n선택해주세요.');
    } else {
      formData.append('tags', this.state.isTag);
    }
    if (this.state.tags == '') {
    } else {
      this.state.tags.map(tag => {
        formData.append('tags', tag);
      });
    }
    if (this.props.route.params.imageSource != null) {
      var photo = {
        uri: this.props.route.params.imageSource,
        type: 'image/jpeg',
        name: `${moment()}.jpg`,
      };
      formData.append('photo', photo);
      console.log('사진완');
    }
    var voice = {
      uri: 'file://' + this.props.route.params.recordurl,
      type: 'audio/wav',
      name: this.props.route.params.recordName + '.wav',
    };
    formData.append('voice', voice);
    console.log(formData);
    console.log(voice);
    axios
      .post('http://202.31.201.231/diaries', formData, {
        headers: {'content-type': 'multipart/form-data'},
        transformRequest: formData => formData,
      })
      .then(response => {
        console.log(response);
        //밑에 있는 거 위치 이동함 0602
        this.props.navigation.push('navi');
      })
      .catch(e => {
        console.log(e);
      });
  };

  selectTag = (i, value) => {
    this.setState({isTagCircle: i});
    this.setState({isTag: value});
  };

  render() {
    //분석태그가 나오게 되면 태그가 추가됨
    const positive = positiveTag.map(i => (
      <TouchableOpacity
        key={i.value}
        onPress={() => this.selectTag(i.id, i.value)}
        hitSlop={{top: 30}}>
        <Text key={i.id} style={styles.analy}>
          {' '}
          {i.value}{' '}
        </Text>
      </TouchableOpacity>
    ));

    const neutality = neutalityTag.map(i => (
      <TouchableOpacity
        key={i.value}
        onPress={() => this.selectTag(i.id, i.value)}
        hitSlop={{top: 30}}>
        <Text key={i.id} style={styles.analy}>
          {' '}
          {i.value}{' '}
        </Text>
      </TouchableOpacity>
    ));

    const negative = negativeTag.map(i => (
      <TouchableOpacity
        key={i.value}
        onPress={() => this.selectTag(i.id, i.value)}
        hitSlop={{top: 30}}>
        <Text key={i.id} style={styles.analy}>
          {' '}
          {i.value}{' '}
        </Text>
      </TouchableOpacity>
    ));
    return (
      <SafeAreaView style={styles.Totalcontainer}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <View style={styles.Previous}>
            <Previous />
          </View>
        </TouchableOpacity>
        <Text style={styles.title1}>{'오늘 당신의 감정은?'}</Text>
        <TouchableOpacity
          onPress={() => this.selectEmo(1)}
          hitSlop={{bottom: 30}}>
          <View style={styles.veryhappy}>
            <BestEmo />
            {this.state.isSelectfeeling === 1 && (
              <View style={styles.vReco}>
                <SelectEmo />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.selectEmo(2)}
          hitSlop={{bottom: 30}}>
          <View style={styles.happy}>
            <HappyEmo />
            {this.state.isRecom === 'happy' && (
              <View style={styles.vReco}>
                <Recommend />
              </View>
            )}
            {this.state.isSelectfeeling == 2 && (
              <View style={styles.vReco}>
                <SelectEmo />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.selectEmo(3)}
          hitSlop={{bottom: 30}}>
          <View style={styles.soso}>
            <SosoEmo />
            {this.state.isRecom === 'soso' && (
              <View style={styles.vReco}>
                <Recommend />
              </View>
            )}
            {this.state.isSelectfeeling === 3 && (
              <View style={styles.vReco}>
                <SelectEmo />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.selectEmo(4)}
          hitSlop={{bottom: 30}}>
          <View style={styles.angry}>
            <AngryEmo />
            {this.state.isRecom === 'angry' && (
              <View style={styles.vReco}>
                <Recommend />
              </View>
            )}
            {this.state.isSelectfeeling === 4 && (
              <View style={styles.vReco}>
                <SelectEmo />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.selectEmo(5)}
          hitSlop={{bottom: 30}}>
          <View style={styles.sad}>
            <SadEmo />
            {this.state.isSelectfeeling === 5 && (
              <View style={styles.vReco}>
                <SelectEmo />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.next}>
          <Button
            title="저장"
            color={'#E2CCFB'}
            onPress={() => {
              this.finalSave();
            }}></Button>
        </View>
        <Text style={styles.title3}>음성 분석 추천 태그</Text>
        {this.state.isEmo === 'POSITIVE' && (
          <View style={styles.analyTagContain}>
            {positive}
            {this.state.isTagCircle === 1 && (
              <View style={styles.vRecoTag1}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 2 && (
              <View style={styles.vRecoTag2}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 3 && (
              <View style={styles.vRecoTag3}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 4 && (
              <View style={styles.vRecoTag4}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 5 && (
              <View style={styles.vRecoTag5}>
                <SelectEmo1 />
              </View>
            )}
          </View>
        )}
        {this.state.isEmo === 'NEUTRAL' && (
          <View style={styles.analyTagContain}>
            {neutality}
            {this.state.isTagCircle === 1 && (
              <View style={styles.vRecoTag1}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 2 && (
              <View style={styles.vRecoTag2}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 3 && (
              <View style={styles.vRecoTag3}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 4 && (
              <View style={styles.vRecoTag4}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 5 && (
              <View style={styles.vRecoTag5}>
                <SelectEmo1 />
              </View>
            )}
          </View>
        )}
        {this.state.isEmo === 'NEGATIVE' && (
          <View style={styles.analyTagContain}>
            {negative}
            {this.state.isTagCircle === 1 && (
              <View style={styles.vRecoTag1}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 2 && (
              <View style={styles.vRecoTag2}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 3 && (
              <View style={styles.vRecoTag3}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 4 && (
              <View style={styles.vRecoTag4}>
                <SelectEmo1 />
              </View>
            )}
            {this.state.isTagCircle === 5 && (
              <View style={styles.vRecoTag5}>
                <SelectEmo1 />
              </View>
            )}
          </View>
        )}
        <Text style={styles.title2}>{'일상을 표현한다면?'}</Text>
        <View style={styles.tagcontainer}>
          <Tags
            initialText=""
            textInputProps={{
              placeholderTextColor: '#d0d1d4',
              placeholder: '여기에 태그를 입력해주세요',
            }}
            onChangeTags={tags => this.setState({tags: tags})}
            containerStyle={{justifyContent: 'center'}}
            inputStyle={{
              backgroundColor: 'white',
            }}
            maxNumberOfTags={8}
            renderTag={({tag, index, onPress, deleteTagOnPress, readonly}) => (
              <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                <Text style={styles.tagLabel}>{tag}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text style={styles.open}>공개</Text>
        <Text style={styles.close}>비공개</Text>
        <View style={styles.Switch}>
          <SwitchToggle
            switchOn={this.state.isOn}
            onPress={() => this.toggle()}
            circleColorOff="#000000"
            circleColorOn="#E2CCFB"
            backgroundColorOn="#e28bff"
            backgroundColorOff="#C4C4C4"
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
  g: {
    top: 50,
    right: 350,
    backgroundColor: '#000000',
  },
  title1: {
    marginTop: 40,
    color: '#000000',
    textAlignVertical: 'center',
    fontFamily: 'NanumGothic-Bold',
    fontSize: 30,
    left: 20,
  },
  vReco: {flex: 1, bottom: 63, right: 15},
  vRecoTag1: {bottom: 70, right: 365},
  vRecoTag2: {bottom: 70, right: 292},
  vRecoTag3: {bottom: 70, right: 218},
  vRecoTag4: {bottom: 70, right: 144},
  vRecoTag5: {bottom: 70, right: 70},
  selEmo: {
    flex: 1,
    bottom: 63,
    right: 15,
  },
  veryhappy: {
    flex: 1,
    top: 20,
    left: 30,
  },
  happy: {
    flex: 1,
    top: 20,
    left: 100,
  },
  soso: {
    flex: 1,
    top: 20,
    left: 170,
  },
  angry: {
    flex: 1,
    top: 20,
    left: 240,
  },
  sad: {
    flex: 1,
    top: 20,
    left: 310,
  },
  next: {
    padding: 70,
    top: 500,
    left: 8,
  },
  title2: {
    color: '#000000',
    textAlignVertical: 'center',
    fontFamily: 'NanumGothic-Bold',
    fontSize: 30,
    bottom: 40,
    left: 20,
  },
  analyTagContain: {
    flexDirection: 'row',
    left: 20,
  },
  analy: {
    fontSize: 35,
    margin: 5,
    bottom: 70,
  },
  title3: {
    color: '#000000',
    textAlignVertical: 'center',
    fontFamily: 'NanumGothic-Bold',
    fontSize: 15,
    bottom: 80,
    left: 20,
  },
  tagcontainer: {
    bottom: 30,
    left: 15,
  },
  tagLabel: {
    justifyContent: 'center',
    backgroundColor: '#E2CCFB',
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    fontFamily: 'NanumGothic-Bold',
    height: 35,
    margin: 5,
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  Switch: {
    position: 'absolute',
    left: 170,
    top: 550,
  },
  open: {
    position: 'absolute',
    left: 260,
    top: 570,
    fontSize: 20,
  },
  close: {
    position: 'absolute',
    left: 100,
    top: 570,
    fontSize: 20,
  },
});

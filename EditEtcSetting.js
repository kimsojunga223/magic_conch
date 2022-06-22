import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';

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
//감정 분석 결과에 따른 분석 태그 임티 종류 변경 및 나타내는 setstate를 변경해야함
export default class EditEtcSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmo: '',
      isOn: null,
      isSelectfeeling: null, // 사용자가 선택한 임티
      privacy: '',
      tags: '',
      photo: '',
      voice: '',
      isTagCircle: '',
      isTag: '',
    };
  }
  //isrecom -> 감정분석 모델에서 가져오게 된 감정을 추천해준다.
  // happy, soso, angry로 구성되어있으며 모델 값에 따라 설정해주는 코드를 작성해야함.

  loadItem = async () => {
    axios
      .get('http://202.31.201.231/diaries/' + this.props.route.params.id, {})
      .then(({data}) => {
        console.log(data);
        this.setState({
          privacy: data.privacy,
          isSelectfeeling: data.feeling,
          isTag: data.tags.shift(),
          tags: data.tags,
          isEmo: data.emotionRecogResult,
        });
        const Tags = element => element.value == this.state.isTag;
        if (this.state.privacy == 'PUBLIC') {
          this.setState({isOn: true});
        } else {
          this.setState({isOn: false});
        }
        //if문으로 감정분석 결과와 일치하는 배열로 setState만들어주면 됨
        if (this.state.isEmo == 'POSITIVE') {
          this.setState({isTagCircle: positiveTag.findIndex(Tags) + 1});
        } else if (this.state.isEmo == 'NEGATIVE') {
          this.setState({isTagCircle: negativeTag.findIndex(Tags) + 1});
        } else {
          this.setState({isTagCircle: neutalityTag.findIndex(Tags) + 1});
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  componentDidMount() {
    this.loadItem();
  }

  selectEmo = EmoState => {
    if (EmoState == 1) {
      this.setState({isSelectfeeling: 1});
    } else if (EmoState == 2) {
      this.setState({isSelectfeeling: 2});
    } else if (EmoState == 3) {
      this.setState({isSelectfeeling: 3});
    } else if (EmoState == 4) {
      this.setState({isSelectfeeling: 4});
    } else if (EmoState == 5) {
      this.setState({isSelectfeeling: 5});
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
    this.state.tags.unshift(this.state.isTag);
    axios
      .patch('http://202.31.201.231/diaries/' + this.props.route.params.id, {
        text: this.props.route.params.sttText,
        feeling: this.state.isSelectfeeling,
        tags: this.state.tags,
        privacy: this.state.privacy,
      })
      .then(response => {
        console.log(response);
        this.props.navigation.push('Diary', {
          id: this.props.route.params.id,
        });
      })
      .catch(response => console.log(response));
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
          {Array.isArray(this.state.tags) && (
            <Tags
              initialTags={this.state.tags}
              textInputProps={{
                placeholderTextColor: '#d0d1d4',
                placeholder: '여기에 태그를 입력해주세요',
              }}
              onChangeTags={tags => this.setState({tags: tags})}
              containerStyle={{justifyContent: 'center', marginLeft: 15}}
              inputStyle={{backgroundColor: 'white'}}
              maxNumberOfTags={8}
              renderTag={({
                tag,
                index,
                onPress,
                deleteTagOnPress,
                readonly,
              }) => (
                <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                  <Text style={styles.tagLabel}>{tag}</Text>
                </TouchableOpacity>
              )}
            />
          )}
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
    top: 530,
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
    left: 150,
    top: 550,
  },
  open: {
    position: 'absolute',
    left: 240,
    top: 570,
    fontSize: 20,
  },
  close: {
    position: 'absolute',
    left: 80,
    top: 570,
    fontSize: 20,
  },
});

import React, {useState, Component} from 'react';
import 'react-native-gesture-handler';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  Button,
  SafeAreaView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Previous from '../svg/Previous';

export default class ImagUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageSource: null,
    };
  }

  selectImage = async () => {
    let options = {
      title: 'You can choose one image',
      maxWidth: 256,
      maxHeight: 256,
      noData: true,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
        Alert.alert('이미지를 선택하지 않으셨습니다.');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.assets[0].uri};

        this.setState({imageSource: source.uri});
        console.log(this.state.imageSource);
      }
    });
  };
  render() {
    return (
      <SafeAreaView style={styles.Totalcontainer}>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <View style={styles.Previous}>
              <Previous />
            </View>
          </TouchableOpacity>
          <View>
            <Text fontFamily="NanumGothic-ExtraBold" style={styles.txt}>
              오늘 하루를 사진 한 장으로 표현한다면
            </Text>
          </View>
          <View style={styles.btn}>
            <Button title="이미지 선택" onPress={this.selectImage} />
          </View>
          <View style={styles.imageContainer}>
            {this.state.imageSource === null ? (
              <Image
                source={require('../assets/noimage.png')}
                style={styles.imageBox}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{uri: this.state.imageSource}}
                style={styles.imageBox}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={styles.btn1}>
            <Button
              title="다음"
              color={'#E2CCFB'}
              onPress={() => {
                this.props.navigation.navigate('EtcSetting', {
                  imageSource: this.state.imageSource,
                  recordName: this.props.route.params.recordName,
                  isEmo: this.props.route.params.isEmo,
                  isRecom: this.props.route.params.isRecom,
                  sttText: this.props.route.params.sttText,
                  recordurl: this.props.route.params.recordurl,
                  recordduration: this.props.route.params.recordduration, //추가 0603
                });
              }}
            />
          </View>
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
  txt: {
    padding: 50,
    fontSize: 35,
    fontFamily: 'NanumGothic-ExtraBold',
    top: 30,
  },
  btn: {
    padding: 50,
    bottom: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    top: 80,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
  btn1: {
    padding: 70,
    top: 180,
  },
});

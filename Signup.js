import 'react-native';
import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import 'react-native-gesture-handler';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      checkPwd: '',
      nickname: '',
      isOverlapId: false,
    };
  }
  setUserNameText = text => {
    this.setState({username: text});
  };
  setPasswordText = text => {
    this.setState({password: text});
  };
  setCheckPwdText = text => {
    this.setState({checkPwd: text});
  };
  setNicknameText = text => {
    this.setState({nickname: text});
  };

  handleClick = async () => {
    if (this.state.password === this.state.checkPwd) {
      axios
        .post('http://202.31.201.231/accounts', {
          username: this.state.username,
          password: this.state.password,
          nickname: this.state.nickname,
        })
        .then(response => {
          console.log(response.data), console.log('회원가입 성공');
          this.props.navigation.navigate('login');
        })
        .catch(error => {
          console.log('에러');
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            if (error.response.status === 409) {
              Alert.alert('동일한 아이디가 이미 존재합니다.');
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.messsage);
          }
          console.log(error.config);
        });
    } else {
      Alert.alert('비밀번호가 일치하지 않습니다.');
    }
  };

  //아이디 중복 체크
  idCheck = e => {
    //e.preventDefault();
    //const {usableId} =this.state;

    axios
      .get('http://202.31.201.231/accounts/' + this.state.username + '/exists')
      .then(response => {
        console.log('아이디 중복 확인');
        console.log(response.data);
        if (response.data === true) {
          Alert.alert('아이디가 이미 존재합니다.');
        } else {
          Alert.alert('사용 가능한 아이디입니다.');
        }
      })
      .catch(e => console.log(e));
  };

  render = () => {
    /*          <TextInput
    secureTextEntry={true}
    placeholder="비밀번호를 입력해주세요" 추가하기 */
    return (
      <SafeAreaView>
        <View style={styles.topConatiner}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Icon
              name={'arrow-back-outline'}
              size={37}
              onPress={() => this.props.navigation.navigate('login')}
            />
          </TouchableOpacity>

          <Text style={styles.subTitle}>회원가입</Text>
        </View>

        <Text style={styles.text1}>아이디</Text>
        <View style={styles.overlap}>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="아이디를 입력해주세요."
              onChangeText={username => this.setUserNameText(username)}
            />
          </View>
          <View style={[styles.overlapButton]}>
            <Button
              title="중복확인"
              onPress={() => this.idCheck()}
              color={'#E2CCFB'}
            />
          </View>
        </View>

        <Text style={styles.text1}>비밀번호</Text>
        <View style={styles.inputBox1}>
          <TextInput
            secureTextEntry={true}
            placeholder="비밀번호를 입력해주세요"
            onChangeText={password => this.setPasswordText(password)}
          />
        </View>
        <Text style={styles.text1}>비밀번호 확인</Text>
        <View style={styles.inputBox1}>
          <TextInput
            secureTextEntry={true}
            placeholder="비밀번호를 입력해주세요"
            onChangeText={checkPwd => this.setCheckPwdText(checkPwd)}
          />
        </View>
        <Text style={styles.text1}>닉네임</Text>
        <View style={styles.inputBox1}>
          <TextInput
            placeholder="닉네임"
            onChangeText={nickname => this.setNicknameText(nickname)}
          />
        </View>

        <View style={[styles.button]}>
          <Button
            title="회원가입"
            onPress={() => this.handleClick()}
            color={'#E2CCFB'}
          />
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  subTitle: {
    fontFamily: 'nationalB',
    fontSize: 27,
    top: 40,
  },

  topConatiner: {
    flexDirection: 'row',
  },

  text1: {
    fontFamily: 'nationalB',
    top: 75,
    fontSize: 22,
    left: 30,
  },

  btnText: {
    fontFamily: 'nationalB',
    fontSize: 50,
    color: '#fff',
    textAlign: 'center',
  },

  overlap: {
    flexDirection: 'row',
    top: 40,
    //backgroundColor: 'pink'
  },

  overlapButton: {
    marginTop: 45,
  },

  inputBox: {
    fontFamily: 'nationalB',
    fontSize: 25,
    justifyContent: 'space-around',
    height: 48,
    width: 220,
    marginHorizontal: 30,
    borderWidth: 2,
    padding: 3,
    borderColor: '#EAE9E9',
    borderRadius: 10,
    marginTop: 40,
  },

  inputBox1: {
    fontFamily: 'nationalB',
    fontSize: 25,
    justifyContent: 'space-around',
    height: 48,
    width: 320,
    marginHorizontal: 30,
    borderWidth: 2,
    padding: 3,
    borderColor: '#EAE9E9',
    borderRadius: 10,
    marginTop: 40,
    top: 40,
  },

  button: {
    padding: 30,
    top: 70,
  },
});

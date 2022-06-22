import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native';
import {TextInput} from 'react-native';
import axios from 'axios';
import 'react-native-gesture-handler';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  //여기서 0603
  loadItem = async () => {
    this.setState({username: ''});
    this.setState({password: ''});
  };

  componentDidMount() {
    this.loadItem();
  }
  //여기까지 추가

  setUserNameText = text => {
    this.setState({username: text});
  };
  setPasswordText = text => {
    this.setState({password: text});
  };

  handleClick = async () => {
    axios
      .post('http://202.31.201.231/session', {
        username: this.state.username,
        password: this.state.password,
      })
      .then(response => {
        console.log(response);
        const {accessToken} = response.data;

        // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;

        this.props.navigation.navigate('navi');
      })
      .catch(response =>
        Alert.alert(
          '아이디 또는 비밀번호가 불일치합니다. \n 다시 입력해주세요.',
        ),
      );
  };

  render = () => {
    return (
      <SafeAreaView>
        <Text style={[styles.title]}>마법의 소라고동</Text>
        <Text style={[styles.text1]}> 아이디 </Text>
        <View style={[styles.view1]}>
          <TextInput
            placeholder="아이디 입력"
            onChangeText={username => this.setUserNameText(username)}
          />
        </View>
        <Text style={[styles.text2]}> 비밀번호 </Text>
        <View style={[styles.view2]}>
          <TextInput
            placeholder="비밀번호 입력"
            secureTextEntry={true}
            onChangeText={password => this.setPasswordText(password)}
          />
        </View>
        <View style={[styles.buttonContainer]}>
          <View style={styles.buttonBox}>
            <TouchableOpacity onPress={() => this.handleClick()}>
              <Text style={{fontFamily: 'nationalB', fontSize: 20}}>
                로그인
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonBox}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SignupScreen')}>
              <Text style={{fontFamily: 'nationalB', fontSize: 20}}>
                회원가입
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'nationalB',
    fontSize: 40,
    top: 130,
    left: 40,
  },
  view1: {
    padding: 3,
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: '#EAE9E9',
    marginHorizontal: 30,
    marginTop: 200,
  },
  view2: {
    padding: 3,
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: '#EAE9E9',
    marginHorizontal: 30,
    top: 40,
  },

  buttonContainer: {
    paddingTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  text1: {
    fontFamily: 'nationalB',
    top: 180,
    fontSize: 25,
    left: 20,
  },
  text2: {
    fontFamily: 'nationalB',
    fontSize: 25,
    top: 25,
    left: 20,
  },
});

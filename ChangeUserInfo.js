import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DialogInput from 'react-native-dialog-input';
import 'react-native-gesture-handler';
import axios from 'axios';

export default class ChangeUserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      password: '',
      isNicknameDialogVisible: false,
      isPwdDialogVisible: false,
    };
  }

  setNewNickname = () => {
    console.log(this.state.nickname);
    axios
      .patch('http://202.31.201.231/accounts/nickname', {
        nickname: this.state.nickname,
      })
      .then(response => {
        console.log('결과');
        console.log(response);
      })
      .catch(error => {
        console.log('에러');
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.messsage);
        }
        console.log(error.config);
      });
  };

  setNewPwd = () => {
    axios
      .patch('http://202.31.201.231/accounts/password', {
        password: this.state.password,
      })
      .then(response => {
        console.log('결과');
        console.log(response);
      })
      .catch(error => {
        console.log('에러');
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.messsage);
        }
        console.log(error.config);
      });
  };

  render = () => {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Icon name={'arrow-back-outline'} size={37} />
          </TouchableOpacity>
          <Text style={styles.subTitle}>회원정보 수정</Text>
        </View>

        <View style={styles.changeFunctionBox1}>
          <TouchableOpacity
            onPress={() => this.setState({isNicknameDialogVisible: true})}>
            <Text style={styles.changeFunctionFont}>닉네임 재설정</Text>
          </TouchableOpacity>

          <DialogInput
            isDialogVisible={this.state.isNicknameDialogVisible}
            title={'닉네임 재설정'}
            message={'새 닉네임을 입력해주세요'}
            hintInput={this.state.nickname}
            initValueTextInput=""
            submitText={'변경'}
            cancelText={'취소'}
            submitInput={inputNickname => {
              this.setState({nickname: inputNickname}, () =>
                this.setNewNickname(),
              );
              console.log(this.state.nickname);
              this.setState({isNicknameDialogVisible: false});
            }}
            closeDialog={() => {
              this.setState({isNicknameDialogVisible: false});
            }}
          />
        </View>
        <View style={styles.changeFunctionBox2}>
          <TouchableOpacity
            onPress={() => this.setState({isPwdDialogVisible: true})}>
            <Text style={styles.changeFunctionFont}>비밀번호 재설정</Text>
          </TouchableOpacity>
          <DialogInput
            isDialogVisible={this.state.isPwdDialogVisible}
            title={'비밀번호 재설정'}
            message={'새 비밀번호를 입력해주세요'}
            initValueTextInput=""
            submitText={'변경'}
            cancelText={'취소'}
            submitInput={inputPwd => {
              this.setState({password: inputPwd}, () => {
                this.setNewPwd();
              });
              console.log(this.state.password);
              this.setState({isPwdDialogVisible: false});
            }}
            closeDialog={() => {
              this.setState({isPwdDialogVisible: false});
            }}
          />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 300,
  },

  topContainer: {
    flexDirection: 'row',
  },

  subTitle: {
    fontFamily: 'nationalB',
    fontSize: 27,
    top: 60,
  },

  changeFunctionBox1: {
    marginTop: 50,
    marginLeft: 50,
    width: 300,
    height: 40,
    justifyContent: 'center',
  },

  changeFunctionBox2: {
    marginTop: 25,
    marginLeft: 50,
    width: 300,
    height: 40,
    justifyContent: 'center',
  },

  changeFunctionFont: {
    top: 40,
    fontFamily: 'nationalB',
    fontSize: 22,
  },
});

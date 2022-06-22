import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import 'react-native-gesture-handler';
import axios from 'axios';

const UserInfo = props => {
  const [username, setusername] = useState();
  const [nickname, setnickname] = useState();
  let getNickname = false;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) console.log('Focused!!');
  }, [isFocused]);

  const handleSignOut = async () => {
    Alert.alert(
      '정말 계정을 탈퇴하시겠습니까? \n모든 정보가 완전히 삭제됩니다.',
      '',
      [
        {
          text: '취소',
          onPress: () => console.log('취소클릭함'),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () =>
            axios
              .delete('http://202.31.201.231/accounts')
              .then(response => {
                console.log('회원탈퇴'), props.navigation.push('login');
              })
              .catch(e => {
                console.log('회원탈퇴 실패');
                console.log(e);
              }),
        },
        console.log('확인클릭함'),
      ],
      {
        cancelable: false,
      },
    );
  };

  const handleLogOut = async () => {
    Alert.alert(
      '로그아웃하시겠습니까?',
      '',
      [
        {text: '취소', onPress: () => console.log('취소클릭함')},
        {
          text: '확인',
          onPress: () => {
            if (getNickname === true) {
              axios
                .delete('http://202.31.201.231/session')
                .then(response => {
                  console.log('로그아웃'), props.navigation.navigate('login');
                })
                .catch(e => {
                  console.log('로그아웃 실패');
                  console.log(e);
                });
            }
            console.log('확인클릭함');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const getId = () => {
    axios
      .get('http://202.31.201.231/session')
      .then(({data}) => {
        setusername(data.username);
        setnickname(data.nickname);
        getNickname = true;
        console.log(data.nickname);
      })
      .catch(e => {
        console.log('실패');
        console.log(e);
      });
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('../images/logo.png')} style={styles.imageBox} />
        <View style={styles.idBox}>
          <Text style={styles.idFont}>
            {getNickname === false ? getId() : ''}
            {nickname}
          </Text>
        </View>
      </View>

      <View style={styles.functionContainer}>
        <View style={styles.functionBox}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ChangeUserInfo')}>
            <Text style={styles.functionFont}> 회원 정보 수정</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.functionBox}>
          <TouchableOpacity>
            <Text style={styles.functionFont}> 공지사항</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.functionBox}>
          <TouchableOpacity>
            <Text style={styles.functionFont}> 정보</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.outContainer}>
        <View style={styles.outBox}>
          <TouchableOpacity
            onPress={() => {
              handleLogOut();
            }}>
            <Text style={styles.logOutFont}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.outBox}>
          <TouchableOpacity
            onPress={() => {
              handleSignOut();
            }}>
            <Text style={styles.signOutFont}>계정탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 300,
    alignItems: 'center',
  },

  imageContainer: {
    margin: 50,
    padding: 50,
    paddingBottom: 200,
    width: 300,
    height: 250,
  },

  imageBox: {
    flex: 1,
    paddingBottom: 150,
    alignItems: 'center',
    bottom: 40,
    left: 20,
  },

  idBox: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    bottom: 35,
  },

  idFont: {
    fontSize: 22,
    fontFamily: 'nationalB',
  },

  functionContainer: {
    height: 200,
    borderTopColor: '#979797',
    borderTopWidth: 2,
    borderBottomColor: '#979797',
    borderBottomWidth: 2,
    bottom: 60,
  },

  functionBox: {
    width: 300,
    height: 50,
    marginTop: 10,
    justifyContent: 'center',
  },

  functionFont: {
    fontSize: 22,
    fontFamily: 'nationalB',
  },

  outContainer: {
    width: 300,
    height: 150,
    justifyContent: 'center',
    bottom: 60,
  },

  outBox: {
    width: 300,
    height: 50,
    marginTop: 8,
    justifyContent: 'center',
  },

  logOutFont: {
    fontSize: 18,
    fontFamily: 'nationalB',
  },

  signOutFont: {
    color: 'red',
    fontSize: 18,
    fontFamily: 'nationalB',
  },
});

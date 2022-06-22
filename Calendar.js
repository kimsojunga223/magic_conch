import React, {useState, useRef, useEffect} from 'react';
import 'react-native-gesture-handler';

import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import axios from 'axios';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import HappyEmo from '../svg/HappyEmo1';
import BestEmo from '../svg/BestEmo1';
import SadEmo from '../svg/SadEmo1';
import AngryEmo from '../svg/AngryEmo1';
import SosoEmo from '../svg/SosoEmo1';

function Calendar(props) {
  const [ids, setids] = useState([]);
  const [feelingsCount, setfeelingsCount] = useState([]);
  const [month, setMonth] = useState(moment().format('MM'));
  const [day1, setday1] = useState(moment('2022-06-01', 'YYYY-MM-DD'));
  const [daymo1, setdaymo1] = useState(moment('2022.05.31', 'YYYY.MM.DD'));
  let customDatesStylesTest = [];
  let selectedDayColorTest = [];
  const [customDatesStyles, setcustomDatesStyles] = useState([]);
  const [selectedDayColor, setselectedDayColor] = useState([]);
  let num = 1;
  let id = '';

  const color = [
    '#ffffff',
    '#4bd934',
    '#f5ed25',
    '#fc975f',
    '#ff4343',
    '#47aef8',
  ];

  useEffect(() => {
    const getData = async () => {
      axios
        .get(
          'http://202.31.201.231/diaries/feelings?year=2022&month=' + month,
          {},
        )
        .then(({data}) => {
          setids(data.ids);
          setfeelingsCount(data.feelingsCount);
          console.log(data.ids);
          loadCalender(data.feelings);
          setcustomDatesStyles(customDatesStylesTest);
          setselectedDayColor(selectedDayColorTest);
        })
        .catch(e => {
          console.error(e);
        });
    };
    getData();
  }, [month]);

  const loadCalender = feelings => {
    while (daymo1.add(1, 'days').isSame(day1, 'month')) {
      customDatesStylesTest.push({
        date: daymo1.clone(),
        style: {
          backgroundColor: color[feelings[num]],
        },
        textStyle: {color: 'black', fontSize: 22},
      });
      selectedDayColorTest.push({
        date: daymo1.clone(),
        color: color[feelings[num]],
      });
      num++;
    }
  };

  function onDateChange(date) {
    id = ids[date.format('D')];
    console.log(id);
    props.navigation.push('Diary', {
      id: id,
    });
  }

  function onMonthChange(date) {
    console.log(date.format('YYYY-MM-DD') + '****');
    setMonth(date.format('MM'));
    setdaymo1(
      moment(date.format('YYYY-MM-DD'), 'YYYY-MM-DD')
        .subtract(1, 'month')
        .endOf('month'),
    );
    setday1(moment(date.format('YYYY-MM-DD'), 'YYYY-MM-DD'));
  }

  return (
    <SafeAreaView>
      <View>
        <CalendarPicker
          monthYearHeaderWrapperStyle={{flexDirection: 'row-reverse'}}
          weekdays={['일', '월', '화', '수', '목', '금', '토']}
          months={[
            '년  1 월',
            '년  2 월',
            '년  3 월',
            '년  4 월',
            '년  5 월',
            '년  6 월',
            '년  7 월',
            '년  8 월',
            '년  9 월',
            '년  10 월',
            '년  11 월',
            '년  12 월',
          ]}
          todayBackgroundColor={'transparent'}
          customDatesStyles={customDatesStyles}
          selectedDayColor={selectedDayColor}
          previousTitle="이전달"
          nextTitle="다음달"
          width={410}
          textStyle={{fontFamily: 'nationalB', fontSize: 22}}
          onDateChange={onDateChange}
          onMonthChange={onMonthChange}
        />
      </View>
      <View style={styles.emoContainer}>
        <View style={styles.veryhappy}>
          <BestEmo />
        </View>
        <View style={styles.happy}>
          <HappyEmo />
        </View>
        <View style={styles.soso}>
          <SosoEmo />
        </View>
        <View style={styles.angry}>
          <AngryEmo />
        </View>
        <View style={styles.sad}>
          <SadEmo />
        </View>
      </View>
      <View style={styles.txtContainer}>
        <Text style={styles.veryhappyTxt}>{feelingsCount[1]}</Text>
        <Text style={styles.happyTxt}>{feelingsCount[2]}</Text>
        <Text style={styles.sosoTxt}>{feelingsCount[3]}</Text>
        <Text style={styles.angryTxt}>{feelingsCount[4]}</Text>
        <Text style={styles.sadTxt}>{feelingsCount[5]}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  clalendercontainer: {
    marginTop: 30,
  },
  emoContainer: {
    top: 420,
    position: 'absolute',
  },
  txtContainer: {
    top: 370,
    position: 'absolute',
  },
  RectContainer: {
    flex: 1,
    bottom: 70,
    right: 6,
  },
  veryhappy: {
    position: 'absolute',
    flex: 1,
    top: 25,
    left: 40,
  },
  happy: {
    position: 'absolute',
    flex: 1,
    top: 25,
    left: 110,
  },
  soso: {
    position: 'absolute',
    flex: 1,
    top: 25,
    left: 180,
  },
  angry: {
    position: 'absolute',
    flex: 1,
    top: 25,
    left: 250,
  },
  sad: {
    position: 'absolute',
    flex: 1,
    top: 25,
    left: 320,
  },
  veryhappyTxt: {
    flex: 1,
    top: 30,
    left: 50,
    fontSize: 25,
    fontFamily: 'nationalB',
    color: '#4bd934',
    position: 'absolute',
  },
  happyTxt: {
    flex: 1,
    top: 30,
    left: 120,
    fontSize: 25,
    fontFamily: 'nationalB',
    color: '#FED62C',
    position: 'absolute',
  },
  sosoTxt: {
    flex: 1,
    top: 30,
    left: 190,
    fontSize: 25,
    fontFamily: 'nationalB',
    color: '#fc975f',
    position: 'absolute',
  },
  angryTxt: {
    flex: 1,
    top: 30,
    left: 260,
    fontSize: 25,
    fontFamily: 'nationalB',
    color: '#ff4343',
    position: 'absolute',
  },
  sadTxt: {
    flex: 1,
    top: 30,
    left: 330,
    fontSize: 25,
    fontFamily: 'nationalB',
    color: '#47aef8',
    position: 'absolute',
  },
});
export default Calendar;

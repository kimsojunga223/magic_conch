import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import Main from './Main';
import UserInfo from './UserInfo';
import Community from './Community';

const Tab = createBottomTabNavigator();

export default function TabNav() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="메인"
        component={Main}
        options={{
          title: '메인',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
          tabBarStyle: {height: 60},
        }}
      />
      <Tab.Screen
        name="커뮤니티"
        component={Community}
        options={{
          title: '커뮤니티',
          tabBarIcon: ({color, size}) => (
            <Icon name="users" color={color} size={size} />
          ),
          tabBarStyle: {height: 60},
        }}
      />
      <Tab.Screen
        name="내 정보"
        component={UserInfo}
        options={{
          title: '정보',
          tabBarIcon: ({color, size}) => (
            <Icon name="user-circle" color={color} size={size} />
          ),
          tabBarStyle: {height: 60},
        }}
      />
    </Tab.Navigator>
  );
}

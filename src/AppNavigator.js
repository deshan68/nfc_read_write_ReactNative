import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Home from './screens/Home';
import TagDetailScreen from './screens/TagDetailScreen';
import NfcPromptAndroid from './components/NfcPromptAndroid';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const MainStack = createNativeStackNavigator();

function Main(props) {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{title: 'HOME'}}
      />
      <MainStack.Screen
        name="TagDetail"
        options={{title: 'TAG DETAIL'}}
        component={TagDetailScreen} //after the clickng the read buttn it navigate to this component
      />

      {/* <MainStack.Screen
        name="NdefTypeList"
        component={NdefTypeListScreen} // write option list screen
        options={{title: 'CHOOSE NDEF TYPE'}}
      />
      <MainStack.Screen
        name="NdefWrite"
        component={NdefWriteScreen} // wtrting functions
        options={{title: 'WRITE NDEF'}}
      />
      <MainStack.Screen
        name="ToolKit"
        component={ToolKitScreen} // tool kit screen
        options={{title: 'NFC TOOL KIT'}}
      />
      <MainStack.Screen
        name="TagKit"
        component={TagKitScreen} //tag kit screen
        options={{title: 'NFC TAG KIT'}}
      />
      <MainStack.Screen
        name="CustomTransceive"
        component={CustomTransceiveScreen}
        options={{title: 'CUSTOM TRANSCEIVE'}}
      />
      <MainStack.Screen
        name="SavedRecord"
        component={SavedRecordScreen} // saved records
        options={{title: 'MY SAVED RECORDS'}}
      /> */}
    </MainStack.Navigator>
  );
}

const RootStack = createNativeStackNavigator();

function Root(props) {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}>
      <RootStack.Screen
        name="Main"
        component={Main}
        options={{animationEnabled: false}}
      />
    </RootStack.Navigator>
  );
}

function AppNavigator(props) {
  return (
    <NavigationContainer>
      <Root />
      {/* <NfcPromptAndroid /> */}
    </NavigationContainer>
  );
}

export default AppNavigator;

import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import NfcManager, {
  NfcTech,
  Ndef,
  NfcEvents,
  NfcError,
} from 'react-native-nfc-manager';

export default function NdefWriteScreen() {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState('Waiting for NFC...');
  const [visible, setVisible] = React.useState(false);

  const handleException = ex => {
    if (ex instanceof NfcError.UserCancel) {
      // bypass
    } else if (ex instanceof NfcError.Timeout) {
      Alert.alert('NFC Session Timeout');
    } else {
      console.warn(ex);

      if (Platform.OS === 'ios') {
        NfcManager.invalidateSessionWithErrorIOS(`${ex}`);
      } else {
        Alert.alert('NFC Error', `${ex}`);
      }
    }
  };

  const writeNdef = async ({type, value}) => {
    setVisible(true);
    let result = false;

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to write some NDEF',
      });

      let bytes = null;
      if (type === 'TEXT') {
        bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);
      } else if (type === 'URI') {
        bytes = Ndef.encodeMessage([Ndef.uriRecord(value)]);
      } else if (type === 'WIFI_SIMPLE') {
        bytes = Ndef.encodeMessage([Ndef.wifiSimpleRecord(value)]);
      } else if (type === 'VCARD') {
        const {name, tel, org, email} = value;
        const vCard = `BEGIN:VCARD\nVERSION:2.1\nN:;${name}\nORG: ${org}\nTEL;HOME:${tel}\nEMAIL:${email}\nEND:VCARD`;

        bytes = Ndef.encodeMessage([
          Ndef.record(Ndef.TNF_MIME_MEDIA, 'text/vcard', [], vCard),
        ]);
      }

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);

        if (Platform.OS === 'ios') {
          await NfcManager.setAlertMessageIOS('Success');
        }

        result = true;
        setLoading('Success...');
      }
    } catch (ex) {
      handleException(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Write to tag..."
        style={{borderWidth: 1, borderColor: 'black', width: 300, padding: 10}}
        value={value}
        onChangeText={setValue}
        autoFocus={true}
      />
      <Button title="Write" onPress={() => writeNdef({type: 'TEXT', value})} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        style={styles.centeredView}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{loading}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setVisible(false);
                setValue('');
              }}>
              <Text style={styles.textStyle}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 13,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

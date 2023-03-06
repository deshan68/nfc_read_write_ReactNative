import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import React from 'react';
import NfcProxy from '../NfcProxy';
import NfcManager, {
  NfcTech,
  Ndef,
  NfcEvents,
  NfcError,
} from 'react-native-nfc-manager';

export default function Home({navigation, route}) {
  const [loading, setLoading] = React.useState('Scannig...');
  const [visible, setVisible] = React.useState(false);

  const readTag = async () => {
    let tag = null;
    setVisible(true);
    try {
      await NfcManager.requestTechnology([NfcTech.Ndef]);

      tag = await NfcManager.getTag();
      tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();

      setLoading(' complete');
    } catch (ex) {
      // for tag reading, we don't actually need to show any error
      console.log(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setTimeout(() => {
        setVisible(false);
        setLoading('Scannig...');
        navigation.navigate('TagDetail', {tag});
      }, 2000);
    }

    return tag;
  };

  function cancelNfcScan() {
    setTimeout(() => {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    }, 200);
    setVisible(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{backgroundColor: 'blue', padding: 10}}
        onPress={
          () => readTag()
          //   const tag = await NfcProxy.readTag();
          //   if (tag) {
          //     navigation.navigate('TagDetail', {tag});
          //   }
        }>
        <Text style={{color: 'white'}}>Read</Text>
      </TouchableOpacity>
      {/* -------------------------------------- */}
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={visible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{loading}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => cancelNfcScan()}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
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
    padding: 10,
    elevation: 2,
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

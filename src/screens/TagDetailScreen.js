import {StyleSheet, Text, View, useEffect} from 'react-native';
import React from 'react';
import NfcManager, {
  NfcTech,
  Ndef,
  NfcEvents,
  NfcError,
} from 'react-native-nfc-manager';
import NdefMessage from '../components/NdefMessage';

export default function TagDetailScreen({navigation, route}) {
  const {tag} = route.params;
  const ndef =
    Array.isArray(tag.ndefMessage) && tag.ndefMessage.length > 0
      ? tag.ndefMessage[0]
      : null;

  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>NDEF</Text>
        {ndef ? <NdefMessage ndef={ndef} /> : <Text>---</Text>}
      </View>
      <Text>{JSON.stringify(tag, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

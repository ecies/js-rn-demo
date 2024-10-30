/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Buffer } from 'buffer';
import { decrypt, ECIES_CONFIG, encrypt, PrivateKey } from 'eciesjs';
import type { PropsWithChildren } from 'react';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

globalThis.Buffer = Buffer;

ECIES_CONFIG.ellipticCurve = 'x25519';
ECIES_CONFIG.symmetricAlgorithm = 'xchacha20';

const encoder = new TextEncoder();
// TextDecoder is not working!

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const msg = encoder.encode('hello world🌍');
  const key = new PrivateKey();
  const encrypted = encrypt(key.publicKey.compressed, msg);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
            <Section title="Check encrypt">
            <Text style={styles.highlight}>
              Encrypted: {encrypted}
            </Text>
          </Section>
          <Section title="Check decrypt">
            <Text style={styles.highlight}>
              Decrypted: {Buffer.from(decrypt(key.secret, encrypted)).toString()}
            </Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

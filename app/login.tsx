import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  Alert,
} from 'react-native';

import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();
  const theme = useColorScheme();

  const logar = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      Alert.alert('Bem-vindo!', 'Login realizado com sucesso!');
      router.replace('/home'); // Redireciona para a tela principal
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const irParaCadastro = () => {
    router.push('/cadastro');
  };

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#000' : '#f7f7f7'}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={logar}
          accessible
          accessibilityLabel="Vamos começar"
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAlternative}
          onPress={irParaCadastro}
          accessible
          accessibilityLabel="Ainda não tenho uma conta"
        >
          <Text style={styles.buttonText}>Ainda não tenho uma conta</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: rw(5),
    backgroundColor: '#201937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: rf(3.5),
    fontWeight: 'bold',
    marginBottom: rh(5),
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: rh(6),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: rh(2),
    paddingHorizontal: rw(4),
    fontSize: rf(2),
    backgroundColor: '#fff',
    width: rw(75),
  },
  button: {
    backgroundColor: '#FE3761',
    height: rh(5),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(2),
    width: rw(30),
  },
  buttonAlternative: {
    height: rh(5),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(2),
    width: rw(60),
  },
  buttonText: {
    color: '#fff',
    fontSize: rf(2.2),
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();

  const cadastrar = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      router.replace('/home'); // redireciona para a tela Home
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar', error.message);
    }
  };

  const irParaLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        placeholderTextColor="#aaa"
      />
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
        placeholder="CPF"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={cadastrar}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
                style={styles.buttonAlternative}
                onPress={irParaLogin}
                accessible
                accessibilityLabel="Ainda não tenho uma conta"
              >
                <Text style={styles.buttonText}>Já tenho uma conta</Text>
              </TouchableOpacity>
    </View>
    
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: rw(5),
    justifyContent: 'center',
    backgroundColor: '#201937',
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
  buttonText: {
    color: '#fff',
    fontSize: rf(2.2),
    fontWeight: 'bold',
  },
  buttonAlternative: {
    height: rh(5),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(2),
    width: rw(60),
  },
});

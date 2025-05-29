import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const router = useRouter();

  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.replace('/login');
        return;
      }

      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        setNome(dados.nome || '');
        setEmail(dados.email || user.email || '');
        setCpf(dados.cpf || '');
        setTelefone(dados.telefone || '');
      }
    };

    carregarDados();
  }, []);

  const salvar = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const ref = doc(db, 'usuarios', user.uid);
      await updateDoc(ref, {
        nome,
        cpf,
        telefone,
      });

      Alert.alert('Sucesso', 'Dados atualizados!');
    } catch (e) {
      Alert.alert('Erro', String(e));
    }
  };

  const sair = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity style={styles.buttonSair} onPress={sair}>
            <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
        </View>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
      <TextInput style={styles.input} value={email} editable={false} placeholder="Email" />
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} placeholder="CPF" />
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="Telefone" />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
        
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},
    container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#201937' 
},
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#fff',
},
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8,
    padding: 10, 
    marginBottom: 10,
    backgroundColor:'#fff',
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
    fontWeight: 'bold' 
},

  buttonSair:{
   backgroundColor: 'red',
   height: rh(5),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(5),
  }
});


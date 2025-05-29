import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, addDoc, Timestamp, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { red } from 'react-native-reanimated/lib/typescript/Colors';


interface Transacao {
  id: string;
  tipo: 'ganho' | 'gasto';
  valor: number;
  descricao: string;
  data: Timestamp;
}

const HomeScreen: React.FC = () => {
  const [historico, setHistorico] = useState<Transacao[]>([]);
  const [saldo, setSaldo] = useState<number>(0);
  const [valor, setValor] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        carregarTransacoes(user.uid);
      }
      setCarregando(false);
    });

    return unsubscribeAuth;
  }, []);

  const carregarTransacoes = (uid: string) => {
    const transacoesRef = collection(db, 'transacoes');
    const q = query(transacoesRef, where('uid', '==', uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Transacao[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transacao[];

      setHistorico(data);

      const novoSaldo = data.reduce((acc, item) => {
        return item.tipo === 'ganho' ? acc + item.valor : acc - item.valor;
      }, 0);

      setSaldo(novoSaldo);
    });

    return unsubscribe;
  };

  const registrar = async (tipo: 'ganho' | 'gasto') => {
    const valorNumerico = parseFloat(valor);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'Digite um valor válido.');
      return;
    }

    try {
      await addDoc(collection(db, 'transacoes'), {
        tipo,
        valor: valorNumerico,
        descricao,
        data: Timestamp.now(),
        uid: user.uid, // associar ao usuário logado
      });

      setValor('');
      setDescricao('');
    } catch (error) {
      Alert.alert('Erro ao salvar', String(error));
    }
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const sair = async () => {
  try {
    await signOut(auth);
    router.replace('/login');
  } catch (error) {
    Alert.alert('Erro ao sair', String(error));
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.saldo}>Saldo: R$ {saldo.toFixed(2)}</Text>

      <TextInput
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Registrar Gasto" onPress={() => registrar('gasto')} color="#e74c3c" />
        <Button title="Registrar Ganho" onPress={() => registrar('ganho')} color="#2ecc71" />
      </View>

      <Text style={styles.saldo}>Histórico:</Text>

      <FlatList
        data={historico.sort((a, b) => b.data.toMillis() - a.data.toMillis())}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.tipo}>{item.tipo.toUpperCase()}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
            <Text style={styles.data}>
              {new Date(item.data.toMillis()).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#201937',
  },
  saldo: {
    fontSize: 24,
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
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  tipo: {
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 16,
  },
  valor: {
    fontSize: 16,
    color: 'green',
  },
  data: {
    fontSize: 12,
    color: 'gray',
  },
  buttonText: {
      color: '#fff',
      fontSize: rf(2.2),
      fontWeight: 'bold',
    },
  
});

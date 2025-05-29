// app/tabs/relatorio.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';

interface Transacao {
  id: string;
  tipo: 'ganho' | 'gasto';
  valor: number;
  descricao: string;
  data: any;
}

export default function Relatorio() {
  const [ganhos, setGanhos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace('/login');
      return;
    }

    const q = query(collection(db, 'transacoes'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalGanhos = 0;
      let totalGastos = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as Transacao;
        if (data.tipo === 'ganho') {
          totalGanhos += data.valor;
        } else {
          totalGastos += data.valor;
        }
      });

      setGanhos(totalGanhos);
      setGastos(totalGastos);
    });

    return unsubscribe;
  }, []);

  const data = [
    {
      name: 'Ganhos',
      value: ganhos,
      color: '#2ecc71',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Gastos',
      value: gastos,
      color: '#e74c3c',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatório Financeiro</Text>

      {ganhos === 0 && gastos === 0 ? (
        <Text style={{ marginTop: 20, fontSize: 16, color:'#fff' }}>Sem dados para exibir.</Text>
      ) : (
        <PieChart
          data={data}
          width={Dimensions.get('window').width - 1000}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: () => '#333',
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      )}

      <View style={styles.resumo}>
        <Text style={styles.item}>Ganhos: R$ {ganhos.toFixed(2)}</Text>
        <Text style={styles.item}>Gastos: R$ {gastos.toFixed(2)}</Text>
        <Text style={styles.item}>
          Saldo final: R$ {(ganhos - gastos).toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#201937',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  resumo: {
    marginTop: 30,
    alignItems: 'flex-start',
    width: '100%',
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
  },
});

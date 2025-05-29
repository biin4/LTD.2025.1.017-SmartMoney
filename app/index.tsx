import React from 'react';

// Componentes
import {
  StatusBar,
  useColorScheme,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

// Responsividade
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

// Navegação
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const theme = useColorScheme();

  const Irparalogin = () => {
    router.push('/login');
  };

  const IrparaCadastro = () => {
    router.push('/cadastro');
  };

  return (
    <>
      <View style={styles.container}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>$martMoney: Seu app de controle financeiro!</Text>

        <TouchableOpacity style={styles.button} onPress={Irparalogin}>
          <Text style={styles.buttonText}>Vamos começar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonAlternative} onPress={IrparaCadastro}>
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
  logo: {
    width: rw(60),
    height: rh(30),
  },
  title: {
    fontSize: rf(3.5),
    fontWeight: 'bold',
    marginBottom: rh(5),
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    backgroundColor: '#FE3761',
    height: rh(6),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(2),
    width: rw(70),
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

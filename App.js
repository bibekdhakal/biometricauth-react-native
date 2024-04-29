import React, {useState, useEffect, useRef} from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
} from 'react-native';
import {
  storeCredentialsInSecureStorage,
  retrieveCredentialsFromSecureStorage,
} from './src/utils/secureStorage';

const App = () => {
  const biometricsAvailable = useRef(false); // Moved inside the component

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const checkBiometrics = async () => {
      const rnBiometrics = new ReactNativeBiometrics();
      const isAvailable = await rnBiometrics.isSensorAvailable();

      if (isAvailable.available && isAvailable.biometryType == 'FaceID') {
        biometricsAvailable.current = isAvailable;
      }
    };
    checkBiometrics();
  }, []);

  const handleBioAuth = async () => {
    try {
      const credentials = await retrieveCredentialsFromSecureStorage();

      if (!credentials) {
        setError('No credentials stored for biometric login.');
        return;
      }

      const rnBiometrics = new ReactNativeBiometrics();
      const {success} = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate using biometrics',
      });

      if (success) {
        setModalMessage('Biometric authentication successful');
        setShowModal(true);
      } else {
        setModalMessage('Biometric authentication failed');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      setModalMessage('An error occurred during biometric authentication.');
      setShowModal(true);
    }
  };

  const handleLogin = async () => {
    if (email && password) {
      await storeCredentialsInSecureStorage({email, password});
      setModalMessage('Login successful');
      setShowModal(true);
    }
  };

  const CustomModal = ({visible, message, onClose}) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{message}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Email</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Text style={styles.text}>Password</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginButton}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBioAuth}>
        <Text style={styles.biometricButton}>Login with Biometrics</Text>
      </TouchableOpacity>
      <CustomModal
        visible={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontColor: 'black',
  },
  loginButton: {
    backgroundColor: '#007bff',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    colorolor: '#fff',
  },
  biometricButton: {
    backgroundColor: '#4caf50',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    color: '#fff',
  },
  text: {
    width: '100%',
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
  },
});

export default App;

import * as Keychain from 'react-native-keychain';

const KEYCHAIN_SERVICE = 'AttendanceApp';

const storeCredentialsInSecureStorage = async credentials => {
  try {
    await Keychain.setGenericPassword(credentials.email, credentials.password, {
      service: KEYCHAIN_SERVICE,
    });
  } catch (error) {
    console.error('Error storing credentials:', error);
  }
};

const retrieveCredentialsFromSecureStorage = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    if (credentials) {
      return {email: credentials.username, password: credentials.password};
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    return null;
  }
};

export {storeCredentialsInSecureStorage, retrieveCredentialsFromSecureStorage};

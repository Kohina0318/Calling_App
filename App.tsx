import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  requestCallLogPermission,
  requestPhoneStatePermission,
  requestWriteExternalStoragePermission,
  requestReadExternalStoragePermission,
  requestRecordAudioStoragePermission,
  requestRecordSendSMSPermission,
  requestLocationPermission,
} from './src/UsePermissions';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';


const App = () => {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    handle();
  }, []);

  const handle = async () => {
    await requestCallLogPermission();
    await requestPhoneStatePermission();
    await requestWriteExternalStoragePermission();
    await requestReadExternalStoragePermission();
    await requestRecordAudioStoragePermission();
    await requestRecordSendSMSPermission();
    await requestLocationPermission();
  };

  const handleCall = async () => {
    try {
      await RNImmediatePhoneCall.immediatePhoneCall('8357802349');
    } catch (error) {
      throw new Error('Error setting whitelist: ' + error);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontWeight: '600', fontSize: 20, color: '#000'}}>
        {msg}
      </Text>
      <TouchableOpacity
        onPress={handleCall}
        activeOpacity={0.5}
        style={{
          backgroundColor: 'blue',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
        }}>
        <Text style={{color: '#fff', fontWeight: '600'}}>Start Call</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;

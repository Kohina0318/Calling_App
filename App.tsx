import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,PermissionsAndroid,
  Platform
} from 'react-native';

const { RNImmediatePhoneCall } = NativeModules;

const App = () => {
  const [msg, setMsg] = useState("");

  
  const handle = async () => {
    try {
     await  RNImmediatePhoneCall.immediatePhoneCall('8357802349');
    } catch (error) {
      throw new Error("Error setting whitelist: " + error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
      <Text style={{ fontWeight: "600", fontSize: 20, color: "#000" }}>{msg}</Text>
      <TouchableOpacity onPress={handle} activeOpacity={0.5} style={{ backgroundColor: 'blue', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 }}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>Start Call</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;


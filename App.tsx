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
import CallLogs from 'react-native-call-log';
import CallDetectorManager from 'react-native-call-detection';

const App = () => {
  const [msg, setMsg] = useState('');
  const [phoneNo, setphoneNo] = useState('8357802349');
  var phoneState = 0;

  useEffect(() => {
    requestPhonePermission();
  }, []);

  // const handle = async () => {
  //   await requestCallLogPermission();
  //   await requestPhoneStatePermission();
  //   await requestWriteExternalStoragePermission();
  //   await requestReadExternalStoragePermission();
  //   await requestRecordAudioStoragePermission();
  //   await requestRecordSendSMSPermission();
  //   await requestLocationPermission();
  // };

  const handleCall = async () => {
    try {
      await RNImmediatePhoneCall.immediatePhoneCall(phoneNo);
    } catch (error) {
      throw new Error('Error setting whitelist: ' + error);
    }
  };

  async function requestPhonePermission() {
    if (Platform.OS == 'android') {
      try {
        const userResponse = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          // PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS
        ]).then(() => {
          startListenerTapped();
        });
        // console.log({userResponse});
      } catch (err) {
        alert(JSON.stringify(err));
      }
    } else {
      alert(
        'Sorry! You can’t get call logs in iOS devices because of the security concern',
      );
    }
  }

  function startListenerTapped() {
    const callDetector = new CallDetectorManager(
      (event, phoneNumber) => {
        // For iOS event will be either "Connected",
        // "Disconnected","Dialing" and "Incoming"

        // For Android event will be either "Offhook",
        // "Disconnected", "Incoming" or "Missed"
        // phoneNumber should store caller/called number

        if (event === 'Disconnected') {
          console.log('Disconnected---------------------------->', phoneNumber);
          // Do something call got disconnected
          CallLogs.loadAll(1)
            .then(c => {
              console.log('CallLogs....data...', c[0]);
              if (c[0].duration != 0) {
                console.log('If callLog', c[0].duration);

                var hours = new Date().getHours(); //Current Hours
                var min = new Date().getMinutes(); //Current Minutes
                var sec =
                  new Date().getSeconds() < 10
                    ? '0' + new Date().getSeconds()
                    : new Date().getSeconds();
                var finalEndTime = hours + ':' + min + ':' + sec;
                console.log('finalEndTime....', finalEndTime);
              }
            })
            .catch(err => {
              console.log('callLog Error...', err);
            });

          phoneState = 0;

        } else if (event === 'Connected') {
          console.log('Connected---------------------------->', phoneNumber);
          // Do something call got connected
          // This clause will only be executed for iOS
        } else if (event === 'Incoming') {
          console.log('Incoming---------------------------->', phoneNumber);
          // Do something call got incoming
          var date = new Date().getDate(); //Current Date
          var month = new Date().getMonth() + 1; //Current Month
          var year = new Date().getFullYear(); //Current Year

          var hours = new Date().getHours(); //Current Hours
          var min = new Date().getMinutes(); //Current Minutes
          var sec =
            new Date().getSeconds() < 10
              ? '0' + new Date().getSeconds()
              : new Date().getSeconds();
          var finalstarttime = hours + ':' + min + ':' + sec;
          var finalcalldate = year + '-' + month + '-' + date;

          console.log(
            `finalstarttime = ${finalstarttime} and finalcalldate = ${finalcalldate}`,
          );

          phoneState = 1;

        } else if (event === 'Dialing') {
          console.log('Dialing---------------------------->', phoneNumber);
          // Do something call got dialing
          // This clause will only be executed for iOS
        } else if (event === 'Offhook') {
          console.log('Offhook---------------------------->', phoneNumber);
          //Device call state: Off-hook.
          // At least one call exists that is dialing,
          // active, or on hold,
          // and no calls are ringing or waiting.
          // This clause will only be executed for Android

          // Example.activeButton('Inbound').then(() => {
            // console.log('Button Active');
          // });

          if (phoneState == 0) {
            console.log('phoneState', phoneState,"OutGoing");

            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year

            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec =
              new Date().getSeconds() < 10
                ? '0' + new Date().getSeconds()
                : new Date().getSeconds();

            var finalstarttime = hours + ':' + min + ':' + sec;
            var finalcalldate = year + '-' + month + '-' + date;

            console.log(
              `finalstarttime = ${finalstarttime} and finalcalldate = ${finalcalldate}`,
            );
          } else {
            // Example.activeButton('Inbound').then(() => {
              console.log('phoneState',phoneState, "Incoming");
            // });
          }
        } else if (event === 'Missed') {
          console.log('Missed---------------------------->', phoneNumber);
          // Do something call got missed
          // This clause will only be executed for Android
        }
      },
      false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {
        console.log('false');
      }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message:
          'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    );
    return callDetector;
  }

  // function stopListenerTapped() {
  //   callDetector && callDetector.dispose();
  // }

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
  //         {
  //           title: 'Call Log Example',
  //           message:
  //             'Access your call logs',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         }
  //       )
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {

  //         CallLogs.load(1 ).then(c => console.log(c));
  //       } else {
  //         console.log('Call Log permission denied');
  //       }
  //     }
  //     catch (e) {
  //       console.log(e);
  //     }
  //   })()
  // }, []);

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

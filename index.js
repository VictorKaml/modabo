/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(...);
TrackPlayer.registerPlaybackService(() => require('./service'));

if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root');
  AppRegistry.runApplication(appName, {rootTag});
}


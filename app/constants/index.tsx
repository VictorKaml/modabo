import {Dimensions, Platform} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export const CONTENT_SPACING = 15;

const SAFE_BOTTOM =
  Platform.select({
    ios: StaticSafeAreaInsets.safeAreaInsetsBottom,
  }) ?? 0;

export const SAFE_AREA_PADDING = {
  paddingLeft: StaticSafeAreaInsets.safeAreaInsetsLeft + CONTENT_SPACING,
  paddingTop: StaticSafeAreaInsets.safeAreaInsetsTop + CONTENT_SPACING,
  paddingRight: StaticSafeAreaInsets.safeAreaInsetsRight + CONTENT_SPACING,
  paddingBottom: SAFE_BOTTOM + CONTENT_SPACING,
};

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 10;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android:
    Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

// Control Button like Flash
export const CONTROL_BUTTON_SIZE = 40;

export const PAWAPAY_API =
  'eyJraWQiOiIxIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJjOTMxOGRhNi01Mzk1LTQ2YTEtYjVmNy1hOTdiZDJiMDg0ZTQiLCJzdWIiOiIxMTA2IiwiaWF0IjoxNzEwNzc4MDY0LCJleHAiOjIwMjYzMTA4NjQsInBtIjoiREFGLFBBRiIsInR0IjoiQUFUIn0.41uvBoh9uixeqzavURZEEoQJpWWXBjQEOimXx5bH61w';
export const DEPOSIT_ENDPOINT = 'https://api.sandbox.pawapay.cloud/deposits';

export const PAYOUT_ENDPOINT = 'https://api.sandbox.pawapay.cloud/payouts';

export const images = {
  neon_logo: require('../assets/img/logo_neon.png'),
};

export const N = 12;
export const SQUARE_SIZE = 12;

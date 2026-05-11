import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { floatingTabBarContentPaddingBottom } from '@/constants/layout';

export function useTabBarContentPadding() {
  const insets = useSafeAreaInsets();
  return floatingTabBarContentPaddingBottom(insets.bottom);
}

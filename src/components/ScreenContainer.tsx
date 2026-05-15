import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout } from '@/theme';

interface ScreenContainerProps {
  children: ReactNode;
  /** Override horizontal padding. Defaults to `layout.screenPadding` (16). */
  paddingHorizontal?: number;
}

export function ScreenContainer({
  children,
  paddingHorizontal = layout.screenPadding,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.inner, { paddingHorizontal }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  inner: {
    flex: 1,
  },
});

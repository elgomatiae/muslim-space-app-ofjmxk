
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';
import { colors } from '../../styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={colors.primary}
      backgroundColor={colors.background}
      blurEffect="systemMaterial"
    >
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tracker">
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <Label>Tracker</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="learning">
        <Icon sf={{ default: 'play.rectangle', selected: 'play.rectangle.fill' }} />
        <Label>Learning</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="dawah">
        <Icon sf={{ default: 'star', selected: 'star.fill' }} />
        <Label>Dawah</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="duas">
        <Icon sf={{ default: 'hands.sparkles', selected: 'hands.sparkles.fill' }} />
        <Label>Duas</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

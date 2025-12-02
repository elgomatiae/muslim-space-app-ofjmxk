
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { router } from "expo-router";

export function AiSheikhButton() {
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/aiSheikh')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol 
        ios_icon_name="bubble.left.and.bubble.right.fill" 
        android_material_icon_name="chat" 
        color={colors.primary} 
        size={24}
      />
    </Pressable>
  );
}

export function HeaderRightButton() {
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/aiSheikh')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol 
        ios_icon_name="plus" 
        android_material_icon_name="add" 
        color={colors.primary} 
      />
    </Pressable>
  );
}

export function HeaderLeftButton() {
  return (
    <Pressable
      onPress={() => router.push('/(tabs)/aiSheikh')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol 
        ios_icon_name="gear" 
        android_material_icon_name="settings" 
        color={colors.primary} 
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerButtonContainer: {
    padding: 6,
    backgroundColor: colors.card,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
});

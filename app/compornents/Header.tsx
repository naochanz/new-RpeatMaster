import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native'
import React from 'react'
import { theme } from '@/constants/Theme'
import { Settings } from 'lucide-react-native'

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>RepeatMaster</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={theme.colors.secondary[700]} />
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary[200],
    ...theme.shadows.sm,
  },
  appTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.secondary[900],
    fontFamily: 'ZenKaku-Bold',
    letterSpacing: 0.5,
  },
  settingsButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
});

export default Header
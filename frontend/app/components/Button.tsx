import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../utils/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  loading = false 
}) => {
  const getButtonStyle = () => {
    if (disabled) return [styles.button, styles.disabled];
    switch (variant) {
      case 'primary':
        return [styles.button, styles.primary];
      case 'secondary':
        return [styles.button, styles.secondary];
      case 'outline':
        return [styles.button, styles.outline];
      default:
        return styles.button;
    }
  };

  const getTextStyle = () => {
    if (disabled) return [styles.text, styles.disabledText];
    if (variant === 'outline') return [styles.text, styles.outlineText];
    return styles.text;
  };

  return (
    <TouchableOpacity 
      style={getButtonStyle()} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.textInverse} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.border,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textInverse,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.textLight,
  },
});
import React, {useCallback} from 'react';
import {StyleSheet, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';

import {Colors} from '@assets/Colors';
import {scaler} from '@utils/Scaler';
import {Text} from './Text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
}) => {
  const getButtonStyle = useCallback(() => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      default:
        return styles.primaryButton;
    }
  }, [variant]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        getButtonStyle(),
        style,
        disabled && styles.disabledButton,
      ]}>
      <Text
        style={[
          styles.text,
          {color: variant == 'primary' ? Colors.white : Colors.primary},
          textStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: scaler(13),
    borderRadius: scaler(10),
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: scaler(1),
    borderColor: Colors.primary,
    color: Colors.primary,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  text: {
    fontSize: scaler(16),
    fontWeight: 700,
  },
});

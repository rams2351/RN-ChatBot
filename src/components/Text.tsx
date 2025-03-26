import {Colors} from '@assets/Colors';
import {Fonts} from '@assets/Fonts';
import React, {FC, useMemo} from 'react';
import {
  Platform,
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';

type FontType =
  | 'bold'
  | 'extraLight'
  | 'light'
  | 'medium'
  | 'regular'
  | 'extraBold'
  | 'semiBold';
interface MyTextStyle extends TextStyle {
  type?: FontType;
}

interface TextProps extends RNTextProps {
  style?: StyleProp<MyTextStyle> | undefined;
}

export const Text: FC<TextProps> = props => {
  let {style, ...rest} = props;
  const styles = useMemo(() => {
    const styles = {...StyleSheet.flatten(style ?? {})};
    let fontFamily = Fonts.regular;
    let fontWeight = styles?.fontWeight;
    if (Platform.OS == 'android') {
      fontWeight = undefined;
      if (styles?.fontWeight) {
        switch (styles?.fontWeight) {
          case '500':
            fontFamily = Fonts.medium;
            break;
          case '600':
            fontFamily = Fonts.bold;
            break;
        }
      }
      if (styles?.fontStyle == 'italic' && fontFamily != Fonts.regular) {
        fontFamily = fontFamily + 'Italic';
        delete styles.fontStyle;
      }
    }
    return StyleSheet.create({
      textStyle: {
        color: Colors.black,
        fontFamily,
        fontWeight,
        ...styles,
        includeFontPadding: false,
      },
    });
  }, [style]);

  return (
    <RNText
      {...rest}
      style={styles.textStyle}
      allowFontScaling={false}
      suppressHighlighting={true}
    />
  );
};

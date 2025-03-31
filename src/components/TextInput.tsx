import {capitalize} from 'lodash';
import React, {FC, forwardRef, RefAttributes, useMemo, useState} from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  Merge,
  RegisterOptions,
} from 'react-hook-form';
import {
  Button,
  ColorValue,
  Dimensions,
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  InputAccessoryView,
  Keyboard,
  Platform,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import {Colors} from '@assets/Colors';
import {Fonts} from '@assets/Fonts';
import {scaler} from '@utils/Scaler';
import {Text} from './Text';

interface TextInputProps extends RNTextInputProps {
  fontFamily?:
    | 'bold'
    | 'extraLight'
    | 'light'
    | 'medium'
    | 'regular'
    | 'extraBold'
    | 'semiBold';
  containerStyle?: ViewStyle;
  iconContainerStyle?: StyleProp<ViewStyle>;
  textInputContainer?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ImageStyle>;
  rightIconStyle?: StyleProp<ImageStyle>;
  disabled?: boolean;
  onPress?: (e?: GestureResponderEvent) => void;
  onPressLeftIcon?: (e?: GestureResponderEvent) => void;
  onPressRightIcon?: (e?: GestureResponderEvent) => void;
  value?: string;
  placeholder?: string;
  title?: string | null;
  height?: number;
  control?: Control<any>;
  required?: boolean | string;
  leftIcon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  name?: string;
  errors?: FieldErrors | Merge<FieldError, FieldErrors<any>>;
  backgroundColor?: ColorValue;
  limit?: number;
  borderColor?: ColorValue;
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  placeholderTextColor?: ColorValue;
  activeOpacity?: number;
  format?: any;
}

export const TextInput: FC<TextInputProps & RefAttributes<any>> = forwardRef(
  (props, ref) => {
    const [isFocused, setFocused] = useState(false);
    const {
      format,
      iconContainerStyle,
      style,
      leftIconStyle,
      rightIconStyle,
      borderColor = Colors.border,
      backgroundColor,
      limit,
      placeholder,
      onFocus,
      textInputContainer,
      placeholderTextColor,
      onBlur,
      onPressLeftIcon,
      onPressRightIcon,
      multiline,
      fontFamily = 'regular',
      leftIcon,
      rightIcon,
      errors,
      control,
      title = '',
      required,
      name = '',
      rules,
      onChangeText,
      onPress,
      activeOpacity = 0.7,
      height = scaler(24),
      value,
      containerStyle,
      disabled,
      ...rest
    } = props;

    const errorName = useMemo(() => {
      if (name.includes('.')) {
        return name.substring(name.lastIndexOf('.') + 1);
      } else {
        return name;
      }
    }, [name]);

    const styles = useMemo(() => {
      return StyleSheet.create({
        textInputStyle: {
          paddingRight: rightIcon ? scaler(40) : scaler(5),
          fontSize: scaler(13),
          fontFamily: Fonts?.[fontFamily],
          fontWeight: '400',
          paddingLeft: leftIcon ? scaler(35) : scaler(10),
          minHeight: multiline ? height + scaler(4) : undefined,
          color: Colors.black,
          textAlignVertical: !multiline ? 'center' : 'top',
          height: scaler(40),
          ...StyleSheet.flatten(style),
          paddingVertical: 0,
          width: '100%',
          includeFontPadding: false,
        },
        containerStyle: {
          overflow: 'hidden',
          marginTop: scaler(1),
          padding: scaler(2),
          ...StyleSheet.flatten(containerStyle),
        },
        accessory: {
          width: Dimensions.get('window').width,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: '#F8F8F8',
          paddingHorizontal: scaler(8),
        },
        iconContainerStyle: {
          position: 'absolute',
          justifyContent: 'center',
          ...StyleSheet.flatten(iconContainerStyle),
        },
        textInputContainer: {
          justifyContent: 'center',
          minHeight: scaler(45),
          borderColor:
            (errors && errors[name])?.message || (errors && errors[name])?.type
              ? Colors.darkRed
              : isFocused
              ? Colors.primary
              : borderColor,
          paddingBottom: multiline && limit ? scaler(25) : scaler(0),
          marginTop: scaler(5),
          borderWidth: scaler(1),
          borderRadius: scaler(10),
          backgroundColor: Colors.white,
          overflow: 'hidden',
          ...StyleSheet.flatten(textInputContainer),
        },
      });
    }, [
      style,
      height,
      containerStyle,
      fontFamily,
      leftIcon,
      rightIcon,
      (errors && errors[name])?.message || (errors && errors[name])?.type,
      isFocused,
    ]);

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        disabled={!onPress || disabled}
        style={styles.containerStyle}>
        {title != null && (placeholder || title) ? (
          <Text
            style={{
              fontSize: scaler(12),
              fontWeight: '500',
              color: errors && errors[name] ? Colors.darkRed : Colors.darkGrey,
              marginLeft: scaler(0),
              marginBottom: scaler(3),
            }}>
            {title || placeholder}
            {required ? <Text style={{color: Colors.red}}> *</Text> : ''}
          </Text>
        ) : undefined}
        <View
          pointerEvents={onPress || disabled ? 'none' : undefined}
          style={styles.textInputContainer}>
          {control ? (
            <Controller
              control={control}
              name={name}
              rules={{required: required, ...rules}}
              defaultValue=""
              render={({
                field: {onChange, onBlur: onBlurC, value, ref: cRef},
              }) => (
                <>
                  <RNTextInput
                    {...rest}
                    ref={r => {
                      if (ref) {
                        if (typeof ref == 'function') {
                          ref(r);
                        } else {
                          ref.current = r;
                        }
                      }
                      cRef(r);
                    }}
                    style={styles.textInputStyle}
                    placeholderTextColor={
                      placeholderTextColor ?? Colors.darkGrey
                    }
                    placeholder={title == null || !isFocused ? placeholder : ''}
                    allowFontScaling={false}
                    value={format ? format(value) : value}
                    multiline={multiline}
                    autoCorrect={props?.autoCorrect ?? multiline}
                    spellCheck={
                      props?.spellCheck ?? props?.autoCorrect ?? multiline
                    }
                    inputAccessoryViewID={multiline ? name : undefined}
                    maxLength={limit ?? props?.maxLength}
                    onFocus={e => {
                      setFocused(true);
                      onFocus && onFocus(e);
                    }}
                    onBlur={e => {
                      setFocused(false);
                      onBlurC();
                      onBlur && onBlur(e);
                    }}
                    onChangeText={text => {
                      onChange(text);
                      if (onChangeText) onChangeText(text);
                    }}
                  />
                  {leftIcon ? (
                    <TouchableOpacity
                      disabled={!onPressLeftIcon}
                      onPress={onPressLeftIcon}
                      activeOpacity={0.7}
                      style={[
                        styles?.iconContainerStyle,
                        {
                          left: scaler(10),
                        },
                      ]}>
                      <Image style={leftIconStyle} source={leftIcon} />
                    </TouchableOpacity>
                  ) : null}
                  {rightIcon ? (
                    <TouchableOpacity
                      disabled={!onPressRightIcon}
                      onPress={onPressRightIcon}
                      activeOpacity={0.7}
                      style={[
                        styles?.iconContainerStyle,
                        {
                          right: scaler(10),
                        },
                      ]}>
                      <Image style={rightIconStyle} source={rightIcon} />
                    </TouchableOpacity>
                  ) : null}

                  {multiline && Platform.OS == 'ios' && (
                    <InputAccessoryView
                      style={{alignItems: 'flex-end'}}
                      nativeID={name}>
                      <View style={styles.accessory}>
                        <Button
                          onPress={() => Keyboard.dismiss()}
                          title="Done"
                        />
                      </View>
                    </InputAccessoryView>
                  )}
                  {multiline && limit && isFocused && (
                    <Text
                      style={{
                        position: 'absolute',
                        color: '#9A9A9A',
                        fontSize: scaler(10),
                        end: scaler(10),
                        bottom: scaler(5),
                      }}>
                      {value?.length || 0}/{limit}
                    </Text>
                  )}
                </>
              )}
            />
          ) : (
            <>
              {/* {title != null && (placeholder || title) && (value || isFocused) ? <Text style={{ fontSize: scaler(12), color: '#2C2D2E', marginLeft: scaler(10), marginBottom: scaler(3) }}>{title || placeholder}{required ? <Text style={{ color: colors.colorRed }}> *</Text> : ""}</Text> : undefined} */}
              <RNTextInput
                {...rest}
                ref={ref}
                style={styles.textInputStyle}
                value={format ? format(value) : value}
                multiline={multiline}
                inputAccessoryViewID={multiline ? name : undefined}
                placeholder={title == null || !isFocused ? placeholder : ''}
                onFocus={e => {
                  setFocused(true);
                  onFocus && onFocus(e);
                }}
                onBlur={e => {
                  setFocused(false);
                  onBlur && onBlur(e);
                }}
                placeholderTextColor={placeholderTextColor ?? Colors.darkGrey}
                onChangeText={onChangeText}
                autoCorrect={props?.autoCorrect ?? multiline}
                spellCheck={
                  props?.spellCheck ?? props?.autoCorrect ?? multiline
                }
              />
              {leftIcon ? (
                <TouchableOpacity
                  disabled={!onPressLeftIcon}
                  onPress={onPressLeftIcon}
                  activeOpacity={0.7}
                  style={[
                    styles?.iconContainerStyle,
                    {
                      left: scaler(10),
                    },
                  ]}>
                  <Image style={leftIconStyle} source={leftIcon} />
                </TouchableOpacity>
              ) : null}
              {rightIcon ? (
                <TouchableOpacity
                  disabled={!onPressRightIcon}
                  onPress={onPressRightIcon}
                  activeOpacity={0.7}
                  style={[
                    styles?.iconContainerStyle,
                    {
                      right: scaler(10),
                    },
                  ]}>
                  <Image style={rightIconStyle} source={rightIcon} />
                </TouchableOpacity>
              ) : null}
              {multiline && Platform.OS == 'ios' && (
                <InputAccessoryView nativeID={name}>
                  <View style={styles.accessory}>
                    <Button onPress={() => Keyboard.dismiss()} title="Done" />
                  </View>
                </InputAccessoryView>
              )}
              {multiline && limit && isFocused && (
                <Text
                  style={{
                    position: 'absolute',
                    color: '#9A9A9A',
                    fontSize: scaler(10),
                    end: scaler(10),
                    bottom: scaler(5),
                  }}>
                  {value?.length || 0}/{limit}
                </Text>
              )}
            </>
          )}
        </View>
        {/* {console.log("errors", errors)} */}
        {errors && errors[errorName] && (
          <Text
            style={{
              paddingLeft: scaler(5),
              paddingVertical: scaler(4),
              color: Colors.darkRed,
              fontFamily: Fonts?.[fontFamily],
              fontSize: scaler(11),
            }}>
            {errors?.[errorName]?.message?.toString() ||
              capitalize(errorName)?.replace(/_/g, ' ') + ' ' + 'is required'}
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);

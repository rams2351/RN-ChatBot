import {Colors} from '@assets/Colors';
import {Images} from '@assets/Images';
import Button from '@custom-components/Button';
import {TextInput} from '@custom-components/TextInput';
import {yupResolver} from '@hookform/resolvers/yup';
import {useDatabase} from '@services/Database';
import {IUser} from '@types';
import {scaler} from '@utils/Scaler';
import React, {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {Image, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

const Welcome: React.FC = () => {
  const [userData, setUserData] = useDatabase<IUser | undefined>('userData');

  const schema = yup.object().shape({
    email: yup.string().email().required('Email is required!'),
    phone: yup
      .string()
      .required('Phone number is required!')
      .matches(
        /^[6-9][0-9]{9}$/,
        'Phone number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9',
      ),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IUser>({
    defaultValues: {
      email: '',
      phone: '',
    },
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const _onSubmit = useCallback((data: IUser) => {
    setUserData(data);
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      bounces={false}>
      <Image source={Images.logo} style={styles.logo} />
      <Text style={styles.welcomeTxt}>Welcome to Chat Pro</Text>

      <View style={styles.inputContainer}>
        <TextInput
          title={'Phone Number'}
          placeholder={'Phone number'}
          name={'phone'}
          autoCapitalize={'none'}
          required={true}
          keyboardType={'number-pad'}
          control={control}
          errors={errors}
        />

        <TextInput
          title={'Email'}
          placeholder={'Email address..'}
          name={'email'}
          autoCapitalize={'none'}
          required={true}
          keyboardType={'email-address'}
          control={control}
          errors={errors}
        />

        <Button
          style={styles.btn}
          title="Continue"
          onPress={handleSubmit(_onSubmit)}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: scaler(150),
    height: scaler(150),
    objectFit: 'cover',
  },
  welcomeTxt: {
    fontSize: scaler(25),
    fontWeight: 700,
    marginVertical: scaler(20),
    color: Colors.primary,
  },

  btn: {
    marginTop: scaler(25),
  },
  inputContainer: {
    width: '80%',
    marginTop: scaler(20),
    marginLeft: scaler(20),
    marginRight: scaler(20),
    gap: scaler(5),
  },
});

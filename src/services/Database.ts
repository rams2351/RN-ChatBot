import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '@types';
import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';

export type StorageType = 'userData';
class PubSub {
  private subscriptions: Map<string, ((key: string) => void)[]> = new Map();

  subscribe(key: string, callback: (key: string) => void) {
    const listeners = this.subscriptions.get(key) || [];
    listeners.push(callback);
    this.subscriptions.set(key, listeners);
  }

  unsubscribe(key: string, callback: (key: string) => void) {
    const listeners = this.subscriptions.get(key);
    if (listeners) {
      this.subscriptions.set(
        key,
        listeners.filter((listener) => listener !== callback),
      );
    }
  }

  publish(key: string) {
    const listeners = this.subscriptions.get(key);
    if (listeners) {
      listeners.forEach((listener) => listener(key));
    }
  }
}

export const storagePubSub = new PubSub();


class DatabaseService {
  async setUserData(userData: IUser | any): Promise<void> {
    if (userData === undefined) {
      await AsyncStorage.removeItem('userData');
    } else {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    }
    storagePubSub.publish('userData'); // Notify subscribers
  }

  async getUserData(): Promise<IUser | null> {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }
}

export const useDatabase = <T = any>(
  key: StorageType,
  {
    defaultValue,
    equalityFunction = isEqual,
  }: {
    defaultValue?: T;
    equalityFunction?: (prev?: T, next?: T) => boolean;
  } = {},
): [T | undefined, (value: T | ((prevValue: T | undefined) => T)) => void] => {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const valueRef = useRef<T | undefined>(value);

  // Keep ref updated with current value
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Initial load from storage
  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        const parsedValue = storedValue ? JSON.parse(storedValue) : undefined;

        if (!equalityFunction(parsedValue, valueRef.current)) {
          setValue(parsedValue);
        }
      } catch (error) {
        console.error('Error loading stored value:', error);
      }
    };

    loadValue();
  }, [key, equalityFunction]);

  // Subscribe to storage changes
  useEffect(() => {
    const handleStorageChange = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        const parsedValue = storedValue ? JSON.parse(storedValue) : undefined;

        if (!equalityFunction(parsedValue, valueRef.current)) {
          setValue(parsedValue);
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    storagePubSub.subscribe(key, handleStorageChange);
    return () => storagePubSub.unsubscribe(key, handleStorageChange);
  }, [key, equalityFunction]);

  // Enhanced update function with PubSub notification
  const updateValue = async (
    newValue: T | ((prevValue: T | undefined) => T),
  ) => {
    try {
      const valueToStore =
        typeof newValue === 'function'
          ? (newValue as Function)(valueRef.current)
          : newValue;

      if (valueToStore === undefined) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      }

      storagePubSub.publish(key); // Notify all subscribers
      setValue(valueToStore);
    } catch (error) {
      console.error('Error updating value:', error);
    }
  };

  return [value, updateValue];
};
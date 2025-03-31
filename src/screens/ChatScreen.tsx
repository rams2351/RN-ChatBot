import {Images} from '@assets/Images';
import {scaler} from '@utils/Scaler';
import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const staticResponses: {[key: string]: string} = {
  hello: 'Hello! How can I assist you today?',
  hi: 'Hi there! What can I do for you?',
  help: 'Here are some things you can ask about:\n- Account\n- Payments\n- Features',
  account: 'Your account settings can be found in the profile section.',
  payments: 'We accept credit cards and PayPal for payments.',
  features:
    'Our main features include:\n1. Real-time chat\n2. Secure payments\n3. Profile management',
  default: "I'm sorry, I didn't understand that. Could you rephrase? ",
};

const BOT = {
  _id: 2,
  name: 'Chatbot Pro',
  avatar: Images.logo,
};

const initialMsg = {
  _id: new Date().toISOString(),
  text: 'Thank you for providing your information! How can I assist you today form the below features: \n- Account\n- Payments\n- Features',
  createdAt: new Date(),
  user: BOT,
};

const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([initialMsg]);

  const sendMessage = useCallback((data: IMessage[]) => {
    // Add user message
    setMessages(previousMessages => GiftedChat.append(previousMessages, data));

    // Process message and get response
    const userMessage = data[0].text;
    const cleanMessage = userMessage.toLowerCase().trim();
    const botResponse =
      staticResponses[cleanMessage] || staticResponses['default'];

    // Add bot response after short delay
    setTimeout(() => {
      sendBotMessage(botResponse);
    }, 800);
  }, []);

  const sendBotMessage = useCallback((text: string) => {
    const msg = {
      _id: new Date().toISOString(),
      text,
      createdAt: new Date(),
      user: BOT,
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, [msg]));
  }, []);

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <GiftedChat
        messages={messages}
        onSend={messages => sendMessage(messages)}
        user={{_id: 1}}
        messagesContainerStyle={styles.msgContainer}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  msgContainer: {
    padding: scaler(10),
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import { theme } from '@/constants/theme';

const HomeScreenHeader = () => {
  const [name, setName] = useState('Melanie');

  const changeUser = () => {
    setName(name === 'Melanie' ? 'John' : 'Melanie');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={changeUser}>
        <View style={styles.userInfo}>
          <Avatar.Image size={40} source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} />
          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Bonsoir,</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Notification bell pressed')}>
        <IconButton icon="bell-outline" size={24} iconColor={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: theme.spacing.s,
  },
  greeting: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});

export default HomeScreenHeader;

// screens/AccountScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Platform, Text } from 'react-native';
import axios from 'axios';

const AccountScreen = ({ route }) => {
  const { token } = route.params; // Get token from route params
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const baseURL = Platform.OS === 'ios' ? 'http://localhost:5000/' : 'http://10.0.2.2:5000/'

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseURL}api/account`, {
        headers: { Authorization: token },
      });
      setUser(response.data);
      setName(response.data.name);
      setIntroduction(response.data.introduction);
    } catch (error) {
      Alert.alert('Error fetching user data');
    }
  };
  useEffect(() => {

    fetchUserData();
  }, [token]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${baseURL}api/account`, { name, introduction }, {
        headers: { Authorization: token },
      });
      Alert.alert('Account updated!');
      fetchUserData();
    } catch (error) {
      Alert.alert('Update failed', error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Personal Introduction" value={introduction} onChangeText={setIntroduction} />
      <Button title="Modify" onPress={handleUpdate} />
      <View>
        <Text>Name: {user.name}</Text>
        <Text>Introduction: {user.introduction}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default AccountScreen;
import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'; 
import { useUser } from '../../../contexts/UserContext'; // 使用UserContext中的login方法 

const LoginScreen = ({ navigation }) => { 
  // 绑定输入框的真实值 
  const [username, setUsername] = useState('admin'); 
  const [password, setPassword] = useState('Admin123'); 
  const [error, setError] = useState(''); 
  
  // 从UserContext中获取login方法
  const { login } = useUser(); 

  const handleLogin = async () => { 
    try { 
      setError(''); 
      // 1. 发请求拿后端数据 
      const loginResult = await login({ username, password }); 
      
      // 2. 从返回结果中获取用户信息和Token
      const user = loginResult?.user;
      const accessToken = loginResult?.token;
      
      // 3. 有Token就更新页面状态 
      if (accessToken) { 
        // 页面提示"登录成功" 
        alert('登录成功！'); 
        // 跳转到租客端首页 
        navigation.replace('TenantTabs'); 
      } 
    } catch (err) { 
      setError(err.message || '登录失败，请检查账号密码'); 
    } 
  }; 

  return ( 
    <View style={styles.container}> 
      <Text style={styles.title}>栖居</Text> 
      <Text style={styles.subtitle}>品质生活，从栖居开始</Text> 
      {error ? <Text style={styles.error}>{error}</Text> : null} 
      
      <TextInput 
        style={styles.input} 
        value={username} 
        onChangeText={setUsername} // 实时同步输入 
        placeholder="用户名/手机号" 
      /> 
      
      <TextInput 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} // 实时同步输入 
        secureTextEntry 
        placeholder="密码" 
      /> 
      
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}> 
        <Text style={styles.btnText}>登录</Text> 
      </TouchableOpacity> 
      
      <Text style={styles.registerLink}>还没有账号？立即注册</Text> 
    </View> 
  ); 
}; 

const styles = StyleSheet.create({ 
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }, 
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 }, 
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 }, 
  input: { width: '100%', height: 45, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 15 }, 
  error: { color: 'red', marginBottom: 15 }, 
  loginBtn: { width: '100%', height: 45, backgroundColor: '#007AFF', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }, 
  btnText: { color: 'white', fontSize: 16, fontWeight: '500' }, 
  registerLink: { marginTop: 20, color: '#007AFF', fontSize: 14 } 
}); 

export default LoginScreen;
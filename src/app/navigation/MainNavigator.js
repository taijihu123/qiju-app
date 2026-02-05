import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { theme } from '../../common/styles/theme';

// 导入现有组件
import Header from '../../common/components/Header';

// 导入页面组件
import RentHousePage from '../../pages/RentHousePage';
import HouseDetailScreen from '../../features/housing/components/HouseDetailScreen';
import CommunityPage from '../../pages/CommunityPage';
import ServicePage from '../../pages/ServicePage';
import SupermarketPage from '../../pages/SupermarketPage';
import MyPage from '../../pages/MyPage';
import KnowledgePage from '../../pages/KnowledgePage';
import SmartAgentPage from '../../pages/SmartAgentPage';
import LoginScreen from '../../features/auth/components/LoginScreen';
import RegisterScreen from '../../features/auth/components/RegisterScreen';
import ForgotPasswordScreen from '../../features/auth/components/ForgotPasswordScreen';
import EditUserInfoScreen from '../../features/auth/components/EditUserInfoScreen';
import StewardListScreen from '../../features/steward/components/StewardListScreen';
import StewardDetailScreen from '../../features/steward/components/StewardDetailScreen';
import OrderListScreen from '../../features/order/components/OrderListScreen';
import OrderDetailScreen from '../../features/order/components/OrderDetailScreen';
import LifeCoinScreen from '../../features/life-coin/components/LifeCoinScreen';
import FavoritesPage from '../../pages/FavoritesPage';
import AssistantScreen from '../../features/assistant/components/AssistantScreen';

// 导入区块链示例组件
import BlockchainBalanceExample from '../../examples/BlockchainBalanceExample';
import EthersBlockchainExample from '../../examples/EthersBlockchainExample';

// 导入预留模块的占位组件
const LandlordHomeScreen = () => <Header title="房东中心" />;
const ProfileScreen = () => <Header title="个人中心" />;
const ContractsScreen = () => <Header title="合同管理" />;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 租客端标签导航
const TenantTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="首页"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // 根据路由匹配图标
          if (route.name === '首页') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '超市') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === '社区') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === '服务') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === '我') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary, // 选中颜色 - 豆瓣豆绿色
        tabBarInactiveTintColor: theme.colors.textTertiary, // 未选中颜色
        tabBarShowLabel: true, // 显示文字
        tabBarStyle: {
          height: 60, // 导航栏高度
          paddingBottom: 10, // 底部内边距
          paddingTop: 5, // 顶部内边距
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderLight,
        },
        tabBarItemStyle: {
          flexDirection: 'column', // 强制每个导航项内的图标+文字垂直排列
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%', // 占满导航栏高度
        },
        headerStyle: {
          backgroundColor: theme.colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.borderLight,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="首页" 
        component={RentHousePage} 
        options={{ 
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="超市" 
        component={SupermarketPage} 
        options={{ 
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="社区" 
        component={CommunityPage} 
        options={{ 
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="服务" 
        component={ServicePage} 
        options={{ 
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="我" 
        component={MyPage} 
        options={{ 
          headerShown: false
        }} 
      />
    </Tab.Navigator>
  );
};

// 房东端标签导航
const LandlordTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'LandlordHome') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Contracts') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      })}
    >
      <Tab.Screen 
        name="LandlordHome" 
        component={LandlordHomeScreen} 
        options={{ 
          title: '房东中心',
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="Contracts" 
        component={ContractsScreen} 
        options={{ 
          title: '合同管理',
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: '我的',
          headerShown: false
        }} 
      />
    </Tab.Navigator>
  );
};

// 主导航器，初始显示租客端标签导航
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="TenantTabs"
    >
      {/* 登录相关屏幕 */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ gestureEnabled: false }} />
      
      {/* 登录成功后显示租客端的标签导航 */}
      <Stack.Screen name="TenantTabs" component={TenantTabNavigator} />
      
      {/* 房源详情页 */}
      <Stack.Screen 
        name="HouseDetail" 
        component={HouseDetailScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 管家列表页 */}
      <Stack.Screen 
        name="StewardList" 
        component={StewardListScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 管家详情页 */}
      <Stack.Screen 
        name="StewardDetail" 
        component={StewardDetailScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 订单列表页 */}
      <Stack.Screen 
        name="OrderList" 
        component={OrderListScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 订单详情页 */}
      <Stack.Screen 
        name="OrderDetail" 
        component={OrderDetailScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 编辑用户信息页 */}
      <Stack.Screen 
        name="EditUserInfo" 
        component={EditUserInfoScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 生活币页面 */}
      <Stack.Screen 
        name="LifeCoin" 
        component={LifeCoinScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 收藏页面 */}
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesPage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 助手页面 */}
      <Stack.Screen 
        name="Assistant" 
        component={AssistantScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 智能经纪人页面 */}
      <Stack.Screen 
        name="SmartAgent" 
        component={SmartAgentPage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 知识页面 */}
      <Stack.Screen 
        name="Knowledge" 
        component={KnowledgePage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 服务详情页 */}
      <Stack.Screen 
        name="ServiceDetail" 
        component={ServicePage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 服务页面 */}
      <Stack.Screen 
        name="ServicePage" 
        component={ServicePage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 合同列表页 */}
      <Stack.Screen 
        name="ContractList" 
        component={ContractsScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 租金支付页 */}
      <Stack.Screen 
        name="RentPayment" 
        component={ContractsScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 租房申请页 */}
      <Stack.Screen 
        name="RentApplications" 
        component={ContractsScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 我的房源页 */}
      <Stack.Screen 
        name="MyHouses" 
        component={LandlordHomeScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 我的服务页 */}
      <Stack.Screen 
        name="MyServices" 
        component={ServicePage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 我的管家页 */}
      <Stack.Screen 
        name="MySteward" 
        component={StewardDetailScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 服务评价页 */}
      <Stack.Screen 
        name="ServiceReviews" 
        component={ServicePage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 账户安全页 */}
      <Stack.Screen 
        name="AccountSecurity" 
        component={EditUserInfoScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 通知页面 */}
      <Stack.Screen 
        name="Notifications" 
        component={MyPage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* 设置页面 */}
      <Stack.Screen 
        name="Settings" 
        component={MyPage} 
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      

      
      {/* 区块链示例页面 */}
      <Stack.Screen 
        name="BlockchainBalance" 
        component={BlockchainBalanceExample} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '区块链余额查询',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* Ethers.js区块链示例页面 */}
      <Stack.Screen 
        name="EthersBlockchain" 
        component={EthersBlockchainExample} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Ethers.js区块链测试',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
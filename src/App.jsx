import { useState } from 'react'
import './App.css'

function App() {
  // 页面状态管理
  const [currentPage, setCurrentPage] = useState('menu') // 'menu' 或 'member' 或 'supermarket'

  // 模拟分类数据
  const categories = [
    { id: 1, name: '咖啡饮品' },
    { id: 2, name: '招牌甜品' },
    { id: 3, name: '轻食简餐' },
    { id: 4, name: '季节限定' },
    { id: 5, name: '茶饮系列' },
    { id: 6, name: '健康沙拉' }
  ]

  // 模拟菜品数据
  const menuItems = {
    1: [
      { id: 101, name: '经典美式', description: '醇厚顺口，唤醒味蕾', price: 22, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=American%20coffee%20in%20a%20white%20cup%20on%20wooden%20table&image_size=square' },
      { id: 102, name: '拿铁咖啡', description: '丝滑奶香，平衡苦涩', price: 28, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Latte%20coffee%20with%20milk%20foam%20art&image_size=square' },
      { id: 103, name: '卡布奇诺', description: '绵密奶泡，层次丰富', price: 30, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cappuccino%20with%20thick%20milk%20foam&image_size=square' },
      { id: 104, name: '香草拿铁', description: '清甜香草，温柔口感', price: 32, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vanilla%20latte%20with%20vanilla%20syrup&image_size=square' },
      { id: 105, name: '焦糖玛奇朵', description: '焦糖甜香，温暖人心', price: 34, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Caramel%20macchiato%20with%20caramel%20drizzle&image_size=square' },
      { id: 106, name: '馥芮白', description: '浓郁奶香，回甘悠长', price: 32, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Flat%20white%20coffee%20in%20a%20ceramic%20cup&image_size=square' }
    ],
    2: [
      { id: 201, name: '抹茶提拉米苏', description: '日式抹茶，细腻口感', price: 38, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Matcha%20tiramisu%20with%20green%20tea%20powder&image_size=square' },
      { id: 202, name: '草莓芝士蛋糕', description: '酸甜草莓，绵密芝士', price: 36, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Strawberry%20cheesecake%20with%20fresh%20strawberries&image_size=square' },
      { id: 203, name: '芒果慕斯', description: '新鲜芒果，轻盈顺滑', price: 34, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Mango%20mousse%20cake%20with%20mango%20slices&image_size=square' },
      { id: 204, name: '巧克力熔岩蛋糕', description: '热巧克力流心，醇厚浓郁', price: 32, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chocolate%20lava%20cake%20with%20oozing%20chocolate&image_size=square' }
    ],
    3: [
      { id: 301, name: '牛油果三明治', description: '新鲜牛油果，营养均衡', price: 42, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Avocado%20sandwich%20with%20egg%20and%20lettuce&image_size=square' },
      { id: 302, name: '火腿芝士帕尼尼', description: '香脆面包，浓郁芝士', price: 38, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ham%20and%20cheese%20panini%20press&image_size=square' },
      { id: 303, name: '吞拿鱼沙拉', description: '新鲜吞拿鱼，清爽蔬菜', price: 46, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tuna%20salad%20with%20mixed%20greens&image_size=square' },
      { id: 304, name: '凯撒沙拉', description: '经典凯撒酱，香脆面包丁', price: 42, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Caesar%20salad%20with%20croutons%20and%20parmesan&image_size=square' }
    ],
    4: [
      { id: 401, name: '樱花拿铁', description: '春日限定，粉嫩浪漫', price: 36, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cherry%20blossom%20latte%20with%20pink%20foam&image_size=square' },
      { id: 402, name: '荔枝玫瑰茶', description: '夏日清爽，花香四溢', price: 32, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lychee%20rose%20tea%20with%20rose%20petals&image_size=square' },
      { id: 403, name: '南瓜拿铁', description: '秋日温暖，香甜浓郁', price: 34, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Pumpkin%20spice%20latte%20with%20cinnamon&image_size=square' },
      { id: 404, name: '姜枣茶', description: '冬日暖心，驱寒保暖', price: 28, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ginger%20and%20jujube%20tea%20in%20a%20ceramic%20cup&image_size=square' }
    ],
    5: [
      { id: 501, name: '茉莉花茶', description: '清香淡雅，回味无穷', price: 24, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Jasmine%20tea%20in%20a%20glass%20teapot&image_size=square' },
      { id: 502, name: '普洱茶', description: '醇厚甘滑，降脂减肥', price: 26, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Pu%27er%20tea%20in%20a%20traditional%20tea%20set&image_size=square' },
      { id: 503, name: '柠檬蜂蜜茶', description: '酸甜可口，润喉止咳', price: 28, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lemon%20honey%20tea%20with%20lemon%20slices&image_size=square' },
      { id: 504, name: '水果茶', description: '新鲜水果，维生素丰富', price: 32, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Fruit%20tea%20with%20mixed%20fruits&image_size=square' }
    ],
    6: [
      { id: 601, name: '田园沙拉', description: '新鲜蔬菜，健康营养', price: 38, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Garden%20salad%20with%20mixed%20vegetables&image_size=square' },
      { id: 602, name: '鸡胸肉沙拉', description: '高蛋白低脂，健身首选', price: 48, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Grilled%20chicken%20salad%20with%20greens&image_size=square' },
      { id: 603, name: '藜麦沙拉', description: '超级食物，营养全面', price: 46, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Quinoa%20salad%20with%20vegetables%20and%20feta&image_size=square' },
      { id: 604, name: '海鲜沙拉', description: '新鲜海鲜，口感丰富', price: 58, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Seafood%20salad%20with%20shrimp%20and%20scallops&image_size=square' }
    ]
  }

  // 模拟厨师/咖啡师数据
  const chefs = [
    {
      id: 1,
      name: "李明",
      title: "主厨",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20chef%20portrait%20asian%20male&image_size=square",
      desc: "擅长意式料理与定制餐点"
    },
    {
      id: 2,
      name: "小雅",
      title: "首席咖啡师",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20barista%20portrait%20asian%20female&image_size=square",
      desc: "手冲咖啡与拉花艺术大师"
    },
    {
      id: 3,
      name: "王强",
      title: "甜品师",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20pastry%20chef%20portrait&image_size=square",
      desc: "法式甜品与创意甜点专家"
    },
    {
      id: 4,
      name: "张伟",
      title: "营养师",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20nutritionist%20portrait&image_size=square",
      desc: "健康饮食与营养搭配顾问"
    }
  ]

  // 模拟超市分类数据
  const supermarketCategories = [
    {
      id: 1,
      name: "生鲜蔬果",
      icon: "🥬",
      desc: "新鲜蔬菜、水果、肉类"
    },
    {
      id: 2,
      name: "烘焙点心",
      icon: "🥐",
      desc: "可颂、面包、蛋糕"
    },
    {
      id: 3,
      name: "咖啡周边",
      icon: "☕",
      desc: "咖啡豆、器具、杯具"
    },
    {
      id: 4,
      name: "预制菜",
      icon: "🍱",
      desc: "快手料理包、即食食品"
    },
    {
      id: 5,
      name: "饮品酒水",
      icon: "🥤",
      desc: "饮料、啤酒、葡萄酒"
    },
    {
      id: 6,
      name: "家居用品",
      icon: "🏠",
      desc: "厨房用品、清洁用品"
    }
  ]

  // 模拟超市商品数据
  const supermarketProducts = {
    1: [
      { id: 101, name: '有机生菜', price: 8.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20organic%20lettuce%20in%20a%20plastic%20bag&image_size=square' },
      { id: 102, name: '进口蓝莓', price: 19.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20blueberries%20in%20a%20container&image_size=square' },
      { id: 103, name: '土鸡蛋', price: 22.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20eggs%20in%20a%20carton&image_size=square' },
      { id: 104, name: '五花肉', price: 35.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20pork%20belly%20slice&image_size=square' }
    ],
    2: [
      { id: 201, name: '原味可颂', price: 12.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20croissant%20on%20a%20plate&image_size=square' },
      { id: 202, name: '全麦面包', price: 19.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=whole%20grain%20bread%20loaf&image_size=square' },
      { id: 203, name: '芝士蛋糕', price: 39.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cheesecake%20slice%20with%20berries&image_size=square' }
    ],
    3: [
      { id: 301, name: '意式咖啡豆', price: 68.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coffee%20beans%20in%20a%20bag&image_size=square' },
      { id: 302, name: '手冲壶', price: 199.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pour%20over%20coffee%20kettle&image_size=square' },
      { id: 303, name: '陶瓷咖啡杯', price: 89.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ceramic%20coffee%20cup%20set&image_size=square' }
    ],
    4: [
      { id: 401, name: '宫保鸡丁', price: 29.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kung%20pao%20chicken%20ready%20meal&image_size=square' },
      { id: 402, name: '番茄鸡蛋面', price: 19.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomato%20egg%20noodles%20ready%20meal&image_size=square' }
    ],
    5: [
      { id: 501, name: '气泡水', price: 8.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sparkling%20water%20bottle&image_size=square' },
      { id: 502, name: '精酿啤酒', price: 25.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=craft%20beer%20bottle&image_size=square' },
      { id: 503, name: '红葡萄酒', price: 128.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20wine%20bottle&image_size=square' }
    ],
    6: [
      { id: 601, name: '不粘锅', price: 199.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=non%20stick%20frying%20pan&image_size=square' },
      { id: 602, name: '洗碗海绵', price: 12.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dishwashing%20sponges&image_size=square' },
      { id: 603, name: '厨房纸巾', price: 19.99, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kitchen%20paper%20towels&image_size=square' }
    ]
  }

  // 状态管理
  const [selectedSupermarketCategory, setSelectedSupermarketCategory] = useState(1)

  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState(1)
  const [cart, setCart] = useState([])
  const [isCheckout, setIsCheckout] = useState(false)

  // 切换分类
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  // 添加到购物车
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  // 从购物车移除
  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem => 
          cartItem.id === itemId 
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      } else {
        return prevCart.filter(cartItem => cartItem.id !== itemId)
      }
    })
  }

  // 计算购物车总价
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // 计算购物车商品数量
  const calculateCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  // 结算
  const handleCheckout = () => {
    if (cart.length === 0) return
    setIsCheckout(true)
    // 这里可以添加支付逻辑
    alert('订单已提交，总金额：' + calculateTotal() + '元')
    // 清空购物车
    setCart([])
    setIsCheckout(false)
  }

  // 切换页面
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 切换超市分类
  const handleSupermarketCategoryChange = (categoryId) => {
    setSelectedSupermarketCategory(categoryId)
  }

  // 超市详情页面
  const renderSupermarketPage = () => (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span>栖居咖啡馆</span>
        </div>
        <div className="header-buttons">
          <button 
            className={`nav-button ${currentPage === 'menu' ? 'active' : ''}`}
            onClick={() => handlePageChange('menu')}
          >
            点餐
          </button>
          <button 
            className={`nav-button ${currentPage === 'member' ? 'active' : ''}`}
            onClick={() => handlePageChange('member')}
          >
            会员中心
          </button>
          <button 
            className={`nav-button ${currentPage === 'supermarket' ? 'active' : ''}`}
            onClick={() => handlePageChange('supermarket')}
          >
            栖居超市
          </button>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="main-content">
        {/* 左侧超市分类栏 */}
        <div className="category-sidebar">
          {supermarketCategories.map(category => (
            <div
              key={category.id}
              className={`category-item ${selectedSupermarketCategory === category.id ? 'active' : ''}`}
              onClick={() => handleSupermarketCategoryChange(category.id)}
            >
              {category.icon} {category.name}
            </div>
          ))}
        </div>

        {/* 右侧商品区 */}
        <div className="menu-area">
          <h2 className="menu-title">
            {supermarketCategories.find(cat => cat.id === selectedSupermarketCategory)?.name}
          </h2>
          <div className="menu-grid">
            {supermarketProducts[selectedSupermarketCategory]?.map(product => (
              <div key={product.id} className="menu-card">
                <div className="card-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <h3 className="card-name">{product.name}</h3>
                <div className="card-bottom">
                  <span className="card-price">¥{product.price}</span>
                  <button 
                    className="card-add-button"
                    onClick={() => addToCart(product)}
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部购物车 */}
      <div className="cart-footer">
        <div className="cart-info">
          <div className="cart-count">
            商品数量：{calculateCount()}
          </div>
          <div className="cart-total">
            总计：¥{calculateTotal()}
          </div>
        </div>
        <button 
          className="checkout-button"
          disabled={cart.length === 0 || isCheckout}
          onClick={handleCheckout}
        >
          {isCheckout ? '结算中...' : '立即结算'}
        </button>
      </div>
    </div>
  )

  // 点餐页面
  const renderMenuPage = () => (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span>栖居咖啡馆</span>
        </div>
        <div className="header-buttons">
          <button 
            className={`nav-button ${currentPage === 'menu' ? 'active' : ''}`}
            onClick={() => handlePageChange('menu')}
          >
            点餐
          </button>
          <button 
            className={`nav-button ${currentPage === 'member' ? 'active' : ''}`}
            onClick={() => handlePageChange('member')}
          >
            会员中心
          </button>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="main-content">
        {/* 左侧分类栏 */}
        <div className="category-sidebar">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>

        {/* 右侧菜品区 */}
        <div className="menu-area">
          <h2 className="menu-title">
            {categories.find(cat => cat.id === selectedCategory)?.name}
          </h2>
          <div className="menu-grid">
            {menuItems[selectedCategory].map(item => (
              <div key={item.id} className="menu-card">
                <div className="card-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3 className="card-name">{item.name}</h3>
                <p className="card-description">{item.description}</p>
                <div className="card-bottom">
                  <span className="card-price">¥{item.price}</span>
                  <button 
                    className="card-add-button"
                    onClick={() => addToCart(item)}
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部购物车 */}
      <div className="cart-footer">
        <div className="cart-info">
          <div className="cart-count">
            商品数量：{calculateCount()}
          </div>
          <div className="cart-total">
            总计：¥{calculateTotal()}
          </div>
        </div>
        <button 
          className="checkout-button"
          disabled={cart.length === 0 || isCheckout}
          onClick={handleCheckout}
        >
          {isCheckout ? '结算中...' : '立即结算'}
        </button>
      </div>
    </div>
  )

  // 会员中心页面
  const renderMemberPage = () => (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span>栖居咖啡馆</span>
        </div>
        <div className="header-buttons">
          <button 
            className={`nav-button ${currentPage === 'menu' ? 'active' : ''}`}
            onClick={() => handlePageChange('menu')}
          >
            点餐
          </button>
          <button 
            className={`nav-button ${currentPage === 'member' ? 'active' : ''}`}
            onClick={() => handlePageChange('member')}
          >
            会员中心
          </button>
        </div>
      </header>

      {/* 顶部：专业团队展示区 */}
      <div className="team-section">
        <h3 className="section-title">专业团队</h3>
        <div className="team-scroll">
          {chefs.map(chef => (
            <div key={chef.id} className="chef-card">
              <img src={chef.avatar} alt={chef.name} className="chef-avatar" />
              <div className="chef-info">
                <h4>{chef.name}</h4>
                <p className="chef-title">{chef.title}</p>
                <p className="chef-desc">{chef.desc}</p>
                <button className="book-btn">预约</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 中间：会员中心内容 */}
      <div className="member-content">
        {/* 底部：栖居超市入口区（放在会员权益上面，突出超市重要性） */}
        <div className="supermarket-section">
          <div className="supermarket-header">
            <h3 className="section-title">栖居超市</h3>
            <button className="view-all-btn" onClick={() => handlePageChange('supermarket')}>查看全部</button>
          </div>
          <div className="supermarket-scroll">
            {supermarketCategories.map(category => (
              <div key={category.id} className="supermarket-card">
                <div className="supermarket-icon">{category.icon}</div>
                <h4 className="supermarket-name">{category.name}</h4>
                <p className="supermarket-desc">{category.desc}</p>
                <button className="view-btn" onClick={() => {
                  handlePageChange('supermarket');
                  handleSupermarketCategoryChange(category.id);
                }}>查看全部</button>
              </div>
            ))}
          </div>
        </div>

        {/* 会员权益和活动（放在超市下面） */}
        <h3 className="section-title">会员权益</h3>
        <div className="member-benefits">
          <div className="benefit-card">
            <div className="benefit-icon">🎁</div>
            <h4>积分兑换</h4>
            <p>消费即可获得积分，可兑换咖啡和甜品</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎉</div>
            <h4>生日礼遇</h4>
            <p>生日当月可获得免费生日蛋糕</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">☕</div>
            <h4>会员折扣</h4>
            <p>享受所有产品9折优惠</p>
          </div>
        </div>
      </div>
    </div>
  )

  return currentPage === 'menu' ? renderMenuPage() : currentPage === 'supermarket' ? renderSupermarketPage() : renderMemberPage()
}

export default App

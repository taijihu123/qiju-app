import { Wrench, Sparkles, Package, Phone, Mail } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  category: string;
  rating: number;
  provider: string;
}

const mockServices: Service[] = [
  {
    id: 1,
    title: '水电维修',
    description: '24小时上门维修，经验丰富的专业师傅',
    icon: <Wrench className="w-6 h-6" />,
    price: '¥80起',
    category: '维修',
    rating: 4.8,
    provider: '快修服务',
  },
  {
    id: 2,
    title: '深度保洁',
    description: '专业保洁团队，使用环保清洁产品',
    icon: <Sparkles className="w-6 h-6" />,
    price: '¥200/次',
    category: '清洁',
    rating: 4.9,
    provider: '洁净家政',
  },
  {
    id: 3,
    title: '快递代收',
    description: '安全代收快递，短信实时通知',
    icon: <Package className="w-6 h-6" />,
    price: '¥2/件',
    category: '便民',
    rating: 4.7,
    provider: '社区服务站',
  },
  {
    id: 4,
    title: '管道疏通',
    description: '专业疏通下水道、马桶等管道堵塞',
    icon: <Wrench className="w-6 h-6" />,
    price: '¥150起',
    category: '维修',
    rating: 4.6,
    provider: '快修服务',
  },
  {
    id: 5,
    title: '家电清洗',
    description: '空调、油烟机、洗衣机等家电深度清洗',
    icon: <Sparkles className="w-6 h-6" />,
    price: '¥120起',
    category: '清洁',
    rating: 4.8,
    provider: '洁净家政',
  },
  {
    id: 6,
    title: '搬家服务',
    description: '专业搬家团队，包装打包一条龙服务',
    icon: <Package className="w-6 h-6" />,
    price: '¥300起',
    category: '便民',
    rating: 4.5,
    provider: '便民搬家',
  },
];

const categories = [
  { name: '全部', value: 'all' },
  { name: '维修', value: '维修' },
  { name: '清洁', value: '清洁' },
  { name: '便民', value: '便民' },
];

export function ServicesModule() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b">
        <h1 className="mb-3">生活服务</h1>
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={cat.value === 'all' ? 'secondary' : 'outline'}
              className="whitespace-nowrap cursor-pointer"
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-3">
          {mockServices.map((service) => (
            <Card key={service.id} className="p-4">
              <div className="flex gap-3">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  {service.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3>{service.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">{service.provider}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-orange-600">{service.price}</span>
                      </div>
                    </div>
                    
                    <Button size="sm">预约</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Card */}
        <Card className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="mb-2">需要其他服务？</h3>
          <p className="text-sm text-gray-600 mb-3">联系客服为您提供定制化服务方案</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-4 h-4 mr-1" />
              电话咨询
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="w-4 h-4 mr-1" />
              在线客服
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

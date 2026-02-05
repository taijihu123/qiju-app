import { useState } from 'react';
import { Search, MapPin, Bed, Bath, Heart, Building2, Star, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Rental {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  tags: string[];
  rating: number;
  isFavorite: boolean;
}

const mockRentals: Rental[] = [
  {
    id: 1,
    title: '现代简约两居室',
    price: 4500,
    location: '朝阳区 · 三里屯',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njc1Mzc5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['精装修', '近地铁', '拎包入住'],
    rating: 4.8,
    isFavorite: false,
  },
  {
    id: 2,
    title: '豪华公寓景观房',
    price: 8800,
    location: '海淀区 · 中关村',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2NzUzNjUxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['智能家居', '健身房', '停车位'],
    rating: 4.9,
    isFavorite: true,
  },
  {
    id: 3,
    title: '温馨单身公寓',
    price: 3200,
    location: '西城区 · 西单',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    image: 'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3Njc1ODM3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['独卫', '采光好'],
    rating: 4.5,
    isFavorite: false,
  },
  {
    id: 4,
    title: '极简工作室',
    price: 2800,
    location: '东城区 · 国贸',
    bedrooms: 1,
    bathrooms: 1,
    area: 38,
    image: 'https://images.unsplash.com/photo-1633505765486-e404bbbec654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc3R1ZGlvJTIwYXBhcnRtZW50fGVufDF8fHx8MTc2NzU4MzcyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['简约风', '可短租'],
    rating: 4.6,
    isFavorite: false,
  },
  {
    id: 5,
    title: '高层景观三居',
    price: 6500,
    location: '朝阳区 · 望京',
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    image: 'https://images.unsplash.com/photo-1665764067783-3df42669b262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXBhcnRtZW50JTIwdmlld3xlbnwxfHx8fDE3Njc1NjA0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['高层', '江景', '学区房'],
    rating: 4.7,
    isFavorite: false,
  },
];

export function RentalModule() {
  const [rentals, setRentals] = useState(mockRentals);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (id: number) => {
    setRentals(rentals.map(rental => 
      rental.id === id ? { ...rental, isFavorite: !rental.isFavorite } : rental
    ));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b">
        <h1 className="mb-3">找房租房</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="搜索位置、小区名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <Badge variant="secondary" className="whitespace-nowrap cursor-pointer">全部</Badge>
          <Badge variant="outline" className="whitespace-nowrap cursor-pointer">整租</Badge>
          <Badge variant="outline" className="whitespace-nowrap cursor-pointer">合租</Badge>
          <Badge variant="outline" className="whitespace-nowrap cursor-pointer">近地铁</Badge>
          <Badge variant="outline" className="whitespace-nowrap cursor-pointer">可短租</Badge>
        </div>
      </div>

      {/* Rental List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {rentals.map((rental) => (
            <Card key={rental.id} className="overflow-hidden">
              <div className="flex gap-3 p-3">
                {/* Image */}
                <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  <ImageWithFallback
                    src={rental.image}
                    alt={rental.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(rental.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                  >
                    <Heart
                      className={`w-4 h-4 ${rental.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="truncate mb-1">{rental.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm">{rental.location}</span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-3 text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span className="text-sm">{rental.bedrooms}室</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span className="text-sm">{rental.bathrooms}卫</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">{rental.area}㎡</span>
                    </div>
                  </div>

                  {/* Tags & Price */}
                  <div className="flex items-end justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {rental.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-red-600">¥{rental.price}</span>
                      <span className="text-sm text-gray-500">/月</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 px-3 pb-2 pt-0">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{rental.rating} 评分</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ThumbsUp, MessageSquare, Send, Users, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Post {
  id: number;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  liked: boolean;
  tag?: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: '张小明',
    avatar: '',
    timestamp: '2小时前',
    content: '周末组织了一次社区烧烤活动，认识了好多新邻居，大家都很友好！感谢物业的支持 🎉',
    images: ['https://images.unsplash.com/photo-1763629433062-0f0e43d55d03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBwZW9wbGUlMjBnYXRoZXJpbmd8ZW58MXx8fHwxNjc1NDk0Njg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    likes: 24,
    comments: 8,
    liked: false,
    tag: '活动',
  },
  {
    id: 2,
    author: '李华',
    avatar: '',
    timestamp: '5小时前',
    content: '请问有人知道附近哪里有好吃的火锅吗？新搬来的，想找点好吃的 😋',
    likes: 12,
    comments: 15,
    liked: true,
    tag: '求助',
  },
  {
    id: 3,
    author: '王美丽',
    avatar: '',
    timestamp: '昨天 18:30',
    content: '捡到一只小猫咪，在3号楼附近，有丢失的主人吗？小猫很乖，现在暂时在我家。',
    likes: 36,
    comments: 12,
    liked: false,
    tag: '寻物',
  },
  {
    id: 4,
    author: '陈先生',
    avatar: '',
    timestamp: '昨天 14:20',
    content: '小区的健身房设施很棒！每天下班后锻炼一小时，感觉生活质量提升了不少 💪',
    likes: 18,
    comments: 6,
    liked: false,
  },
];

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: '周末羽毛球约战',
    date: '本周六 15:00',
    location: '社区活动中心',
    participants: 8,
    maxParticipants: 12,
  },
  {
    id: 2,
    title: '亲子读书会',
    date: '本周日 10:00',
    location: '社区图书馆',
    participants: 5,
    maxParticipants: 10,
  },
];

export function CommunityModule() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Handle post submission
      setNewPost('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b">
        <h1 className="mb-3">社区互动</h1>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <Badge variant="secondary" className="cursor-pointer">动态</Badge>
          <Badge variant="outline" className="cursor-pointer">活动</Badge>
          <Badge variant="outline" className="cursor-pointer">邻里</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* New Post */}
        <Card className="m-4 p-3">
          <Textarea
            placeholder="分享你的生活，认识更多邻居..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[80px] mb-2 resize-none"
          />
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {newPost.length}/500
            </div>
            <Button size="sm" onClick={handlePostSubmit} disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-1" />
              发布
            </Button>
          </div>
        </Card>

        {/* Upcoming Events */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3>即将到来的活动</h3>
            <Button variant="ghost" size="sm">查看更多</Button>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="mb-1">{event.title}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-3.5 h-3.5" />
                        {event.participants}/{event.maxParticipants} 人
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 mt-1">{event.date}</div>
                  </div>
                  <Button size="sm">报名</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="px-4 pb-4">
          <h3 className="mb-3">社区动态</h3>
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="p-4">
                {/* Author Info */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500">
                    <div className="w-full h-full flex items-center justify-center text-white">
                      {post.author[0]}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{post.author}</span>
                      {post.tag && (
                        <Badge variant="secondary" className="text-xs">
                          {post.tag}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{post.timestamp}</div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-800 mb-3">{post.content}</p>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={post.images[0]}
                      alt="Post image"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${post.liked ? 'fill-blue-600 text-blue-600' : ''}`}
                    />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

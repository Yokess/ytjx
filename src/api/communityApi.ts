import {
  ApiResponse,
  Author,
  Column,
  Post,
  Section,
  UserInfo,
  PostDetail,
  CommentReply,
  Comment,
  PostsQueryParams,
  CreatePostParams,
  CreateCommentParams,
  CreateReplyParams
} from '../types/community';

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟数据
const mockColumns: Column[] = [
  {
    id: 1,
    title: '考研数学进阶指南',
    cover: 'linear-gradient(to right, #4f46e5, #3b82f6)',
    author: {
      id: '101',
      name: '李教授',
      avatar: 'https://joeschmoe.io/api/v1/random',
      title: '北京大学数学系'
    },
    description: '从基础到高阶，全面解析考研数学常见难点和解题技巧，助你攻克数学难关。',
    articles: 12,
    views: 3200
  },
  {
    id: 2,
    title: '英语写作高分技巧',
    cover: 'linear-gradient(to right, #8b5cf6, #ec4899)',
    author: {
      id: '102',
      name: '王老师',
      avatar: 'https://joeschmoe.io/api/v1/random',
      title: '复旦大学外语学院'
    },
    description: '掌握考研英语写作的核心技巧，从词汇、句型到文章结构，全方位提升你的英语写作能力。',
    articles: 8,
    views: 2800
  },
  {
    id: 3,
    title: '考研心理调适指南',
    cover: 'linear-gradient(to right, #10b981, #0d9488)',
    author: {
      id: '103',
      name: '张心理师',
      avatar: 'https://joeschmoe.io/api/v1/random',
      title: '清华大学心理学系'
    },
    description: '如何在备考期间保持良好的心态，应对压力和焦虑，提高学习效率和考试表现。',
    articles: 6,
    views: 1900
  }
];

const mockPosts: Post[] = [
  {
    id: 1,
    title: '2025年考研大纲变化解析及备考建议',
    tags: ['置顶', '官方', '精华'],
    tagColors: ['red', 'blue', 'green'],
    author: {
      id: '201',
      name: '研途九霄官方',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-15',
    views: 5600,
    comments: 128,
    likes: 320,
    isOfficial: true
  },
  {
    id: 2,
    title: '数学中的泰勒公式如何理解和应用？',
    content: '我在复习高数时遇到了泰勒公式，但对其几何意义和应用场景不太理解，特别是在求极限和近似计算方面，有没有简单易懂的解释和例子？',
    tags: ['问答讨论', '已解决'],
    tagColors: ['blue', 'green'],
    author: {
      id: '202',
      name: '李同学',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-18',
    views: 342,
    comments: 16,
    likes: 45,
    postTags: ['高等数学', '泰勒公式']
  },
  {
    id: 3,
    title: '从二本到清华：我的考研逆袭之路',
    content: '作为一名普通二本院校的学生，我用一年时间考入清华大学计算机专业。这篇文章分享我的备考经验、学习方法和心态调整技巧，希望能给正在备考的同学一些启发和鼓励。',
    tags: ['经验分享', '精华'],
    tagColors: ['green', 'yellow'],
    author: {
      id: '203',
      name: '王同学',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-10',
    views: 2100,
    comments: 86,
    likes: 230,
    postTags: ['考研经验', '逆袭', '清华大学']
  },
  {
    id: 4,
    title: '2025年北京高校计算机专业考研分析',
    content: '详细分析北京地区各高校计算机专业的招生情况、考试科目、录取分数线变化趋势以及就业前景，帮助大家选择适合自己的目标院校。',
    tags: ['院校信息'],
    tagColors: ['orange'],
    author: {
      id: '204',
      name: '赵同学',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-12',
    views: 1500,
    comments: 42,
    likes: 98,
    postTags: ['北京高校', '计算机专业', '分数线']
  },
  {
    id: 5,
    title: '【北京】考研英语学习小组招募',
    content: '我们是一群备战2025年考研的同学，现招募英语学习小组成员，每周线上+线下结合学习，互相督促，共同进步。要求有一定英语基础，能坚持每天打卡学习。',
    tags: ['学习小组', '招募中'],
    tagColors: ['purple', 'blue'],
    author: {
      id: '205',
      name: '林同学',
      avatar: 'https://joeschmoe.io/api/v1/random'
    },
    date: '2024-05-16',
    views: 328,
    comments: 24,
    likes: 36,
    postTags: ['英语学习', '北京', '2025考研']
  }
];

const mockSections: Section[] = [
  { name: '问答讨论', icon: 'MessageOutlined', count: 328, color: 'blue' },
  { name: '经验分享', icon: 'StarOutlined', count: 156, color: 'green' },
  { name: '院校信息', icon: 'LikeOutlined', count: 92, color: 'cyan' },
  { name: '学习小组', icon: 'TeamOutlined', count: 64, color: 'purple' },
  { name: '考研资讯', icon: 'NotificationOutlined', count: 108, color: 'red' }
];

const mockHotTags: string[] = [
  '数学', '英语', '政治', '专业课', '复习计划', 
  '考研经验', '北京大学', '清华大学', '复旦大学', '学习方法'
];

const mockUserInfo: UserInfo = {
  id: '301',
  name: '张同学',
  avatar: 'https://joeschmoe.io/api/v1/random',
  points: 1280,
  major: '数学专业',
  posts: 42,
  replies: 128,
  favorites: 56
};

const mockPostDetail: PostDetail = {
  id: '1',
  title: '考研数学复习经验分享：如何在三个月内提高100分',
  content: `
    <p>大家好，我是一名刚刚结束考研的学生，数学从最初的模拟考试60分提升到了考试的160分。在这里分享一下我的复习经验，希望对大家有所帮助。</p>
    
    <h3>一、基础阶段（第1-4周）</h3>
    <p>这个阶段主要是打基础，我采用的方法是：</p>
    <ol>
      <li>通读教材，掌握基本概念和定理</li>
      <li>做基础题，巩固概念理解</li>
      <li>整理错题，建立错题本</li>
    </ol>
    
    <h3>二、强化阶段（第5-8周）</h3>
    <p>这个阶段主要是强化训练，我采用的方法是：</p>
    <ol>
      <li>刷题，大量刷题，特别是历年真题</li>
      <li>归纳总结解题方法和技巧</li>
      <li>定期复习错题本</li>
    </ol>
    
    <h3>三、冲刺阶段（第9-12周）</h3>
    <p>这个阶段主要是查漏补缺，我采用的方法是：</p>
    <ol>
      <li>模拟考试，找出薄弱环节</li>
      <li>针对性强化训练</li>
      <li>调整心态，保持良好的状态</li>
    </ol>
    
    <p>最后，我想说的是，考研数学不是难题，关键是方法得当，坚持不懈。希望大家都能取得好成绩！</p>
  `,
  author: {
    id: '101',
    name: '数学大神',
    avatar: 'https://joeschmoe.io/api/v1/random',
    level: 5,
    title: '研究生考生',
    postCount: 32,
    followersCount: 128
  },
  createTime: '2024-05-15 14:30',
  updateTime: '2024-05-15 16:45',
  viewCount: 1256,
  likeCount: 89,
  favoriteCount: 45,
  commentCount: 23,
  tags: ['数学', '考研经验', '学习方法'],
  section: '经验交流',
  isLiked: false,
  isFavorited: false
};

const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      id: '201',
      name: '考研小白',
      avatar: 'https://joeschmoe.io/api/v1/random',
      level: 2
    },
    content: '感谢分享！请问基础特别差的话，三个月时间够吗？',
    createTime: '2024-05-15 15:10',
    likeCount: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: {
          id: '101',
          name: '数学大神',
          avatar: 'https://joeschmoe.io/api/v1/random',
          level: 5
        },
        content: '基础差的话，建议先用2-3周时间专门补基础，然后再按照我的计划走。关键是要找到自己的薄弱点，有针对性地强化训练。',
        createTime: '2024-05-15 15:30',
        likeCount: 8,
        isLiked: false
      }
    ]
  },
  {
    id: '2',
    author: {
      id: '202',
      name: '高数爱好者',
      avatar: 'https://joeschmoe.io/api/v1/random',
      level: 4
    },
    content: '这个方法真的有效！我也是按照类似的方法，数学从70多分提高到了140分。特别是错题本的方法，非常有用。',
    createTime: '2024-05-15 16:20',
    likeCount: 15,
    isLiked: true,
    replies: []
  },
  {
    id: '3',
    author: {
      id: '203',
      name: '即将上岸',
      avatar: 'https://joeschmoe.io/api/v1/random',
      level: 3
    },
    content: '请问楼主用的是什么教材和参考书啊？能推荐一下吗？',
    createTime: '2024-05-15 17:45',
    likeCount: 5,
    isLiked: false,
    replies: [
      {
        id: '3-1',
        author: {
          id: '101',
          name: '数学大神',
          avatar: 'https://joeschmoe.io/api/v1/random',
          level: 5
        },
        content: '我用的是《高等数学》（同济第七版）作为基础教材，参考书主要是张宇的《数学基础过关660题》和《数学真题大全解》。此外，我还做了李永乐的模拟卷。',
        createTime: '2024-05-15 18:10',
        likeCount: 10,
        isLiked: false
      },
      {
        id: '3-2',
        author: {
          id: '203',
          name: '即将上岸',
          avatar: 'https://joeschmoe.io/api/v1/random',
          level: 3
        },
        content: '谢谢分享！我马上去买这些书。',
        createTime: '2024-05-15 18:30',
        likeCount: 2,
        isLiked: false,
        replyTo: {
          id: '101',
          name: '数学大神'
        }
      }
    ]
  }
];

// API实现
/**
 * 获取专栏列表
 */
export const getColumns = async (params?: { page?: number; pageSize?: number }): Promise<ApiResponse<{ total: number; columns: Column[] }>> => {
  await delay(600);
  
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const total = mockColumns.length;
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      total,
      columns: mockColumns.slice((page - 1) * pageSize, page * pageSize)
    }
  };
};

/**
 * 获取帖子列表
 */
export const getPosts = async (params?: PostsQueryParams): Promise<ApiResponse<{ total: number; posts: Post[] }>> => {
  await delay(800);
  
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  let filteredPosts = [...mockPosts];
  
  // 按照板块筛选
  if (params?.section && params.section !== 'all') {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.some(tag => tag === params.section)
    );
  }
  
  // 按照标签筛选
  if (params?.tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.includes(params.tag!) || 
      (post.postTags && post.postTags.includes(params.tag!))
    );
  }
  
  // 按照关键词搜索
  if (params?.keyword) {
    const keyword = params.keyword.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(keyword) || 
      (post.content && post.content.toLowerCase().includes(keyword))
    );
  }
  
  // 排序
  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'hot':
        filteredPosts.sort((a, b) => b.views - a.views);
        break;
      case 'featured':
        filteredPosts = filteredPosts.filter(post => 
          post.tags.includes('精华') || post.tags.includes('置顶')
        );
        break;
      case 'latest':
      default:
        // 默认已经是按时间排序的
        break;
    }
  }
  
  const total = filteredPosts.length;
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      total,
      posts: filteredPosts.slice((page - 1) * pageSize, page * pageSize)
    }
  };
};

/**
 * 获取社区板块数据
 */
export const getSections = async (): Promise<ApiResponse<Section[]>> => {
  await delay(400);
  
  return {
    code: 200,
    message: '获取成功',
    data: mockSections
  };
};

/**
 * 获取热门标签
 */
export const getHotTags = async (params?: { limit?: number }): Promise<ApiResponse<string[]>> => {
  await delay(300);
  
  const limit = params?.limit || mockHotTags.length;
  
  return {
    code: 200,
    message: '获取成功',
    data: mockHotTags.slice(0, limit)
  };
};

/**
 * 获取用户信息
 */
export const getCommunityUserInfo = async (): Promise<ApiResponse<UserInfo>> => {
  await delay(500);
  
  return {
    code: 200,
    message: '获取成功',
    data: mockUserInfo
  };
};

/**
 * 创建新帖子
 */
export const createPost = async (params: CreatePostParams): Promise<ApiResponse<{ id: number; title: string }>> => {
  await delay(1000);
  
  const newPost = {
    id: mockPosts.length + 1,
    title: params.title
  };
  
  return {
    code: 200,
    message: '发布成功',
    data: newPost
  };
};

/**
 * 获取帖子详情
 */
export const getPostDetail = async (postId: string): Promise<ApiResponse<PostDetail>> => {
  await delay(700);
  
  // 这里简单处理，实际应该根据postId查找对应的帖子
  return {
    code: 200,
    message: '获取成功',
    data: mockPostDetail
  };
};

/**
 * 获取帖子评论
 */
export const getPostComments = async (
  postId: string, 
  params?: { page?: number; pageSize?: number }
): Promise<ApiResponse<{ total: number; comments: Comment[] }>> => {
  await delay(600);
  
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const total = mockComments.length;
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      total,
      comments: mockComments.slice((page - 1) * pageSize, page * pageSize)
    }
  };
};

/**
 * 点赞帖子
 */
export const likePost = async (postId: string): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> => {
  await delay(300);
  
  const isLiked = !mockPostDetail.isLiked;
  const likeCount = isLiked 
    ? mockPostDetail.likeCount + 1 
    : mockPostDetail.likeCount - 1;
  
  // 更新模拟数据
  mockPostDetail.isLiked = isLiked;
  mockPostDetail.likeCount = likeCount;
  
  return {
    code: 200,
    message: isLiked ? '点赞成功' : '取消点赞成功',
    data: {
      isLiked,
      likeCount
    }
  };
};

/**
 * 收藏帖子
 */
export const favoritePost = async (postId: string): Promise<ApiResponse<{ isFavorited: boolean; favoriteCount: number }>> => {
  await delay(300);
  
  const isFavorited = !mockPostDetail.isFavorited;
  const favoriteCount = isFavorited 
    ? mockPostDetail.favoriteCount + 1 
    : mockPostDetail.favoriteCount - 1;
  
  // 更新模拟数据
  mockPostDetail.isFavorited = isFavorited;
  mockPostDetail.favoriteCount = favoriteCount;
  
  return {
    code: 200,
    message: isFavorited ? '收藏成功' : '取消收藏成功',
    data: {
      isFavorited,
      favoriteCount
    }
  };
};

/**
 * 发表评论
 */
export const createComment = async (
  postId: string, 
  params: CreateCommentParams
): Promise<ApiResponse<Comment>> => {
  await delay(800);
  
  const newComment: Comment = {
    id: (mockComments.length + 1).toString(),
    author: {
      id: mockUserInfo.id,
      name: mockUserInfo.name,
      avatar: mockUserInfo.avatar,
      level: 3
    },
    content: params.content,
    createTime: new Date().toLocaleString(),
    likeCount: 0,
    isLiked: false,
    replies: []
  };
  
  // 更新模拟数据
  mockComments.unshift(newComment);
  mockPostDetail.commentCount += 1;
  
  return {
    code: 200,
    message: '评论成功',
    data: newComment
  };
};

/**
 * 点赞评论
 */
export const likeComment = async (commentId: string): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> => {
  await delay(300);
  
  let targetComment: Comment | CommentReply | undefined;
  
  // 查找评论
  for (const comment of mockComments) {
    if (comment.id === commentId) {
      targetComment = comment;
      break;
    }
    
    // 查找回复
    for (const reply of comment.replies) {
      if (reply.id === commentId) {
        targetComment = reply;
        break;
      }
    }
    
    if (targetComment) break;
  }
  
  if (!targetComment) {
    return {
      code: 404,
      message: '评论不存在',
      data: { isLiked: false, likeCount: 0 }
    };
  }
  
  const isLiked = !targetComment.isLiked;
  const likeCount = isLiked 
    ? targetComment.likeCount + 1 
    : targetComment.likeCount - 1;
  
  // 更新模拟数据
  targetComment.isLiked = isLiked;
  targetComment.likeCount = likeCount;
  
  return {
    code: 200,
    message: isLiked ? '点赞成功' : '取消点赞成功',
    data: {
      isLiked,
      likeCount
    }
  };
};

/**
 * 回复评论
 */
export const replyComment = async (
  commentId: string, 
  params: CreateReplyParams
): Promise<ApiResponse<CommentReply>> => {
  await delay(800);
  
  // 查找评论
  const targetComment = mockComments.find(comment => comment.id === commentId);
  
  if (!targetComment) {
    return {
      code: 404,
      message: '评论不存在',
      data: null as any
    };
  }
  
  // 构建回复数据
  const newReply: CommentReply = {
    id: `${commentId}-${targetComment.replies.length + 1}`,
    author: {
      id: mockUserInfo.id,
      name: mockUserInfo.name,
      avatar: mockUserInfo.avatar,
      level: 3
    },
    content: params.content,
    createTime: new Date().toLocaleString(),
    likeCount: 0,
    isLiked: false
  };
  
  // 如果有指定回复用户
  if (params.replyToUserId) {
    // 在实际应用中这里应该查询用户信息
    newReply.replyTo = {
      id: params.replyToUserId,
      name: '用户' + params.replyToUserId
    };
  }
  
  // 更新模拟数据
  targetComment.replies.push(newReply);
  mockPostDetail.commentCount += 1;
  
  return {
    code: 200,
    message: '回复成功',
    data: newReply
  };
};

// 导出所有API
const communityApi = {
  getColumns,
  getPosts,
  getSections,
  getHotTags,
  getCommunityUserInfo,
  createPost,
  getPostDetail,
  getPostComments,
  likePost,
  favoritePost,
  createComment,
  likeComment,
  replyComment
};

export default communityApi; 
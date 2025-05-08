import http from './http'
import{QuestionDetail, QuestionQueryParams, PaginationData } from '../types/question'

//高级搜索题目
export const searchQuestions=async (params:QuestionQueryParams)=>{
    try{
        const{data} =await http.get('/questions/search',{params});
        return {
            success: data.code===200,
            message: data.message,
            data: data.data
        };
    }catch(error){
        console.error("搜索题目失败：",error);
        return{
            success: false,
            message: '搜索题目失败',
            data: null
        };
    }
};

// 获取相似题目推荐
export const getSimilarQuestions = async (questionId: number, limit: number = 5) => {
    try {
      const { data } = await http.get(`/questions/search/similar/${questionId}`, {
        params: { limit }
      });
      return {
        success: data.code === 200,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('获取相似题目失败:', error);
      return {
        success: false,
        message: '获取相似题目失败',
        data: []
      };
    }
  };

  // 初始化题目索引（管理员功能）
export const initQuestionIndex = async () => {
    try {
      const { data } = await http.post('/questions/search/init-index');
      return {
        success: data.code === 200,
        message: data.message
      };
    } catch (error) {
      console.error('初始化题目索引失败:', error);
      return {
        success: false,
        message: '初始化题目索引失败'
      };
    }
  };

  const questionSearchApi={
    searchQuestions,
    getSimilarQuestions,
    initQuestionIndex
  };

  export default questionSearchApi;
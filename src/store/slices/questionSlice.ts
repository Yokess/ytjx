import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Question, 
  QuestionDetail, 
  WrongQuestion, 
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  QuestionQueryParams,
  PaginationData,
  Leaderboard
} from '../../types/question';
import questionApi from '../../api/questionApi';
import questionSearchApi from '../../api/questionSearchApi';

// 定义状态类型
interface QuestionState {
  // 题目列表相关
  questions: Question[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  
  // 当前题目详情
  currentQuestion: QuestionDetail | null;
  
  // 错题集
  wrongQuestions: WrongQuestion[];
  wrongQuestionsTotal: number;
  wrongQuestionsCurrentPage: number;
  
  // 排行榜
  leaderboard: Leaderboard | null;

  //搜索相关
  searchResults: Question[];
  searchTotal: number;
  searchCurrentPage: number;
  searchPageSize: number;
  searchTotalPages: number;
  similarQuestions: QuestionDetail[];
  
  // 加载状态
  loading: {
    questions: boolean;
    questionDetail: boolean;
    submitAnswer: boolean;
    wrongQuestions: boolean;
    leaderboard: boolean;

    search: boolean;
    similarQuestions: boolean;
  };
  
  // 错误信息
  error: {
    questions: string | null;
    questionDetail: string | null;
    submitAnswer: string | null;
    wrongQuestions: string | null;
    leaderboard: string | null;

    search: string | null;
    similarQuestions: string | null;
  };
  
  // 答题结果
  answerResult: SubmitAnswerResponse | null;


}

// 初始状态
const initialState: QuestionState = {
  questions: [],
  total: 0,
  currentPage: 1,
  pageSize: 20,
  totalPages: 0,
  
  currentQuestion: null,
  
  wrongQuestions: [],
  wrongQuestionsTotal: 0,
  wrongQuestionsCurrentPage: 1,
  
  leaderboard: null,

  // 搜索相关
  searchResults: [],
  searchTotal: 0,
  searchCurrentPage: 1,
  searchPageSize: 20,
  searchTotalPages: 0,
  similarQuestions: [],
  
  loading: {
    questions: false,
    questionDetail: false,
    submitAnswer: false,
    wrongQuestions: false,
    leaderboard: false,
    search: false,
    similarQuestions: false,
  },
  
  error: {
    questions: null,
    questionDetail: null,
    submitAnswer: null,
    wrongQuestions: null,
    leaderboard: null,
    search: null,
    similarQuestions: null,
  },
  
  answerResult: null
};

// 异步Action: 获取题目列表
export const fetchQuestions = createAsyncThunk(
  'question/fetchQuestions',
  async (params: QuestionQueryParams, { rejectWithValue }) => {
    try {
      const response = await questionApi.getQuestions(params);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 异步Action: 获取题目详情
export const fetchQuestionDetail = createAsyncThunk(
  'question/fetchQuestionDetail',
  async (questionId: number, { rejectWithValue }) => {
    try {
      const response = await questionApi.getQuestionDetail(questionId);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 异步Action: 提交答案
export const submitQuestionAnswer = createAsyncThunk(
  'question/submitAnswer',
  async ({ questionId, data }: { questionId: number; data: SubmitAnswerRequest }, { rejectWithValue }) => {
    try {
      const response = await questionApi.submitAnswer(questionId, data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 异步Action: 获取错题集
export const fetchWrongQuestions = createAsyncThunk(
  'question/fetchWrongQuestions',
  async ({ page, size }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await questionApi.getWrongQuestions(page, size);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 异步Action: 获取排行榜
export const fetchLeaderboard = createAsyncThunk(
  'question/fetchLeaderboard',
  async ({ limit }: { limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await questionApi.getLeaderboard(limit);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const searchQuestions =createAsyncThunk(
  'question/searchQuestions',
  async (params: QuestionQueryParams,{rejectWithValue})=>{
    try{
      const response=await questionSearchApi.searchQuestions(params);
      if(response.success){
        return response.data;
      }
      return rejectWithValue(response.message);
    }catch(error){
      return rejectWithValue((error as Error).message);
    }
  }
)

// 异步Action: 获取相似题目
export const fetchSimilarQuestions = createAsyncThunk(
  'question/fetchSimilarQuestions',
  async ({ questionId, limit }: { questionId: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await questionSearchApi.getSimilarQuestions(questionId, limit);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 异步Action: 初始化题目索引
export const initQuestionIndex = createAsyncThunk(
  'question/initQuestionIndex',
  async (_, { rejectWithValue }) => {
    try {
      const response = await questionSearchApi.initQuestionIndex();
      return response.success;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 创建Slice
const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
    clearAnswerResult: (state) => {
      state.answerResult = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setWrongQuestionsCurrentPage: (state, action: PayloadAction<number>) => {
      state.wrongQuestionsCurrentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    // 处理获取题目列表
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading.questions = true;
        state.error.questions = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<PaginationData<Question>>) => {
        state.loading.questions = false;
        state.questions = action.payload.records;
        state.total = action.payload.total;
        state.currentPage = action.payload.current;
        state.pageSize = action.payload.size;
        state.totalPages = action.payload.pages;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading.questions = false;
        state.error.questions = action.payload as string;
      });

    // 处理获取题目详情
    builder
      .addCase(fetchQuestionDetail.pending, (state) => {
        state.loading.questionDetail = true;
        state.error.questionDetail = null;
      })
      .addCase(fetchQuestionDetail.fulfilled, (state, action: PayloadAction<QuestionDetail>) => {
        state.loading.questionDetail = false;
        state.currentQuestion = action.payload;
      })
      .addCase(fetchQuestionDetail.rejected, (state, action) => {
        state.loading.questionDetail = false;
        state.error.questionDetail = action.payload as string;
      });

    // 处理提交答案
    builder
      .addCase(submitQuestionAnswer.pending, (state) => {
        state.loading.submitAnswer = true;
        state.error.submitAnswer = null;
      })
      .addCase(submitQuestionAnswer.fulfilled, (state, action: PayloadAction<SubmitAnswerResponse>) => {
        state.loading.submitAnswer = false;
        state.answerResult = action.payload;
      })
      .addCase(submitQuestionAnswer.rejected, (state, action) => {
        state.loading.submitAnswer = false;
        state.error.submitAnswer = action.payload as string;
      });

    // 处理获取错题集
    builder
      .addCase(fetchWrongQuestions.pending, (state) => {
        state.loading.wrongQuestions = true;
        state.error.wrongQuestions = null;
      })
      .addCase(fetchWrongQuestions.fulfilled, (state, action: PayloadAction<PaginationData<WrongQuestion>>) => {
        state.loading.wrongQuestions = false;
        state.wrongQuestions = action.payload.records;
        state.wrongQuestionsTotal = action.payload.total;
        state.wrongQuestionsCurrentPage = action.payload.current;
      })
      .addCase(fetchWrongQuestions.rejected, (state, action) => {
        state.loading.wrongQuestions = false;
        state.error.wrongQuestions = action.payload as string;
      });

    // 处理获取排行榜
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading.leaderboard = true;
        state.error.leaderboard = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action: PayloadAction<Leaderboard>) => {
        state.loading.leaderboard = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading.leaderboard = false;
        state.error.leaderboard = action.payload as string;
      });

      // 处理搜索题目
    builder
      .addCase(searchQuestions.pending, (state) => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchQuestions.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload.list || [];
        state.searchTotal = action.payload.total || 0;
        state.searchCurrentPage = action.payload.currentPage || 1;
        state.searchPageSize = action.payload.pageSize || 20;
        state.searchTotalPages = Math.ceil(action.payload.total / state.searchPageSize);
      })
      .addCase(searchQuestions.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search = action.payload as string;
      });

    // 处理获取相似题目
    builder
      .addCase(fetchSimilarQuestions.pending, (state) => {
        state.loading.similarQuestions = true;
        state.error.similarQuestions = null;
      })
      .addCase(fetchSimilarQuestions.fulfilled, (state, action) => {
        state.loading.similarQuestions = false;
        state.similarQuestions = action.payload || [];
      })
      .addCase(fetchSimilarQuestions.rejected, (state, action) => {
        state.loading.similarQuestions = false;
        state.error.similarQuestions = action.payload as string;
      });
  }
});

// 导出Actions
export const { 
  clearCurrentQuestion, 
  clearAnswerResult, 
  setCurrentPage, 
  setPageSize,
  setWrongQuestionsCurrentPage
} = questionSlice.actions;

// 导出Reducer
export default questionSlice.reducer; 
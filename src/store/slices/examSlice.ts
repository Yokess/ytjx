import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getExams, 
  getExamDetail, 
  participateExam, 
  getExamQuestions, 
  submitExamAnswers, 
  getExamResult, 
  getExamLeaderboard 
} from '../../api/examApi';
import { 
  Exam, 
  ExamDetail, 
  ExamQuestion, 
  ExamResult, 
  ExamStatus, 
  LeaderboardItem, 
  PaginationData, 
  SubmitAnswer,
  UserExam 
} from '../../types/exam';

// 考试模块的状态接口
interface ExamState {
  // 考试列表
  examList: {
    loading: boolean;
    data: Exam[];
    total: number;
    current: number;
    size: number;
    error: string | null;
  };
  // 考试详情
  examDetail: {
    loading: boolean;
    data: ExamDetail | null;
    error: string | null;
  };
  // 用户考试记录
  userExam: {
    loading: boolean;
    data: UserExam | null;
    error: string | null;
  };
  // 考试题目
  examQuestions: {
    loading: boolean;
    data: ExamQuestion[];
    error: string | null;
  };
  // 用户答案
  userAnswers: {
    [questionId: number]: string;
  };
  // 提交状态
  submitting: boolean;
  // 考试结果
  examResult: {
    loading: boolean;
    data: ExamResult | null;
    error: string | null;
  };
  // 排行榜
  leaderboard: {
    loading: boolean;
    data: LeaderboardItem[];
    total: number;
    current: number;
    size: number;
    error: string | null;
  };
}

// 初始状态
const initialState: ExamState = {
  examList: {
    loading: false,
    data: [],
    total: 0,
    current: 1,
    size: 10,
    error: null
  },
  examDetail: {
    loading: false,
    data: null,
    error: null
  },
  userExam: {
    loading: false,
    data: null,
    error: null
  },
  examQuestions: {
    loading: false,
    data: [],
    error: null
  },
  userAnswers: {},
  submitting: false,
  examResult: {
    loading: false,
    data: null,
    error: null
  },
  leaderboard: {
    loading: false,
    data: [],
    total: 0,
    current: 1,
    size: 10,
    error: null
  }
};

// 异步Action: 获取考试列表
export const fetchExams = createAsyncThunk(
  'exam/fetchExams',
  async (params: { keyword?: string; status?: ExamStatus; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await getExams(params);
      if (response.code === 200) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message || '获取考试列表失败');
    }
  }
);

// 异步Action: 获取考试详情
export const fetchExamDetail = createAsyncThunk(
  'exam/fetchExamDetail',
  async (examId: number, { rejectWithValue }) => {
    try {
      const response = await getExamDetail(examId);
      if (response.code === 200) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message || '获取考试详情失败');
    }
  }
);

// 异步Action: 参加考试
export const participateInExam = createAsyncThunk(
  'exam/participateInExam',
  async (examId: number, { rejectWithValue }) => {
    try {
      const response = await participateExam(examId);
      if (response.code === 200) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message || '参加考试失败');
    }
  }
);

// 异步Action: 获取考试题目
export const fetchExamQuestions = createAsyncThunk(
  'exam/fetchExamQuestions',
  async (examId: number, { rejectWithValue }) => {
    try {
      const response = await getExamQuestions(examId);
      if (response.code === 200) {
        return response.data.questions;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message || '获取考试题目失败');
    }
  }
);

// 异步Action: 提交考试答案
export const submitAnswers = createAsyncThunk(
  'exam/submitAnswers',
  async ({ examId, answers }: { examId: number; answers: SubmitAnswer[] }, { rejectWithValue }) => {
    try {
      const response = await submitExamAnswers(examId, answers);
      if (response.code === 200) {
        // 提交成功后立即获取考试结果
        const resultResponse = await getExamResult(examId);
        if (resultResponse.code === 200) {
          return resultResponse.data;
        }
        return { userExamId: response.data.userExamId, submitTime: response.data.submitTime };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message || '提交答案失败');
    }
  }
);

// 异步Action: 获取考试结果
export const fetchExamResult = createAsyncThunk(
  'exam/fetchExamResult',
  async (examId: number, { rejectWithValue }) => {
    try {
      const response = await getExamResult(examId);
      if (response.code === 200) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message || '获取考试结果失败');
    }
  }
);

// 异步Action: 获取考试排行榜
export const fetchExamLeaderboard = createAsyncThunk(
  'exam/fetchExamLeaderboard',
  async ({ examId, page = 1, size = 10 }: { examId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await getExamLeaderboard(examId, { page, size });
      if (response.code === 200) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message || '获取排行榜失败');
    }
  }
);

// 创建考试切片
const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    // 设置用户答案
    setUserAnswer(state, action: PayloadAction<{ questionId: number; answer: string }>) {
      const { questionId, answer } = action.payload;
      state.userAnswers[questionId] = answer;
    },
    // 清空用户答案
    clearUserAnswers(state) {
      state.userAnswers = {};
    },
    // 重置考试状态
    resetExamState(state) {
      state.examDetail.data = null;
      state.userExam.data = null;
      state.examQuestions.data = [];
      state.userAnswers = {};
      state.examResult.data = null;
    }
  },
  extraReducers: (builder) => {
    // 处理获取考试列表
    builder
      .addCase(fetchExams.pending, (state) => {
        state.examList.loading = true;
        state.examList.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.examList.loading = false;
        state.examList.data = action.payload.records;
        state.examList.total = action.payload.total;
        state.examList.current = action.payload.current;
        state.examList.size = action.payload.size;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.examList.loading = false;
        state.examList.error = action.payload as string;
      })
      
      // 处理获取考试详情
      .addCase(fetchExamDetail.pending, (state) => {
        state.examDetail.loading = true;
        state.examDetail.error = null;
      })
      .addCase(fetchExamDetail.fulfilled, (state, action) => {
        state.examDetail.loading = false;
        state.examDetail.data = action.payload;
      })
      .addCase(fetchExamDetail.rejected, (state, action) => {
        state.examDetail.loading = false;
        state.examDetail.error = action.payload as string;
      })
      
      // 处理参加考试
      .addCase(participateInExam.pending, (state) => {
        state.userExam.loading = true;
        state.userExam.error = null;
      })
      .addCase(participateInExam.fulfilled, (state, action) => {
        state.userExam.loading = false;
        state.userExam.data = action.payload;
      })
      .addCase(participateInExam.rejected, (state, action) => {
        state.userExam.loading = false;
        state.userExam.error = action.payload as string;
      })
      
      // 处理获取考试题目
      .addCase(fetchExamQuestions.pending, (state) => {
        state.examQuestions.loading = true;
        state.examQuestions.error = null;
      })
      .addCase(fetchExamQuestions.fulfilled, (state, action) => {
        state.examQuestions.loading = false;
        state.examQuestions.data = action.payload;
      })
      .addCase(fetchExamQuestions.rejected, (state, action) => {
        state.examQuestions.loading = false;
        state.examQuestions.error = action.payload as string;
      })
      
      // 处理提交答案
      .addCase(submitAnswers.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitAnswers.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(submitAnswers.rejected, (state) => {
        state.submitting = false;
      })
      
      // 处理获取考试结果
      .addCase(fetchExamResult.pending, (state) => {
        state.examResult.loading = true;
        state.examResult.error = null;
      })
      .addCase(fetchExamResult.fulfilled, (state, action) => {
        state.examResult.loading = false;
        state.examResult.data = action.payload;
      })
      .addCase(fetchExamResult.rejected, (state, action) => {
        state.examResult.loading = false;
        state.examResult.error = action.payload as string;
      })
      
      // 处理获取排行榜
      .addCase(fetchExamLeaderboard.pending, (state) => {
        state.leaderboard.loading = true;
        state.leaderboard.error = null;
      })
      .addCase(fetchExamLeaderboard.fulfilled, (state, action) => {
        state.leaderboard.loading = false;
        state.leaderboard.data = action.payload.records;
        state.leaderboard.total = action.payload.total;
        state.leaderboard.current = action.payload.current;
        state.leaderboard.size = action.payload.size;
      })
      .addCase(fetchExamLeaderboard.rejected, (state, action) => {
        state.leaderboard.loading = false;
        state.leaderboard.error = action.payload as string;
      });
  }
});

export const { setUserAnswer, clearUserAnswers, resetExamState } = examSlice.actions;

export default examSlice.reducer; 
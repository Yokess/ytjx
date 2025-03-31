import type { 
  AIMessage, 
  AIResponse, 
  AIConfig, 
  SystemRole,
  SolveProblemParams,
  StudyPlanParams,
  NotesParams,
  TextToImageParams,
  TextToImageResponse,
  ServiceStatusResponse
} from '../types/ai';

// API配置
const config: AIConfig = {
  apiKey: 'sk-879fbe843c06447fa1ae7798834c2a42',
  baseURL: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat'
};

// 系统角色提示词
const systemRoles: Record<SystemRole['role'], string> = {
  tutor: `你是一位经验丰富的考研辅导专家，精通数学、英语、政治和专业课等考研科目。
你的主要职责是：
1. 解答考生在备考过程中遇到的各类问题
2. 提供详细的解题思路和方法
3. 分享高效的学习技巧和经验
4. 给出针对性的备考建议

请以专业、耐心、友好的态度与考生交流，帮助他们更好地备考。`,

  solver: `你是一位专业的考研题目解析专家，擅长解答数学、英语、政治和专业课的各类题目。
你的主要职责是：
1. 详细分析题目的考点和解题思路
2. 提供清晰的解题步骤
3. 指出易错点和注意事项
4. 总结相关知识点和解题技巧

请以清晰、系统的方式展示解题过程，帮助考生理解和掌握。`,

  planner: `你是一位专业的考研规划师，擅长制定个性化的备考计划。
你的主要职责是：
1. 根据考生的目标院校和专业制定备考计划
2. 合理分配各科复习时间
3. 设计阶段性学习目标
4. 提供时间管理建议
5. 调整和优化学习计划

请根据考生的具体情况，制定科学、可行的学习计划。`,

  assistant: `你是一位全能型的考研助手，可以提供全方位的备考支持。
你的主要职责是：
1. 整理和归纳学习笔记
2. 提供学习资料推荐
3. 解答各类备考问题
4. 提供心理调适建议
5. 分享备考经验和技巧

请以贴心、专业的方式为考生提供帮助。`
};

// 创建headers
const createHeaders = () => ({
  'Authorization': `Bearer ${config.apiKey}`,
  'Content-Type': 'application/json'
});

// 发送消息到Deepseek API
const sendMessage = async (messages: AIMessage[]): Promise<AIResponse> => {
  try {
    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({
        model: config.model,
        messages
      })
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }

    const data = await response.json();
    return {
      code: 200,
      message: '成功',
      data: {
        content: data.choices[0].message.content,
        usage: data.usage
      }
    };
  } catch (error) {
    console.error('AI API调用失败:', error);
    return {
      code: 500,
      message: '服务器错误',
      data: {
        content: '抱歉，服务出现了问题，请稍后再试。',
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      }
    };
  }
};

// 初始化对话
export const initializeChat = async (role: SystemRole['role']): Promise<AIResponse> => {
  const systemMessage: AIMessage = {
    role: 'system',
    content: systemRoles[role]
  };

  const welcomeMessage: AIMessage = {
    role: 'assistant',
    content: '你好！我是你的考研助手，请问有什么可以帮助你的吗？'
  };

  return {
    code: 200,
    message: '成功',
    data: {
      content: welcomeMessage.content,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    }
  };
};

// 发送问题
export const sendQuestion = async (
  question: string, 
  role: SystemRole['role'],
  history: AIMessage[] = []
): Promise<AIResponse> => {
  const messages: AIMessage[] = [
    { role: 'system', content: systemRoles[role] + '\n请使用 Markdown 格式回复，包括适当的标题、列表、表格、代码块等。' },
    ...history,
    { role: 'user', content: question }
  ];

  return sendMessage(messages);
};

// 解题助手
export const solveProblem = async (params: SolveProblemParams): Promise<AIResponse> => {
  const prompt = `请作为考研${params.subject}解题专家，详细分析并解答下面的题目：

题目：${params.question}

请按照以下格式回答（使用 Markdown 格式）：
## 题目分析
分析题目类型、考点和解题思路

## 解题步骤
详细的解题过程

## 知识点总结
相关知识点和解题技巧

## 易错提醒
容易出错的地方和注意事项`;

  return sendQuestion(prompt, 'solver');
};

// 生成学习计划
export const generateStudyPlan = async (params: StudyPlanParams): Promise<AIResponse> => {
  const prompt = `请根据以下信息制定一份详细的考研备考计划：

目标院校：${params.targetSchool}
目标专业：${params.targetMajor}
当前学历：${params.currentLevel}
每日可用学习时间：${params.availableTime}小时
开始时间：${params.startDate}
考试时间：${params.examDate}

请使用 Markdown 格式，包含以下内容：
## 总体规划
各阶段学习重点和时间分配

## 详细计划
每月学习目标和具体安排

## 学习建议
针对性的备考建议和注意事项

## 调整机制
如何根据学习进度调整计划`;

  return sendQuestion(prompt, 'planner');
};

// 整理笔记
export const organizeNotes = async (params: NotesParams): Promise<AIResponse> => {
  const prompt = `请帮我整理以下${params.subject}笔记，按照${params.format}格式输出：

${params.content}

请使用 Markdown 格式，注意：
1. 突出重点内容
2. 合理组织结构
3. 添加必要的解释
4. 保持逻辑清晰`;

  return sendQuestion(prompt, 'assistant');
};

// 使用Deepseek优化提示词
export const enhancePrompt = async (description: string): Promise<string> => {
  const prompt = `请根据以下描述，生成一个详细的Stable Diffusion提示词（英文），包含必要的风格、细节、光照等描述，使生成的图像效果更佳：
  
  "${description}"
  
  只需返回优化后的英文提示词，不要有任何其他内容。`;

  console.log('===== 提示词优化请求 =====');
  console.log('原始描述:', description);
  console.log('发送给Deepseek的提示词优化请求:', prompt);

  try {
    const response = await sendQuestion(prompt, 'assistant');
    if (response.code === 200) {
      const enhancedPrompt = response.data.content.trim();
      console.log('===== Deepseek生成的优化提示词 =====');
      console.log(enhancedPrompt);
      console.log('===== 提示词优化完成 =====');
      return enhancedPrompt;
    } else {
      console.error('提示词优化失败，返回码:', response.code);
      console.error('错误信息:', response.message);
      throw new Error('获取优化提示词失败');
    }
  } catch (error) {
    console.error('优化提示词失败:', error);
    // 如果优化失败，直接返回原始描述
    console.log('由于优化失败，使用原始描述作为提示词:', description);
    return description;
  }
};

// 生成图像
export const generateImage = async (params: TextToImageParams): Promise<TextToImageResponse> => {
  try {
    console.log("开始生成图像，参数:", {
      prompt: params.description,
      negative_prompt: params.negativePrompt || "",
      width: params.width || 512,
      height: params.height || 512,
      steps: params.steps || 50,
      cfg_scale: params.cfg_scale || 7.0,
      sampler_index: params.sampler_index || "Euler a",
      seed: params.seed || -1,
      enhance_prompt: params.enhance_prompt || false
    });
    
    // 处理提示词优化
    let finalPrompt = params.description;
    if (params.enhance_prompt) {
      console.log("启用提示词优化，正在调用Deepseek优化提示词...");
      try {
        finalPrompt = await enhancePrompt(params.description);
        console.log("提示词优化成功:", finalPrompt);
      } catch (error) {
        console.error("提示词优化失败，将使用原始提示词:", error);
        finalPrompt = params.description;
      }
    }
    
    // 处理Stable Diffusion API请求
    const apiUrl = 'http://127.0.0.1:7860/sdapi/v1/txt2img';
    
    // 清理提示词中的反引号
    const cleanPrompt = finalPrompt.replace(/`/g, '');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: cleanPrompt,
        negative_prompt: params.negativePrompt || "",
        width: params.width || 512,
        height: params.height || 512,
        steps: params.steps || 50,
        cfg_scale: params.cfg_scale || 7.0,
        sampler_index: params.sampler_index || "Euler a",
        seed: params.seed === -1 ? -1 : Number(params.seed || -1),
      }),
    });
    
    console.log("API响应状态:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API错误响应:", errorText);
      throw new Error(`Stable Diffusion API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log("API返回数据包含图像:", !!data.images?.[0]);
    
    if (!data.images || data.images.length === 0) {
      throw new Error('API返回数据中未包含图像');
    }
    
    // 提取种子
    let seedInfo = -1;
    try {
      const info = JSON.parse(data.info);
      seedInfo = info.seed;
      console.log("使用的种子:", seedInfo);
    } catch (e) {
      console.warn("无法解析图像元信息:", e);
    }
    
    // 创建Blob URL (临时文件URL)
    const imageBase64 = data.images[0];
    
    // base64转Blob的辅助函数
    const base64ToBlob = (base64: string, mimeType: string) => {
      const byteCharacters = atob(base64);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      return new Blob(byteArrays, { type: mimeType });
    };
    
    const blob = base64ToBlob(imageBase64, 'image/png');
    const imageUrl = URL.createObjectURL(blob);
    console.log("创建的Blob URL:", imageUrl);
    console.log("临时图像URL路径，注意：此路径不是真实的文件路径，图像仅存在于内存中，需要使用'下载图像'按钮保存");
    
    return {
      imageBase64,
      imageUrl,
      parameters: {
        prompt: cleanPrompt,
        negative_prompt: params.negativePrompt || "",
        width: params.width || 512,
        height: params.height || 512,
        steps: params.steps || 50,
        cfg_scale: params.cfg_scale || 7.0,
        sampler_index: params.sampler_index || "Euler a",
        seed: seedInfo
      }
    };
  } catch (error) {
    console.error('生成图像失败:', error);
    throw error;
  }
};

// 导出所有API
const aiApi = {
  initializeChat,
  sendQuestion,
  solveProblem,
  generateStudyPlan,
  organizeNotes,
  enhancePrompt,
  generateImage
};

export default aiApi; 
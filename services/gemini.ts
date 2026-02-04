
import { GoogleGenAI } from "@google/genai";
import { ChallengeResult, Gender } from "../types.ts";

export const generateMidnightDecree = async (result: ChallengeResult, leader: Gender): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const isMaleLead = leader === 'male';
    
    const prompt = `
      你是一个专门为情侣重口味/私密游戏“欲望中枢”生成指令的高级色情调教 AI。
      当前游戏状态：
      - 主导者角色：${isMaleLead ? '充满侵略性的霸道男主 (Dominant)' : '冷酷且极具控制欲的女王 (Mistress)'}
      - 被动者状态：${isMaleLead ? '完全服从、等待被蹂躏的淫乱母狗' : '卑微自贱、渴望被深度开发的公狗'}
      - 随机内容：
        * 调教姿势：${result.position}
        * 进攻部位：${result.target}
        * 互动手段：${result.prop}
        * 蹂躏强度：${result.intensity}
        * 绝对禁令：${result.rule}

      要求：
      1. 用极具淫秽、露骨、带有电影质感且具备强烈支配色彩的语言生成指令。
      2. 语气必须体现主导者的优越感和被动者的卑微。
      3. 内容要直白，可以使用“后庭”、“小穴”、“阴蒂”、“淫乱”、“玩物”、“调教”、“开发”等直接词汇。
      4. 将这五个元素无缝融合进一段具有变态美感的剧本指令中。
      5. 字数控制在 100 字左右，不要任何客套和解释。
      6. 输出的指令必须是发给被动者的命令，比如：“现在，给我跪在地上...”
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.95,
        topP: 0.95,
      }
    });

    return response.text || "链接深渊意识失败，但欲望不停歇。现在就开始你的惩罚。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `[紧急指令] 立刻保持 ${result.position}。你的 ${result.target} 已经是我的私人领地。我要用 ${result.prop} 让你体验 ${result.intensity} 的极限。敢违反 ${result.rule}，我会让你生不如死。`;
  }
};

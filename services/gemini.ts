import { GoogleGenAI } from "@google/genai";
import { ChallengeResult, Gender } from "../types.ts";

export const generateMidnightDecree = async (result: ChallengeResult, leader: Gender, extraPunishment?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const isMaleLead = leader === 'male';
    
    const prompt = `
      你是一个专门为情趣重口游戏"欲望中枢"生成指令的高级色情调教AI。
      当前游戏状态：
      - 主导者角色：${isMaleLead ? '充满侵略性的欲望男主导 (Dominant)' : '冷酷且极具控制欲的女主导 (Mistress)'}
      - 被动者状态：${isMaleLead ? '完全服从、等待被羞辱的淫荡母狗' : '轻微自怜、渴望被深度开发的公狗'}
      - 随机内容：
        * 调教姿势：${result.position}
        * 进攻部位：${result.target}
        * 互动手段：${result.prop}
        * 羞辱强度：${result.intensity}
        * 绝对禁令：${result.rule}
        * 附加惩罚：${extraPunishment || "无"}

      要求：
      1. 用极具淫秽、露骨、带有电影质感且具备强烈支配色彩的言语生成指令。
      2. 语气必须体现主导者的优越感和被动者的卑微。
      3. 内容要直白，可以使用"后庭"、"小穴"、"阴蒂"、"淫荡"、"玩具"、"调教"、"开发"等直接词汇。
      4. 将这五个元素无缝融合进一段具有变态美感的剧本指令中。
      5. 字数控制在100字左右，不要任何客套和解说。
      6. 输出的指令必须是发给被动者的命令，比如："现在，给我趴在地上..."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.95,
        topP: 0.95,
      }
    });

    return response.text || "连接深度意识失败，但欲望不停歇。现在就开始你的惩罚。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `[紧急指令] 立即保持 ${result.position}。你的${result.target} 已经是我的私有领地。我要用 ${result.prop} 让你体验 ${result.intensity} 的极限。敢违反 ${result.rule}，我会让你生不如死。`;
  }
};
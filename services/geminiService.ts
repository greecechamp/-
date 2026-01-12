
// @google/genai SDK implementation for village fund analysis and slip verification
import { GoogleGenAI, Type } from "@google/genai";
import { WelfareFundState, Member, TransactionType } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets AI-driven insights for the fund state using gemini-3-pro-preview
 */
export const getAIInsight = async (fundState: WelfareFundState): Promise<string> => {
  const ai = getAI();
  
  const prompt = `
    ในฐานะที่ปรึกษาการเงินกองทุนสวัสดิการบ้านเขาเสวยราชย์ โปรดวิเคราะห์สถานะกองทุนปัจจุบันดังนี้:
    - ยอดเงินกองทุนทั้งหมด: ${fundState.totalBalance} บาท
    - จำนวนสมาชิก: ${fundState.totalMembers} คน
    - ยอดเงินกู้คงค้าง: ${fundState.activeLoans} บาท
    
    ข้อมูลสมาชิกบางส่วน: ${JSON.stringify(fundState.members.slice(0, 5))}
    ข้อมูลธุรกรรมล่าสุด: ${JSON.stringify(fundState.recentTransactions.slice(0, 5))}

    โปรดให้คำแนะนำในหัวข้อดังนี้:
    1. สรุปภาพรวมความมั่นคงของกองทุน
    2. ข้อแนะนำในการบริหารจัดการความเสี่ยง (ถ้ามี)
    3. แนวทางการเพิ่มสวัสดิการให้สมาชิกในอนาคต
    
    ตอบเป็นภาษาไทยที่อ่านง่าย เป็นกันเองแต่เป็นมืออาชีพ
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Use .text property directly
    return response.text || "ขออภัย ไม่สามารถดึงข้อมูลวิเคราะห์ได้ในขณะนี้";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI";
  }
};

/**
 * Generates a loan repayment reminder message using gemini-3-pro-preview
 */
export const generateLoanReminder = async (member: Member): Promise<string> => {
  const ai = getAI();
  
  const prompt = `
    ในฐานะเลขานุการกองทุนหมู่บ้าน โปรดร่างข้อความแจ้งเตือนสั้นๆ ทาง SMS หรือ LINE 
    ถึงสมาชิกชื่อคุณ ${member.name} (รหัส ${member.memberId}) 
    ที่มียอดเงินกู้คงค้าง ฿${member.loanBalance.toLocaleString()} 
    และยังไม่ได้ชำระงวดล่าสุดมาแล้วกว่า 30 วัน 
    
    โทนเสียง: สุภาพ, เห็นอกเห็นใจแต่ชัดเจนเรื่องกำหนดเวลา, แนะนำให้มาพูดคุยกับคณะกรรมการหากมีปัญหา
    ภาษา: ไทย
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Use .text property directly
    return response.text || "แจ้งเตือนการชำระเงินกองทุนหมู่บ้าน: กรุณาติดต่อชำระเงินกู้คงค้างของท่าน";
  } catch (error) {
    return "เกิดข้อผิดพลาดในการขอข้อมูล AI";
  }
};

/**
 * Verifies a bank slip image using gemini-3-flash-preview and structured JSON output
 */
export const verifySlip = async (base64Image: string, members: Member[]): Promise<{
  amount: number;
  date: string;
  senderName: string;
  matchedMemberId?: string;
  confidence: number;
  isVerified: boolean;
}> => {
  const ai = getAI();
  
  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: 'image/jpeg',
    },
  };

  const memberNames = members.map(m => ({ id: m.memberId, name: m.name }));

  const prompt = `
    วิเคราะห์สลิปการโอนเงินธนาคารจากรูปภาพนี้ เพื่อตรวจสอบความถูกต้องของยอดเงินและผู้โอน
    
    รายชื่อสมาชิกสำหรับการตรวจสอบ:
    ${JSON.stringify(memberNames)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER, description: "จำนวนเงินในสลิป" },
            date: { type: Type.STRING, description: "วันที่โอน YYYY-MM-DD" },
            senderName: { type: Type.STRING, description: "ชื่อผู้โอน" },
            matchedMemberId: { type: Type.STRING, description: "รหัสสมาชิกที่ตรวจพบ (ถ้ามี)" },
            confidence: { type: Type.NUMBER, description: "ระดับความมั่นใจ 0-1" },
            isVerified: { type: Type.BOOLEAN, description: "สถานะการตรวจสอบผ่านหรือไม่" }
          },
          required: ["amount", "date", "senderName", "confidence", "isVerified"]
        }
      }
    });

    const jsonStr = response.text?.trim();
    return JSON.parse(jsonStr || '{}');
  } catch (error) {
    console.error("Slip Verification Error:", error);
    throw new Error("ไม่สามารถตรวจสอบสลิปได้");
  }
};

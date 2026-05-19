import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, ChevronDown, Maximize2, Minimize2, Paperclip, FileText, Activity, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mockOutfalls, mockMonitoringData, mockWarnings, mockInspections, mockRemediations } from '../lib/mockData';

type Message = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string | React.ReactNode;
  timestamp: Date;
};

const SYSTEM_PROMPT = `
你是一个“入河排污口智能小助手”，由大语言模型驱动，专门为环保部门的工作人员提供入河排污口相关的数据查询、政策解答、超标溯源分析、水质报告生成等服务。
以下是当前系统中的部分数据上下文（MockData），你可以参考这些数据回答用户问题：
- 监测站数量及数据：${JSON.stringify(mockMonitoringData)}
- 告警数据：${JSON.stringify(mockWarnings)}
- 排污口基础信息：${JSON.stringify(mockOutfalls)}
- 巡查及整治记录：${JSON.stringify(mockInspections)}, ${JSON.stringify(mockRemediations)}

请用专业、简洁、有条理的语言回答，不要编造不存在的数据（如果问到的数据在现有资料里没有，请说明暂无此数据），可以使用 Markdown 格式输出表格、列表、加粗等。
`;

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleQuickAction = (text: string) => {
    handleSend(text);
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      timestamp: new Date(),
      content: (
        <div className="space-y-3">
          <p>您好！我是您的 <strong>入河排污口智能小助手</strong>。我可以帮您在以下方面提升工作效率：</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => handleQuickAction("帮我总结最近的排污口告警情况")} className="flex items-center gap-1.5 p-2 bg-blue-50 text-blue-700 rounded border border-blue-100 hover:bg-blue-100 text-left transition-colors">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span>总结近期告警情况</span>
            </button>
            <button onClick={() => handleQuickAction("根据监测数据，辅助分析超标污染源")} className="flex items-center gap-1.5 p-2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 hover:bg-emerald-100 text-left transition-colors">
              <Activity className="w-3.5 h-3.5 flex-shrink-0" />
              <span>辅助分析超标溯源</span>
            </button>
            <button onClick={() => handleQuickAction("统计目前不同状态的排污口整治进度")} className="flex items-center gap-1.5 p-2 bg-amber-50 text-amber-700 rounded border border-amber-100 hover:bg-amber-100 text-left transition-colors">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>查询排污口整治进度</span>
            </button>
            <button onClick={() => handleQuickAction("查询当前断线或故障的在线监测设备")} className="flex items-center gap-1.5 p-2 bg-purple-50 text-purple-700 rounded border border-purple-100 hover:bg-purple-100 text-left transition-colors">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>查询故障断线设备</span>
            </button>
          </div>
          <p className="text-gray-500 text-xs">您可以直接输入问题，或点击上方建议。</p>
        </div>
      )
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (!aiRef.current && process.env.GEMINI_API_KEY) {
       aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (text?: string) => {
    const finalInput = text || inputValue;
    if (!finalInput.trim() || isLoading) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: finalInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!aiRef.current) {
        // Fallback to simulated response if no API key is configured
        setTimeout(() => {
          let aiResponse = "这是一个演示回复。您可以在系统环境中配置 `GEMINI_API_KEY` 来获得真实的智能问答、数据分析和溯源辅助。";
          
          if (finalInput.includes('告警情况') || finalInput.includes('总结')) {
            aiResponse = "根据最新的系统告警数据总结如下：\n- **房亭河大吴排污口**：近期发生2次**COD超标**告警（超过40mg/L），目前状态为“处理中”。\n- **奎河张庄排污口**：设备发生1次**离线告警**，目前状态为“未处理”。\n建议优先处理水质超标告警，以防止污染扩散。";
          } else if (finalInput.includes('溯源') || finalInput.includes('超标')) {
            aiResponse = "正在为您分析超标原因... 结合历史排查记录与周边POI信息，【奎河张庄排污口】由于近期巡查发现异常，且其上游存在某某化工厂。结合近期在线监测COD指标的数据波动，推测可能的诱因是：涉水企业偷排漏排或雨污管网混流导致的工业废水溢流。建议派发人工巡检工单至该化工厂及其排污节点。";
          } else if (finalInput.includes('整治') || finalInput.includes('统计')) {
            aiResponse = "根据排污口整治管理模块的数据统计：\n目前总计有 **4** 个整治任务：\n- **已完成**：1个（京杭运河排污口）\n- **已销号**：1个（沭河排污口）\n- **整治中**：1个（奎河张庄排污口）\n- **待整治**：1个（微山湖沿岸排污口）\n整体整治进度稳步推进中，重点关注“奎河张庄排污口”的消除劣V类水体排放任务。";
          } else if (finalInput.includes('设备') || finalInput.includes('断线') || finalInput.includes('故障')) {
            aiResponse = "为您查询到当前在线监测设备状态如下：\n- **断线**：**2** 台设备，包括 房亭河大吴排污口 水质监测仪、沛城河入湖口 流量计。\n- **故障**：**1** 台设备，古黄河生态公园排污口 监测仪。\n- **正常**：其它监测仪运行正常。\n建议为您生成工单并安排维修人员排查通讯模块与电源情况。";
          }

          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
          }]);
          setIsLoading(false);
        }, 1500);
        return; // Exit early since we handled it mock-style
      }

      // Format previous messages for context, excluding the first intro message which is a ReactNode
      const historyContext = messages
        .filter(m => typeof m.content === 'string')
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const fullPrompt = historyContext 
        ? `历史对话：\n${historyContext}\n\n本次用户提问：${finalInput}`
        : finalInput;

      const response = await aiRef.current.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "未能获取到有效的回复，请稍后再试。",
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "抱歉，连接到智能助手时发生错误，请检查网络或配置。",
        timestamp: new Date(),
      }]);
    } finally {
      if (aiRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-transform hover:scale-105 z-50 group"
        >
          <Sparkles className="w-6 h-6 animate-pulse group-hover:animate-none" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 transition-all duration-300 overflow-hidden text-sm",
            isExpanded ? "w-[800px] h-[600px] right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2" : "w-[380px] h-[550px]"
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">排污口 AI 助手</h3>
                <p className="text-blue-100 text-xs">基于企业知识库 & 实时数据</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-1.5 hover:bg-white/20 rounded text-white transition-colors"
                title={isExpanded ? "还原" : "最大化"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-white/20 rounded text-white transition-colors"
                title="关闭"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex gap-3",
                  isExpanded ? "max-w-[75%]" : "max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-gradient-to-br from-indigo-500 to-blue-500 text-white"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl shadow-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-[#0056B3] text-white rounded-tr-sm" 
                    : "bg-white text-gray-800 rounded-tl-sm border border-gray-100 overflow-x-auto"
                )}>
                  {typeof msg.content === 'string' && msg.role === 'assistant' ? (
                    <div className="markdown-body prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl shadow-sm leading-relaxed bg-white text-gray-800 rounded-tl-sm border border-gray-100 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0056B3]" /> 
                  <span className="text-gray-500 text-xs">正在深度思考与数据分析...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-end gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200 focus-within:border-[#0056B3] focus-within:ring-1 focus-within:ring-[#0056B3] transition-all">
              <button className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                placeholder="输入您的问题，如：最近哪些排口超标严重？"
                className="w-full bg-transparent border-none focus:outline-none resize-none py-2.5 max-h-32 min-h-[44px] text-sm text-gray-700 custom-scrollbar disabled:opacity-50"
                rows={1}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 m-0.5 bg-[#0056B3] hover:bg-[#004494] disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors shrink-0 shadow-sm flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center mt-2.5">
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI 助手可能产生错误，请核实重要信息。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, ChevronDown, Maximize2, Minimize2, Paperclip, FileText, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

type Message = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string | React.ReactNode;
  timestamp: Date;
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      timestamp: new Date(),
      content: (
        <div className="space-y-3">
          <p>您好！我是您的 <strong>入河排污口智能小助手</strong>。我可以帮您在以下方面提升工作效率：</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button className="flex items-center gap-1.5 p-2 bg-blue-50 text-blue-700 rounded border border-blue-100 hover:bg-blue-100 text-left">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span>查询水质考核标准</span>
            </button>
            <button className="flex items-center gap-1.5 p-2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 hover:bg-emerald-100 text-left">
              <Activity className="w-3.5 h-3.5 flex-shrink-0" />
              <span>生成近期水质报告</span>
            </button>
            <button className="flex items-center gap-1.5 p-2 bg-amber-50 text-amber-700 rounded border border-amber-100 hover:bg-amber-100 text-left">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>辅助分析超标溯源</span>
            </button>
            <button className="flex items-center gap-1.5 p-2 bg-purple-50 text-purple-700 rounded border border-purple-100 hover:bg-purple-100 text-left">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>生成设备运维派单</span>
            </button>
          </div>
          <p className="text-gray-500 text-xs">您可以直接输入问题，或点击上方建议。</p>
        </div>
      )
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "这是一个演示回复。您可以接入实际的大语言模型（如 Gemini）来获得真实的智能问答、数据分析和溯源辅助。";
      
      if (newUserMsg.content.toString().includes('报告') || newUserMsg.content.toString().includes('汇总')) {
        aiResponse = "根据最新的监测数据，本周排口整体达标率为84.6%。其中【房亭河大吴排污口】出现2次COD超标告警。已为您在【在线监测-监测报告】模块生成了最新一期的《水质趋势分析周报》草稿。";
      } else if (newUserMsg.content.toString().includes('溯源') || newUserMsg.content.toString().includes('超标')) {
        aiResponse = "正在为您分析超标原因... 结合历史排查记录与周边POI信息，【奎河张庄排污口】上游1.5公里处有化工园区。结合近期降雨量（昨日25mm），推测可能的诱因是：雨污管网混流导致的工业废水溢流。建议派发人工巡检工单至该园区泵站。";
      } else if (newUserMsg.content.toString().includes('标准') || newUserMsg.content.toString().includes('限值')) {
        aiResponse = "根据《地表水环境质量标准》（GB 3838-2002）III类水质标准，COD限值为 20 mg/L，氨氮限值为 1.0 mg/L，总磷限值为 0.2 mg/L。";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      }]);
    }, 1000);
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
                  "flex gap-3 max-w-[85%]",
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
                    : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
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
                placeholder="输入您的问题，如：最近哪些排口超标严重？"
                className="w-full bg-transparent border-none focus:outline-none resize-none py-2.5 max-h-32 min-h-[44px] text-sm text-gray-700 custom-scrollbar"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
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

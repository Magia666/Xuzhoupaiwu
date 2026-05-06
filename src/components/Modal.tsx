import { X } from "lucide-react";
import { cn } from "../lib/utils";

export default function Modal({ title, children, onClose, onConfirm, confirmText = "确定", showFooter = true, size = "md" }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={cn("bg-white rounded-xl shadow-xl flex flex-col max-h-full", 
        size === "sm" ? "w-full max-w-md" : 
        size === "lg" ? "w-full max-w-4xl" : 
        size === "xl" ? "w-full max-w-6xl" :
        "w-full max-w-2xl"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
        {showFooter && (
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              取消
            </button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-[#0056B3] rounded-lg hover:bg-[#004494]">
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

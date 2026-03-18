export const mockStats = {
  totalOutfalls: 128,
  onlineMonitoring: 115,
  waterQualityCompliance: 94.2,
  totalWarnings: 24,
  unhandledWarnings: 5,
};

export const mockOutfalls = [
  { 
    id: "EB320312001", name: "奎河张庄排污口", type: "工业排污口", status: "normal", lat: 34.2, lng: 117.1, waterQuality: "II类", river: "奎河", manager: "张三", phone: "13800138000", updateTime: "2026-03-18 10:00",
    basin: "淮河流域", entryType: "明渠", flowType: "连续", gateType: "闸门", receivingWater: "奎河", drainageChar: "工业废水", region: "铜山区", address: "张庄村1号", grid: "网格A1", responsibleEntity: "某某化工厂", industryDept: "环保局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-001"
  },
  { 
    id: "EB320312002", name: "房亭河大吴排污口", type: "城镇污水处理厂排污口", status: "warning", lat: 34.3, lng: 117.2, waterQuality: "IV类", river: "房亭河", manager: "李四", phone: "13900139000", updateTime: "2026-03-18 09:30",
    basin: "淮河流域", entryType: "暗管", flowType: "间歇", gateType: "无", receivingWater: "房亭河", drainageChar: "生活污水", region: "铜山区", address: "大吴镇2号", grid: "网格B2", responsibleEntity: "大吴污水处理厂", industryDept: "住建局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-002"
  },
  { 
    id: "EB320312003", name: "故黄河汉王排污口", type: "农业排口", status: "offline", lat: 34.1, lng: 117.0, waterQuality: "III类", river: "故黄河", manager: "王五", phone: "13700137000", updateTime: "2026-03-17 15:00",
    basin: "黄河流域", entryType: "明渠", flowType: "间歇", gateType: "泵站", receivingWater: "故黄河", drainageChar: "农田退水", region: "铜山区", address: "汉王镇3号", grid: "网格C3", responsibleEntity: "汉王镇政府", industryDept: "农业农村局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-003"
  },
  { 
    id: "EB320312004", name: "微山湖沿岸排污口", type: "其他排口", status: "maintenance", lat: 34.4, lng: 117.3, waterQuality: "III类", river: "微山湖", manager: "赵六", phone: "13600136000", updateTime: "2026-03-16 11:20",
    basin: "南四湖流域", entryType: "暗管", flowType: "连续", gateType: "无", receivingWater: "微山湖", drainageChar: "混合污水", region: "铜山区", address: "沿湖村4号", grid: "网格D4", responsibleEntity: "沿湖村委会", industryDept: "环保局", attachments: [], auditStatus: "pending", cancelStatus: "active", qrCode: ""
  },
  { 
    id: "EB320312005", name: "不牢河排污口", type: "工业排污口", status: "normal", lat: 34.5, lng: 117.4, waterQuality: "II类", river: "不牢河", manager: "孙七", phone: "13500135000", updateTime: "2026-03-18 08:00",
    basin: "淮河流域", entryType: "明渠", flowType: "连续", gateType: "闸门", receivingWater: "不牢河", drainageChar: "工业废水", region: "铜山区", address: "工业园5号", grid: "网格E5", responsibleEntity: "某某制造厂", industryDept: "工信局", attachments: [], auditStatus: "rejected", cancelStatus: "active", qrCode: ""
  },
  { 
    id: "EB320312006", name: "大沙河排污口", type: "农业排口", status: "normal", lat: 34.6, lng: 117.5, waterQuality: "III类", river: "大沙河", manager: "周八", phone: "13400134000", updateTime: "2026-03-18 07:30",
    basin: "淮河流域", entryType: "明渠", flowType: "间歇", gateType: "泵站", receivingWater: "大沙河", drainageChar: "农田退水", region: "铜山区", address: "大沙河镇6号", grid: "网格F6", responsibleEntity: "大沙河镇政府", industryDept: "农业农村局", attachments: [], auditStatus: "approved", cancelStatus: "cancelled", qrCode: "qr-006"
  },
  { 
    id: "EB320312007", name: "丁万河排污口", type: "工业排污口", status: "normal", lat: 34.25, lng: 117.15, waterQuality: "II类", river: "丁万河", manager: "吴九", phone: "13300133000", updateTime: "2026-03-18 10:15",
    basin: "淮河流域", entryType: "暗管", flowType: "连续", gateType: "无", receivingWater: "丁万河", drainageChar: "工业废水", region: "铜山区", address: "开发区7号", grid: "网格G7", responsibleEntity: "某某科技公司", industryDept: "环保局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-007"
  },
  { 
    id: "EB320312008", name: "京杭运河排污口", type: "城镇污水处理厂排污口", status: "warning", lat: 34.35, lng: 117.25, waterQuality: "V类", river: "京杭运河", manager: "郑十", phone: "13200132000", updateTime: "2026-03-18 09:45",
    basin: "淮河流域", entryType: "明渠", flowType: "连续", gateType: "闸门", receivingWater: "京杭运河", drainageChar: "生活污水", region: "铜山区", address: "运河镇8号", grid: "网格H8", responsibleEntity: "运河污水处理厂", industryDept: "住建局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-008"
  },
  { 
    id: "EB320312009", name: "废黄河排污口", type: "农业排口", status: "normal", lat: 34.15, lng: 117.05, waterQuality: "III类", river: "废黄河", manager: "钱一", phone: "13100131000", updateTime: "2026-03-18 10:20",
    basin: "黄河流域", entryType: "明渠", flowType: "间歇", gateType: "泵站", receivingWater: "废黄河", drainageChar: "农田退水", region: "铜山区", address: "废黄河村9号", grid: "网格I9", responsibleEntity: "废黄河村委会", industryDept: "农业农村局", attachments: [], auditStatus: "pending", cancelStatus: "active", qrCode: ""
  },
  { 
    id: "EB320312010", name: "骆马湖排污口", type: "其他排口", status: "offline", lat: 34.45, lng: 117.35, waterQuality: "II类", river: "骆马湖", manager: "孙二", phone: "13000130000", updateTime: "2026-03-17 16:00",
    basin: "淮河流域", entryType: "暗管", flowType: "间歇", gateType: "无", receivingWater: "骆马湖", drainageChar: "混合污水", region: "铜山区", address: "骆马湖镇10号", grid: "网格J10", responsibleEntity: "骆马湖镇政府", industryDept: "环保局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-010"
  },
  { 
    id: "EB320312011", name: "新沂河排污口", type: "工业排污口", status: "normal", lat: 34.55, lng: 117.45, waterQuality: "III类", river: "新沂河", manager: "周三", phone: "18900189000", updateTime: "2026-03-18 08:30",
    basin: "淮河流域", entryType: "明渠", flowType: "连续", gateType: "闸门", receivingWater: "新沂河", drainageChar: "工业废水", region: "铜山区", address: "新沂河村11号", grid: "网格K11", responsibleEntity: "某某材料厂", industryDept: "工信局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-011"
  },
  { 
    id: "EB320312012", name: "沭河排污口", type: "农业排口", status: "maintenance", lat: 34.65, lng: 117.55, waterQuality: "IV类", river: "沭河", manager: "吴四", phone: "18800188000", updateTime: "2026-03-16 14:20",
    basin: "淮河流域", entryType: "明渠", flowType: "间歇", gateType: "泵站", receivingWater: "沭河", drainageChar: "农田退水", region: "铜山区", address: "沭河镇12号", grid: "网格L12", responsibleEntity: "沭河镇政府", industryDept: "农业农村局", attachments: [], auditStatus: "approved", cancelStatus: "cancelled", qrCode: "qr-012"
  },
];

export const mockMonitoringData = [
  { id: "EB320312001", name: "奎河张庄排污口", cod: 15.2, nh3n: 0.5, tp: 0.1, tn: 1.2, ph: 7.2, flow: 120, status: "正常", lastUpdate: "2026-03-18 10:30:00" },
  { id: "EB320312002", name: "房亭河大吴排污口", cod: 45.5, nh3n: 2.1, tp: 0.4, tn: 3.5, ph: 6.8, flow: 350, status: "故障", lastUpdate: "2026-03-18 10:30:00" },
  { id: "EB320312003", name: "故黄河汉王排污口", cod: null, nh3n: null, tp: null, tn: null, ph: null, flow: null, status: "断连", lastUpdate: "2026-03-17 15:00:00" },
  { id: "EB320312005", name: "不牢河排污口", cod: 12.1, nh3n: 0.3, tp: 0.05, tn: 0.8, ph: 7.5, flow: 80, status: "正常", lastUpdate: "2026-03-18 10:30:00" },
  { id: "EB320312007", name: "丁万河排污口", cod: 18.4, nh3n: 0.8, tp: 0.15, tn: 1.5, ph: 7.1, flow: 150, status: "补传中", lastUpdate: "2026-03-18 10:45:00" },
  { id: "EB320312008", name: "京杭运河排污口", cod: 55.2, nh3n: 3.5, tp: 0.6, tn: 4.2, ph: 6.5, flow: 420, status: "正常", lastUpdate: "2026-03-18 10:45:00" },
  { id: "EB320312009", name: "废黄河排污口", cod: 22.1, nh3n: 1.1, tp: 0.2, tn: 1.8, ph: 7.3, flow: 95, status: "正常", lastUpdate: "2026-03-18 10:50:00" },
  { id: "EB320312011", name: "新沂河排污口", cod: 14.5, nh3n: 0.4, tp: 0.08, tn: 1.0, ph: 7.6, flow: 110, status: "正常", lastUpdate: "2026-03-18 10:15:00" },
];

export const mockHistoricalData = [
  { time: "00:00", COD: 15, NH3N: 0.5, standardCOD: 40, standardNH3N: 2.0 },
  { time: "04:00", COD: 18, NH3N: 0.6, standardCOD: 40, standardNH3N: 2.0 },
  { time: "08:00", COD: 14, NH3N: 0.4, standardCOD: 40, standardNH3N: 2.0 },
  { time: "12:00", COD: 22, NH3N: 0.8, standardCOD: 40, standardNH3N: 2.0 },
  { time: "16:00", COD: 45, NH3N: 2.1, standardCOD: 40, standardNH3N: 2.0 }, // Exceeding
  { time: "20:00", COD: 20, NH3N: 0.7, standardCOD: 40, standardNH3N: 2.0 },
  { time: "24:00", COD: 16, NH3N: 0.5, standardCOD: 40, standardNH3N: 2.0 },
];

export const mockReports = [
  { id: "RPT2026031801", name: "铜山区排污口水质日报 (2026-03-17)", type: "日报", generateTime: "2026-03-18 00:05:00", status: "已生成" },
  { id: "RPT2026031601", name: "铜山区排污口水质周报 (第11周)", type: "周报", generateTime: "2026-03-16 00:10:00", status: "已生成" },
  { id: "RPT2026030101", name: "铜山区排污口水质月报 (2026年2月)", type: "月报", generateTime: "2026-03-01 00:15:00", status: "已生成" },
];

export const mockDevices = [
  { id: "DEV-WQ-001", outfallName: "奎河张庄排污口", model: "WQ-2000", installTime: "2024-05-10", status: "正常", onlineRate: "99.8%", integrityRate: "99.5%", lastCalibration: "2026-03-01" },
  { id: "DEV-WQ-002", outfallName: "房亭河大吴排污口", model: "WQ-2000", installTime: "2024-06-15", status: "故障", onlineRate: "98.5%", integrityRate: "98.0%", lastCalibration: "2026-02-15" },
  { id: "DEV-WQ-003", outfallName: "故黄河汉王排污口", model: "WQ-1500", installTime: "2023-10-20", status: "断连", onlineRate: "85.2%", integrityRate: "80.1%", lastCalibration: "2025-12-10" },
  { id: "DEV-WQ-004", outfallName: "微山湖沿岸排污口", model: "WQ-3000", installTime: "2025-01-05", status: "补传中", onlineRate: "95.0%", integrityRate: "92.5%", lastCalibration: "2026-01-20" },
  { id: "DEV-WQ-005", outfallName: "不牢河排污口", model: "WQ-2000", installTime: "2024-08-12", status: "正常", onlineRate: "90.5%", integrityRate: "88.0%", lastCalibration: "2026-02-28" },
];

export const mockMaintenanceTasks = [
  { id: "M20260318001", outfallName: "房亭河大吴排污口", type: "故障报修", device: "COD在线分析仪", status: "待处理", assignee: "王工", time: "2026-03-18 09:30:00" },
  { id: "M20260315002", outfallName: "奎河张庄排污口", type: "定期巡检", device: "全套监测设备", status: "已完成", assignee: "李工", time: "2026-03-15 14:00:00" },
  { id: "M20260310001", outfallName: "故黄河汉王排污口", type: "耗材更换", device: "氨氮在线分析仪", status: "处理中", assignee: "张工", time: "2026-03-10 10:00:00" },
  { id: "M20260318003", outfallName: "京杭运河排污口", type: "故障报修", device: "总磷在线分析仪", status: "待处理", assignee: "赵工", time: "2026-03-18 10:15:00" },
  { id: "M20260317004", outfallName: "骆马湖排污口", type: "定期巡检", device: "数据采集仪", status: "处理中", assignee: "钱工", time: "2026-03-17 08:30:00" },
  { id: "M20260316005", outfallName: "沭河排污口", type: "耗材更换", device: "pH计", status: "已完成", assignee: "孙工", time: "2026-03-16 16:45:00" },
  { id: "M20260318006", outfallName: "微山湖沿岸排污口", type: "故障报修", device: "流量计", status: "待处理", assignee: "周工", time: "2026-03-18 11:00:00" },
];
export const mockDetailedTrend = [
  { time: "00:00", cod: 14, nh3n: 0.4 },
  { time: "04:00", cod: 15, nh3n: 0.5 },
  { time: "08:00", cod: 18, nh3n: 0.6 },
  { time: "12:00", cod: 16, nh3n: 0.5 },
  { time: "16:00", cod: 20, nh3n: 0.7 },
  { time: "20:00", cod: 15, nh3n: 0.4 },
];

export const mockWarnings = [
  { id: "W20260318001", outfallName: "房亭河大吴排污口", type: "水质超标预警", level: 1, time: "2026-03-18 10:23:00", status: "待处理", desc: "COD超标2.5倍" },
  { id: "W20260318002", outfallName: "故黄河汉王排污口", type: "设备故障预警", level: 2, time: "2026-03-18 09:15:00", status: "处理中", desc: "设备离线超6小时" },
  { id: "W20260317001", outfallName: "奎河张庄排污口", type: "水质超标预警", level: 3, time: "2026-03-17 14:30:00", status: "已完成", desc: "氨氮超标0.5倍" },
  { id: "W20260318003", outfallName: "京杭运河排污口", type: "水质超标预警", level: 1, time: "2026-03-18 10:45:00", status: "待处理", desc: "总磷超标3.0倍" },
  { id: "W20260318004", outfallName: "骆马湖排污口", type: "设备故障预警", level: 2, time: "2026-03-18 08:20:00", status: "待处理", desc: "数据采集仪通信中断" },
  { id: "W20260316002", outfallName: "沭河排污口", type: "水质超标预警", level: 3, time: "2026-03-16 11:10:00", status: "已完成", desc: "pH值异常" },
  { id: "W20260318005", outfallName: "微山湖沿岸排污口", type: "设备故障预警", level: 2, time: "2026-03-18 11:05:00", status: "处理中", desc: "流量计数据异常" },
];

export const mockTrendData = [
  { date: "03-12", COD: 15, NH3N: 0.5 },
  { date: "03-13", COD: 18, NH3N: 0.6 },
  { date: "03-14", COD: 14, NH3N: 0.4 },
  { date: "03-15", COD: 22, NH3N: 0.8 },
  { date: "03-16", COD: 45, NH3N: 2.1 }, // Spike
  { date: "03-17", COD: 20, NH3N: 0.7 },
  { date: "03-18", COD: 16, NH3N: 0.5 },
];

export const mockInspections = [
  { id: "INSP2026031801", outfallId: "EB320312001", outfallName: "奎河张庄排污口", time: "2026-03-18 09:00", method: "现场人工排查", inspector: "王建国", hasSewage: "是", status: "异常", description: "发现有明显工业废水排出，伴有异味。", region: "铜山区" },
  { id: "INSP2026031702", outfallId: "EB320312002", outfallName: "房亭河大吴排污口", time: "2026-03-17 14:30", method: "无人机巡查", inspector: "李志强", hasSewage: "否", status: "正常", description: "未见异常排放，排口周边环境良好。", region: "铜山区" },
];

export const mockTraceability = [
  { id: "TR2026031801", outfallId: "EB320312001", outfallName: "奎河张庄排污口", polluter: "某某化工厂", channelType: "暗管直排", pollutants: "COD, 氨氮", time: "2026-03-18 11:00", auditStatus: "approved" },
  { id: "TR2026031602", outfallId: "EB320312008", outfallName: "京杭运河排污口", polluter: "运河周边餐饮街", channelType: "雨污混接", pollutants: "总磷, 动植物油", time: "2026-03-16 10:00", auditStatus: "pending" },
];

export const mockRemediations = [
  { id: "REM2026031001", outfallId: "EB320312001", outfallName: "奎河张庄排污口", goal: "消除劣V类水体排放", entity: "某某化工厂", person: "张三", deadline: "2026-06-30", progressStatus: "整治中" },
  { id: "REM2026021502", outfallId: "EB320312008", outfallName: "京杭运河排污口", goal: "雨污分流改造", entity: "运河镇政府", person: "郑十", deadline: "2026-05-01", progressStatus: "未整治" },
  { id: "REM2025110103", outfallId: "EB320312012", outfallName: "沭河排污口", goal: "封堵非法排污口", entity: "沭河镇政府", person: "吴四", deadline: "2025-12-31", progressStatus: "已销号" },
];

export const mockSignboards = [
  { id: "SB-EB320312001", outfallId: "EB320312001", outfallName: "奎河张庄排污口", type: "工业排污口", spec: "1200mm*800mm", installStatus: "已安装", region: "铜山区", installTime: "2025-05-10" },
  { id: "SB-EB320312002", outfallId: "EB320312002", outfallName: "房亭河大吴排污口", type: "城镇污水处理厂排污口", spec: "1200mm*800mm", installStatus: "已安装", region: "铜山区", installTime: "2025-06-15" },
  { id: "SB-EB320312003", outfallId: "EB320312003", outfallName: "故黄河汉王排污口", type: "农业排口", spec: "800mm*600mm", installStatus: "待安装", region: "铜山区", installTime: "-" },
];

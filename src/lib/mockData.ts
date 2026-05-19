export const mockStats = {
  totalOutfalls: 13,
  completedRectification: 1, // Matches '已销号' in mockRemediations
  onlineMonitoring: 8, // Matches items in mockMonitoringData
  waterQualityCompliance: 75.0,
  licensedOutfalls: 11,
  todayDischarge: 12.8,
  monthDischarge: 385,
  dischargeChange: -2.4,
  waterQualityPassRate: 75.0, // 9 pass out of 12 valid
  todayExceed: 0,
  monthExceed: 2,
  sectionPassRate: 66.7, // 2 pass out of 3
  totalSections: 3,
  excellentWaterRate: 66.7,
  archiveCompletionRate: 100,
  licenseRequirementRate: 84.6, // 11 / 13
  processingTimelinessRate: 60.0, // 6 processed or processing out of 10 warnings
  alarmResolutionRate: 30.0, // 3 completed out of 10 warnings
  totalWarnings: 10,
  unhandledWarnings: 4, // 4 待处理 in mockWarnings
  flowToday: 12450,
  averageCOD: 15.2,
  deviceOnlineRate: 83.3
};

export const mockDistribution = {
  industrial: { count: 4, percent: 30.8 }, // 4 工业排污口
  agricultural: { count: 4, percent: 30.8 }, // 4 农业排口
  urbanOther: { count: 5, percent: 38.4 }, // 2 城镇 + 3 其他
};

export const mockSections = [
  { id: "S1", name: '奎河断面', grade: 'Ⅲ类', status: '达标', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  { id: "S2", name: '房亭河断面', grade: 'Ⅳ类', status: '超标', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  { id: "S3", name: '故黄河断面', grade: 'Ⅱ类', status: '达标', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
];

export const mockOutfalls = [
  { 
    id: "EB320312001", name: "奎河张庄排污口", type: "工业排污口", status: "normal", lat: 34.285, lng: 117.162, waterQuality: "II类", river: "奎河", manager: "张三", phone: "13800138000", updateTime: "2026-03-18 10:00",
    basin: "淮河流域", entryType: "明渠", flowType: "连续", gateType: "闸门", receivingWater: "奎河", drainageChar: "工业废水", region: "铜山区", address: "张庄村1号", grid: "网格A1", responsibleEntity: "某某化工厂", industryDept: "环保局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-001"
  },
  { 
    id: "EB320312002", name: "房亭河大吴排污口", type: "城镇污水处理厂排污口", status: "warning", lat: 34.221, lng: 117.215, waterQuality: "IV类", river: "房亭河", manager: "李四", phone: "13900139000", updateTime: "2026-03-18 09:30",
    basin: "淮河流域", entryType: "暗管", flowType: "间歇", gateType: "无", receivingWater: "房亭河", drainageChar: "生活污水", region: "铜山区", address: "大吴镇2号", grid: "网格B2", responsibleEntity: "大吴污水处理厂", industryDept: "住建局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-002"
  },
  { 
    id: "EB320312003", name: "故黄河汉王排污口", type: "农业排口", status: "offline", lat: 34.298, lng: 117.105, waterQuality: "III类", river: "故黄河", manager: "王五", phone: "13700137000", updateTime: "2026-03-17 15:00",
    basin: "黄河流域", entryType: "明渠", flowType: "间歇", gateType: "泵站", receivingWater: "故黄河", drainageChar: "农田退水", region: "铜山区", address: "汉王镇3号", grid: "网格C3", responsibleEntity: "汉王镇政府", industryDept: "农业农村局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-003"
  },
  { 
    id: "EB320312004", name: "微山湖沿岸排污口", type: "其他排口", status: "maintenance", lat: 34.341, lng: 117.202, waterQuality: "III类", river: "微山湖", manager: "赵六", phone: "13600136000", updateTime: "2026-03-16 11:20",
    basin: "南四湖流域", entryType: "暗管", flowType: "连续", gateType: "无", receivingWater: "微山湖", drainageChar: "混合污水", region: "铜山区", address: "沿湖村4号", grid: "网格D4", responsibleEntity: "沿湖村委会", industryDept: "环保局", attachments: [], auditStatus: "pending", cancelStatus: "active", qrCode: ""
  },
  { 
    id: "EB320312005", name: "不牢河排污口", type: "工业排污口", status: "normal", lat: 34.254, lng: 117.288, waterQuality: "II类", river: "不牢河", manager: "孙七", phone: "13500135000", updateTime: "2026-03-18 08:00",
    basin: "淮河流域", entryType: "明渠", flowType: "连续", gateType: "闸门", receivingWater: "不牢河", drainageChar: "工业废水", region: "铜山区", address: "工业园5号", grid: "网格E5", responsibleEntity: "某某制造厂", industryDept: "工信局", attachments: [], auditStatus: "rejected", cancelStatus: "active", qrCode: ""
  },
  { 
    id: "EB320312006", name: "茅村镇废弃排口", type: "其他排口", status: "offline", lat: 34.312, lng: 117.189, waterQuality: "-", river: "彭祖河", manager: "钱八", phone: "13400134000", updateTime: "2026-02-15 09:00",
    basin: "淮河流域", entryType: "暗管", flowType: "间歇", gateType: "无", receivingWater: "彭祖河", drainageChar: "未知", region: "铜山区", address: "茅村镇", grid: "网格F6", responsibleEntity: "未知", industryDept: "环保局", attachments: [], auditStatus: "approved", cancelStatus: "cancelled", qrCode: ""
  },
  { 
    id: "EB320312013", name: "大沙河排污口", type: "农业排口", status: "normal", lat: 34.195, lng: 117.135, waterQuality: "III类", river: "大沙河", manager: "周八", phone: "13400134000", updateTime: "2026-03-18 07:30",
    basin: "淮河流域", entryType: "明渠", flowType: "间歇", gateType: "泵站", receivingWater: "大沙河", drainageChar: "农田退水", region: "铜山区", address: "大沙河镇6号", grid: "网格F6", responsibleEntity: "大沙河镇政府", industryDept: "农业农村局", attachments: [], auditStatus: "approved", cancelStatus: "cancelled", qrCode: "qr-006"
  },
  { 
    id: "EB320312007", name: "丁万河排污口", type: "工业排污口", status: "normal", lat: 34.272, lng: 117.245, waterQuality: "II类", river: "丁万河", manager: "吴九", phone: "13300133000", updateTime: "2026-03-18 10:15",
    basin: "淮河流域", entryType: "暗管", flowType: "连续", gateType: "无", receivingWater: "丁万河", drainageChar: "工业废水", region: "铜山区", address: "开发区7号", grid: "网格G7", responsibleEntity: "某某科技公司", industryDept: "环保局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-007"
  },
  { 
    id: "EB320312008", name: "京杭运河排污口", type: "城镇污水处理厂排污口", status: "warning", lat: 34.188, lng: 117.262, waterQuality: "V类", river: "京杭运河", manager: "郑十", phone: "13200132000", updateTime: "2026-03-18 09:45",
    basin: "淮河流域", entryType: "明渠", flowType: "连续", gateType: "闸门", receivingWater: "京杭运河", drainageChar: "生活污水", region: "铜山区", address: "运河镇8号", grid: "网格H8", responsibleEntity: "运河污水处理厂", industryDept: "住建局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-008"
  },
  { 
    id: "EB320312009", name: "废黄河排污口", type: "农业排口", status: "normal", lat: 34.241, lng: 117.085, waterQuality: "III类", river: "废黄河", manager: "钱一", phone: "13100131000", updateTime: "2026-03-18 10:20",
    basin: "黄河流域", entryType: "明渠", flowType: "间歇", gateType: "泵站", receivingWater: "废黄河", drainageChar: "农田退水", region: "铜山区", address: "废黄河村9号", grid: "网格I9", responsibleEntity: "废黄河村委会", industryDept: "农业农村局", attachments: [], auditStatus: "pending", cancelStatus: "active", qrCode: ""
  },
  { 
    id: "EB320312010", name: "骆马湖排污口", type: "其他排口", status: "offline", lat: 34.312, lng: 117.305, waterQuality: "II类", river: "骆马湖", manager: "孙二", phone: "13000130000", updateTime: "2026-03-17 16:00",
    basin: "淮河流域", entryType: "暗管", flowType: "间歇", gateType: "无", receivingWater: "骆马湖", drainageChar: "混合污水", region: "铜山区", address: "骆马湖镇10号", grid: "网格J10", responsibleEntity: "骆马湖镇政府", industryDept: "环保局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-010"
  },
  { 
    id: "EB320312011", name: "新沂河排污口", type: "工业排污口", status: "normal", lat: 34.215, lng: 117.181, waterQuality: "III类", river: "新沂河", manager: "周三", phone: "18900189000", updateTime: "2026-03-18 08:30",
    basin: "淮河流域", entryType: "明渠", flowType: "连续", gateType: "闸门", receivingWater: "新沂河", drainageChar: "工业废水", region: "铜山区", address: "新沂河村11号", grid: "网格K11", responsibleEntity: "某某材料厂", industryDept: "工信局", attachments: [], auditStatus: "approved", cancelStatus: "active", qrCode: "qr-011"
  },
  { 
    id: "EB320312012", name: "沭河排污口", type: "农业排口", status: "maintenance", lat: 34.321, lng: 117.145, waterQuality: "IV类", river: "沭河", manager: "吴四", phone: "18800188000", updateTime: "2026-03-16 14:20",
    basin: "淮河流域", entryType: "明渠", flowType: "间歇", gateType: "泵站", receivingWater: "沭河", drainageChar: "农田退水", region: "铜山区", address: "沭河镇12号", grid: "网格L12", responsibleEntity: "沭河镇政府", industryDept: "农业农村局", attachments: [], auditStatus: "approved", cancelStatus: "cancelled", qrCode: "qr-012"
  },
];

export const mockMonitoringData = [
  { 
    id: "EB320312001", name: "奎河张庄排污口", cod: 15.2, nh3n: 0.5, tp: 0.1, tn: 1.2, ph: 7.2, conductivity: 450, do: 6.5, turbidity: 12, temp: 18.5, instFlow: 120, cumFlow: 25400, hasVideo: true, status: "正常", lastUpdate: "2026-03-18 10:30:00",
    devices: [
      { name: "水质微型站 WQ-2000", type: "水质", status: "正常" },
      { name: "明渠非接触流量计", type: "流量", status: "正常" },
      { name: "排口全景带AI云台", type: "视频", status: "正常" }
    ]
  },
  { 
    id: "EB320312002", name: "房亭河大吴排污口", cod: 45.5, nh3n: 2.1, tp: 0.4, tn: 3.5, ph: 6.8, conductivity: 600, do: 3.2, turbidity: 45, temp: 19.1, instFlow: 350, cumFlow: 45200, hasVideo: true, status: "故障", lastUpdate: "2026-03-18 10:30:00",
    devices: [
      { name: "水质自动分析仪", type: "水质", status: "故障" },
      { name: "超声波流量计", type: "流量", status: "正常" },
      { name: "固定式摄像头", type: "视频", status: "正常" }
    ]
  },
  { 
    id: "EB320312003", name: "故黄河汉王排污口", cod: null, nh3n: null, tp: null, tn: null, ph: null, conductivity: null, do: null, turbidity: null, temp: null, instFlow: null, cumFlow: null, hasVideo: false, status: "断连", lastUpdate: "2026-03-17 15:00:00",
    devices: [
      { name: "简易水质监测浮标", type: "水质", status: "断连" }
    ]
  },
  { 
    id: "EB320312005", name: "不牢河排污口", cod: 12.1, nh3n: 0.3, tp: 0.05, tn: 0.8, ph: 7.5, conductivity: 320, do: 7.1, turbidity: 8, temp: 18.0, instFlow: 80, cumFlow: 12500, hasVideo: true, status: "正常", lastUpdate: "2026-03-18 10:30:00",
    devices: [
      { name: "多参数水质变送器", type: "水质", status: "正常" },
      { name: "排口高清球机", type: "视频", status: "正常" }
    ]
  },
  { 
    id: "EB320312007", name: "丁万河排污口", cod: 18.4, nh3n: 0.8, tp: 0.15, tn: 1.5, ph: 7.1, conductivity: 410, do: 6.8, turbidity: 15, temp: 18.2, instFlow: 150, cumFlow: 31000, hasVideo: true, status: "正常", lastUpdate: "2026-03-18 10:45:00",
    devices: [
      { name: "一体化监测机柜", type: "水质", status: "正常" },
      { name: "雷达流量计", type: "流量", status: "正常" }
    ]
  },
  { 
    id: "EB320312008", name: "京杭运河排污口", cod: 55.2, nh3n: 3.5, tp: 0.6, tn: 4.2, ph: 6.5, conductivity: 850, do: 2.5, turbidity: 60, temp: 19.5, instFlow: 420, cumFlow: 85000, hasVideo: false, status: "正常", lastUpdate: "2026-03-18 10:45:00",
    devices: [
      { name: "污水厂总排口水质站", type: "水质", status: "正常" },
      { name: "巴歇尔槽流量计", type: "流量", status: "正常" }
    ]
  },
  { 
    id: "EB320312009", name: "废黄河排污口", cod: 22.1, nh3n: 1.1, tp: 0.2, tn: 1.8, ph: 7.3, conductivity: 480, do: 5.8, turbidity: 18, temp: 18.6, instFlow: 95, cumFlow: 19800, hasVideo: true, status: "正常", lastUpdate: "2026-03-18 10:50:00",
    devices: [
      { name: "常规五参数分析仪", type: "水质", status: "正常" },
      { name: "低照度监控摄像头", type: "视频", status: "正常" }
    ]
  },
  { 
    id: "EB320312011", name: "新沂河排污口", cod: 14.5, nh3n: 0.4, tp: 0.08, tn: 1.0, ph: 7.6, conductivity: 350, do: 7.5, turbidity: 10, temp: 17.8, instFlow: 110, cumFlow: 22000, hasVideo: true, status: "正常", lastUpdate: "2026-03-18 10:15:00",
    devices: [
      { name: "水质自动监测仪", type: "水质", status: "正常" },
      { name: "电磁流量计", type: "流量", status: "正常" },
      { name: "星光级网络摄像机", type: "视频", status: "正常" }
    ]
  },
  ...Array.from({ length: 28 }).map((_, i) => {
    const isOffline = Math.random() < 0.1;
    const isWarning = Math.random() < 0.15 && !isOffline;
    const hasVideo = Math.random() > 0.3;
    
    // Generate devices list
    const devices = [
      { name: `水质类监测仪 - DB${i}`, type: "水质", status: isOffline ? "断连" : isWarning ? "故障" : "正常" },
      { name: `流量监测仪 - FL${i}`, type: "流量", status: isOffline ? "断连" : "正常" }
    ];
    if (hasVideo) {
      devices.push({ name: `监控球机 - CA${i}`, type: "视频", status: isOffline ? "断连" : "正常" });
    }

    return {
      id: `EB3203121${String(i).padStart(2, '0')}`,
      name: `新增自动监测点位-${i+1}`,
      cod: isOffline ? null : Number((Math.random() * (isWarning ? 30 : 20) + 10).toFixed(1)),
      nh3n: isOffline ? null : Number((Math.random() * (isWarning ? 3 : 1) + 0.1).toFixed(2)),
      tp: isOffline ? null : Number((Math.random() * (isWarning ? 0.6 : 0.2) + 0.02).toFixed(2)),
      tn: isOffline ? null : Number((Math.random() * (isWarning ? 4 : 2) + 0.5).toFixed(2)),
      ph: isOffline ? null : Number((Math.random() * 2 + 6.5).toFixed(1)),
      conductivity: isOffline ? null : Math.floor(Math.random() * 500 + 300),
      do: isOffline ? null : Number((Math.random() * 4 + 4).toFixed(1)),
      turbidity: isOffline ? null : Math.floor(Math.random() * 30 + 5),
      temp: isOffline ? null : Number((Math.random() * 5 + 15).toFixed(1)),
      instFlow: isOffline ? null : Math.floor(Math.random() * 500 + 50),
      cumFlow: isOffline ? null : Math.floor(Math.random() * 100000 + 10000),
      hasVideo: hasVideo,
      status: isOffline ? "断连" : isWarning ? "故障" : "正常",
      lastUpdate: "2026-03-18 11:30:00",
      devices
    };
  })
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
  { id: "RPT2026010101", name: "铜山区排污口水质年报 (2025年度)", type: "年报", generateTime: "2026-01-01 10:00:00", status: "已生成" },
];

export const mockDevices = [
  { id: "DEV-WQ-001", outfallName: "奎河张庄排污口", model: "WQ-2000", installTime: "2024-05-10", status: "正常", onlineRate: "99.8%", integrityRate: "99.5%", lastCalibration: "2026-03-01" },
  { id: "DEV-WQ-002", outfallName: "房亭河大吴排污口", model: "WQ-2000", installTime: "2024-06-15", status: "故障", onlineRate: "98.5%", integrityRate: "98.0%", lastCalibration: "2026-02-15" },
  { id: "DEV-WQ-003", outfallName: "故黄河汉王排污口", model: "WQ-1500", installTime: "2023-10-20", status: "断连", onlineRate: "85.2%", integrityRate: "80.1%", lastCalibration: "2025-12-10" },
  { id: "DEV-WQ-005", outfallName: "不牢河排污口", model: "WQ-2000", installTime: "2024-08-12", status: "正常", onlineRate: "90.5%", integrityRate: "88.0%", lastCalibration: "2026-02-28" },
  { id: "DEV-WQ-007", outfallName: "丁万河排污口", model: "WQ-3000", installTime: "2025-01-05", status: "正常", onlineRate: "95.0%", integrityRate: "92.5%", lastCalibration: "2026-01-20" },
  { id: "DEV-WQ-008", outfallName: "京杭运河排污口", model: "WQ-2000", installTime: "2024-11-12", status: "正常", onlineRate: "99.1%", integrityRate: "98.5%", lastCalibration: "2026-03-10" },
  { id: "DEV-WQ-009", outfallName: "废黄河排污口", model: "WQ-1500", installTime: "2023-12-05", status: "正常", onlineRate: "88.5%", integrityRate: "85.0%", lastCalibration: "2026-01-15" },
  { id: "DEV-WQ-011", outfallName: "新沂河排污口", model: "WQ-2000", installTime: "2025-06-20", status: "正常", onlineRate: "96.4%", integrityRate: "95.2%", lastCalibration: "2026-02-10" },
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
  { id: "W20260318001", outfallId: "EB320312002", outfallName: "房亭河大吴排污口", type: "水质超标预警", level: 1, time: "2026-03-18 10:23:00", status: "待处理", desc: "COD超标2.5倍" },
  { id: "W20260318011", outfallId: "EB320312002", outfallName: "房亭河大吴排污口", type: "水质超标预警", level: 1, time: "2026-03-10 06:10:00", status: "待处理", desc: "COD超标1.5倍(超期未处置)" }, // explicitly make it older for overdue
  { id: "W20260317005", outfallId: "EB320312002", outfallName: "房亭河大吴排污口", type: "水质超标预警", level: 1, time: "2026-03-17 22:45:00", status: "处理中", desc: "COD超标1.8倍" },
  { id: "W20260318002", outfallId: "EB320312003", outfallName: "故黄河汉王排污口", type: "设备故障预警", level: 2, time: "2026-03-18 09:15:00", status: "已驳回", desc: "设备离线超6小时" },
  { id: "W20260317001", outfallId: "EB320312001", outfallName: "奎河张庄排污口", type: "水质超标预警", level: 3, time: "2026-03-17 14:30:00", status: "已完成", desc: "氨氮超标0.5倍", details: { measures: "现场排查确认管网溢流，联系了养护单位进行疏通", result: "管网已疏通，水质恢复正常", handler: "李思", handleTime: "2026-03-17 18:30:00" } },
  { id: "W20260318003", outfallId: "EB320312008", outfallName: "京杭运河排污口", type: "水质超标预警", level: 1, time: "2026-03-18 10:45:00", status: "待处理", desc: "总磷超标3.0倍" },
  { id: "W20260317006", outfallId: "EB320312008", outfallName: "京杭运河排污口", type: "水质超标预警", level: 2, time: "2026-03-17 08:30:00", status: "已完成", desc: "总磷超标1.2倍", details: { measures: "增加了除磷药剂投加量", result: "出水总磷达标", handler: "张三", handleTime: "2026-03-17 12:00:00" } },
  { id: "W20260318004", outfallId: "EB320312010", outfallName: "骆马湖排污口", type: "设备故障预警", level: 2, time: "2026-03-18 08:20:00", status: "待审核", desc: "数据采集仪通信中断", details: { measures: "重启数据采集仪，更换通讯卡", result: "通讯恢复正常，数据上传成功", handler: "周五", handleTime: "2026-03-18 10:00:00" } },
  { id: "W20260316002", outfallId: "EB320312012", outfallName: "沭河排污口", type: "水质超标预警", level: 3, time: "2026-03-16 11:10:00", status: "已完成", desc: "pH值异常" },
  { id: "W20260318005", outfallId: "EB320312004", outfallName: "微山湖沿岸排污口", type: "设备故障预警", level: 2, time: "2026-03-18 11:05:00", status: "处理中", desc: "流量计数据异常" },
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
  { id: "REM2026021502", outfallId: "EB320312008", outfallName: "京杭运河排污口", goal: "雨污分流改造", entity: "运河镇政府", person: "郑十", deadline: "2026-05-01", progressStatus: "已完成" },
  { id: "REM2025110103", outfallId: "EB320312012", outfallName: "沭河排污口", goal: "封堵非法排污口", entity: "沭河镇政府", person: "吴四", deadline: "2025-12-31", progressStatus: "已销号" },
  { id: "REM2025121004", outfallId: "EB320312004", outfallName: "微山湖沿岸排污口", goal: "规范化排污口建设", entity: "沿湖村委会", person: "赵六", deadline: "2026-08-15", progressStatus: "待整治" },
];

export const mockSignboards = [
  { id: "SB-EB320312001", code: "SB-001", outfallId: "EB320312001", outfallName: "奎河张庄排污口", type: "工业排污口", spec: "1200mm*800mm", manufacturer: "徐州环宇标识智造有限公司", manufacturingDate: "2025-04-20", installStatus: "已安装", region: "铜山区", installTime: "2025-05-10", installLocation: "排污口岸边东侧醒目位置", installer: "张三", photoUrl: "https://images.unsplash.com/photo-1584984647265-ceadcffaeb8a?w=400&q=80", maintenanceRecords: [{ maintenanceTime: "2025-10-15", content: "擦拭表面污泥，加固立柱", maintainer: "李四" }, { maintenanceTime: "2026-03-01", content: "重新喷涂褪色字迹", maintainer: "王五" }] },
  { id: "SB-EB320312002", code: "SB-002", outfallId: "EB320312002", outfallName: "房亭河大吴排污口", type: "城镇污水处理厂排污口", spec: "1200mm*800mm", manufacturer: "徐州环宇标识智造有限公司", manufacturingDate: "2025-05-20", installStatus: "已安装", region: "铜山区", installTime: "2025-06-15", installLocation: "处理厂排放口大门右侧", installer: "赵六", photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80", maintenanceRecords: [{ maintenanceTime: "2025-12-05", content: "除草清障，保障视线清晰", maintainer: "宋七" }] },
  { id: "SB-EB320312003", code: "SB-003", outfallId: "EB320312003", outfallName: "故黄河汉王排污口", type: "农业排口", spec: "800mm*600mm", manufacturer: "诚辉五金标识厂", manufacturingDate: "2025-08-01", installStatus: "待安装", region: "铜山区", installTime: "-", installLocation: "-", installer: "-", photoUrl: "", maintenanceRecords: [] },
  { id: "SB-EB320312004", code: "SB-004", outfallId: "EB320312004", outfallName: "微山湖沿岸排污口", type: "其他排口", spec: "800mm*600mm", manufacturer: "诚辉五金标识厂", manufacturingDate: "2025-08-10", installStatus: "已安装", region: "沛县", installTime: "2025-09-05", installLocation: "湖漫大堤内侧", installer: "钱八", photoUrl: "https://images.unsplash.com/photo-1621451537084-482c73073e0f?w=400&q=80", maintenanceRecords: [] },
  { id: "SB-EB320312005", code: "SB-005", outfallId: "EB320312005", outfallName: "不牢河排污口", type: "工业排污口", spec: "1200mm*800mm", manufacturer: "徐州环宇标识智造有限公司", manufacturingDate: "2025-10-15", installStatus: "已安装", region: "邳州市", installTime: "2025-11-20", installLocation: "工厂排水渠出口处", installer: "张三", photoUrl: "https://images.unsplash.com/photo-1508344928928-7137b2f6f571?w=400&q=80", maintenanceRecords: [{ maintenanceTime: "2026-04-10", content: "更换破损反光膜", maintainer: "周二" }] },
];

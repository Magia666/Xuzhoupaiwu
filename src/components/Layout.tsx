import { NavLink, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { 
  LayoutDashboard, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  Settings,
  Bell,
  User,
  LogOut,
  MonitorPlay,
  FileCheck,
  SearchCode,
  AlertOctagon,
  Signpost,
  BarChart3,
  Server,
  ChevronDown,
  Info,
  TerminalSquare
} from "lucide-react";
import { cn } from "../lib/utils";
import Modal from "./Modal";

import AIAssistant from "./AIAssistant";

const roleFeatures: Record<string, string[]> = {
  SystemAdmin: ["/", "/outfalls", "/inspection", "/traceability", "/remediation", "/signboard", "/monitoring", "/devices", "/warnings", "/maintenance", "/analysis", "/system"],
  DataEntry: ["/", "/outfalls", "/inspection", "/traceability", "/signboard"],
  MonitoringAnalyst: ["/", "/outfalls", "/traceability", "/monitoring", "/devices", "/warnings", "/analysis"],
  RemediationAdmin: ["/", "/outfalls", "/remediation", "/warnings", "/analysis"],
  Supervisor: ["/", "/outfalls", "/inspection", "/remediation", "/monitoring", "/devices", "/warnings"],
  Maintenance: ["/", "/outfalls", "/signboard", "/monitoring", "/devices", "/maintenance"],
};

const mockUsers = [
  { id: '1', name: "张三", role: "SystemAdmin", roleName: "系统管理员", username: "admin" },
  { id: '2', name: "李四", role: "DataEntry", roleName: "数据录入员", username: "data1" },
  { id: '3', name: "王五", role: "MonitoringAnalyst", roleName: "监测分析员", username: "monitor1" },
  { id: '4', name: "赵六", role: "RemediationAdmin", roleName: "整治管理员", username: "remedy1" },
  { id: '5', name: "孙七", role: "Supervisor", roleName: "河长/监管人员", username: "super1" },
  { id: '6', name: "周八", role: "Maintenance", roleName: "运维人员", username: "maint1" }
];

const allNavItems = [
  { name: "首页", path: "/", icon: LayoutDashboard },
  { name: "一口一档", path: "/outfalls", icon: MapPin },
  { name: "排查记录", path: "/inspection", icon: FileCheck },
  { name: "溯源信息", path: "/traceability", icon: SearchCode },
  { name: "整治管理", path: "/remediation", icon: AlertOctagon },
  { name: "标识牌管理", path: "/signboard", icon: Signpost },
  { name: "在线监测", path: "/monitoring", icon: Activity },
  { name: "设备管理", path: "/devices", icon: Server },
  { name: "事件中心", path: "/warnings", icon: AlertTriangle },
  { name: "运维管理", path: "/maintenance", icon: Wrench },
  { name: "数据分析", path: "/analysis", icon: BarChart3 },
  { name: "系统管理", path: "/system", icon: Settings },
];

const devDocs: Record<string, { title: string, content: string[] }> = {
  "/": {
    title: "首页大屏视图",
    content: [
      "1. 【核心闭环流程】：排查发现问题 -> 立案登记 -> 关联溯源 -> 制定\"一口一策\" -> 整治施工 -> 验收销号 -> 监测复查。",
      "2. 【各业务卡片数据来源与计算】：",
      "   - 顶栏-排口总数：读取「排口台账」(/outfalls) 模块中状态为非“已注销/删除”的总记录数。",
      "   - 顶栏-在线监测点位/达标率：读取「在线监测」(/monitoring) 模块中设备状态为“在线”的排口数量；达标率 = (最新检测值<达标阈值的正常设备数) / 在线设备总数 * 100%。",
      "   - 顶栏-预警总数/未处置：读取「事件中心」(/warnings) 模块总告警数与状态为“待处置”的告警数。",
      "   - 近30天水文与告警趋势图：关联查询「在线监测」(/monitoring) 的历史数据聚合及「事件中心」(/warnings) 的每天新增告警打点。",
      "   - 水质总貌分类：聚合「排口台账」与「在线监测」数据，按国标水质（一至五类/劣五类）分组占比计算。",
      "   - 排口类型占比统计：聚合「排口台账」(/outfalls) 中的“排口类型”（工业/农业/生活等）字段并算比重。",
      "   - 各片区预警排名：聚合「平台台账」的归属行政区与「事件中心」的告警关联度，按区域聚合Count并降序排列。",
      "   - 整治工作推进进度：读取「整治管理」(/remediation) 模块中的各项目阶段（如摸排、方案、施工、销号）进行漏斗或进度环比计算。",
      "   - GIS地图：通过 /outfalls 提取所有审核通过排口的经纬度，并在地图组件（如百度/高德/Cesium）上打多边形/点位标记，告警与异常设备点位标红。"
    ]
  },
  "/outfalls": {
    title: "排口台账（一口一档）",
    content: [
      "1. 【数据来源/入口】：系统内各排口的基础信息字典。支持单条表单人工录入，或通过标准Excel模板解析并批量导入。",
      "2. 【关联与流向】：作为系统的「Master Data / 核心基石」。排口的ID（outfallId）会被 /inspection (排查)、/remediation (整治)、/monitoring (监测) 等所有业务模块作为外键引用。",
      "3. 【状态计算与鉴权】：",
      "   - 状态流转：通过人员提交，状态由 Draft(草稿) -> Pending(待审核) -> Approved(已审核生效)。只有 Approved 状态的排口才会在此模块公开并进入GIS渲染。",
      "   - 只有「系统管理员」与「数据录入员」拥有修改权限；「整治管理员」负责审核审批。",
      "4. 【模块详情页计算】：点击“查看详情”，系统会基于排口ID并发向各模块接口（巡查记录表、在线监测流水表、治理项目表）查询，并在前端组装成「一口一档」综合视图。"
    ]
  },
  "/inspection": {
    title: "日常排查管理",
    content: [
      "1. 【数据来源】：河长或下沉网格员通过移动端（App/微信小程序）现场GPS定位打卡、拍照并填报上传的巡查表单。前端直接读取数据库排查表 (Inspection) 数据。",
      "2. 【关键字段与组装】：需关联对应排口的ID，并包含发现类型（如：污水直排、水体黑臭等）、文字描述及现场图集（云存储OSS URL）。",
      "3. 【闭环流转计算】：",
      "   - 正常巡查：直接归档，增加该排口的“累计巡查次数”。",
      "   - 异常巡查：触发联动事件，通过回调函数在事件中心 (/warnings) 自动生成一条来源为“人工巡查”的预警信息；并可一键转交至 /traceability (溯源模块) 成立专项。"
    ]
  },
  "/traceability": {
    title: "排口溯源管理",
    content: [
      "1. 【数据来源/触发】：通常由 /inspection (排查发现问题) 或 /monitoring (在线监测连续超标) 触发后，在此模块创建关联溯源任务单据。",
      "2. 【数据计算与存储】：",
      "   - 存储结构：记录上游管网走向图、CCTV管道机器人检测视频链接、可疑排污企业调查笔录或取证材料。",
      "   - 关联关系：支持一对多关联，即一个排口问题可能对应查出多个溯源源头（如管网破损点+上游某化工厂偷排）。",
      "3. 【下游流向】：溯源结果审核归档后，将作为 /remediation (整治管理模块) 中“一口一策”方案设计的「输入级核心事实依据」。"
    ]
  },
  "/signboard": {
    title: "标识牌档案",
    content: [
      "1. 【数据来源】：拉取 /outfalls (排口台账) 中审核通过的排口列表，针对需要进行实体挂牌的排口进行制牌、安装登记。",
      "2. 【逻辑计算与生成】：",
      "   - QRCode机制：系统通过排口的唯一 UUID 调用生成库生产 URL 链接，并转化为二维码图片 Base64 存储。",
      "   - 共享访问计算：公众线下扫该码，直接重定向至外网访问接口，动态聚合并脱敏展示排口名片信息与当天水质情况。",
      "3. 【联动状态】：若排口台账中该排口因整治被标志为“已注销”或“物理填埋”，标识牌档案的主体状态需联动变更为“已作废/待拆除”。"
    ]
  },
  "/monitoring": {
    title: "在线监测汇总",
    content: [
      "1. 【数据来源】：对接第三方物联网管控平台或 IoT 网关（如基于 MQTT/CoAP 协议上报传感器探头数据）。前端消费时序数据库提供的查询接口。",
      "2. 【聚合运算与图表】：",
      "   - 使用降采样（Downsampling）算法参数，按“小时/天/月”聚合出各周期的平均值、最大值、最小值，由前端负责装填至 ECharts 提供趋势渲染。",
      "   - 在离线推断算法：比对设备最后一次成功上报记录的时间差，当差值(Now - LastUpdate) > 阈值(如30分钟)，系统判定并更新设备状态为“离线”。",
      "3. 【告警判定前置分析】：由后端引擎异步或在此模块录入时校验，如某排口指标连续N次超出设定的国标考核安全阈值，直接向 /warnings 下发超标预警。",
      "4. 【报告生成模板要求】：后端或前端需要按照以下段落模板进行文本及排版生成：",
      "   - 一、排口基本信息（本段需动态填入在线排口总数与正常运行数）；",
      "   - 二、监测数据汇总（本段需计算并填入平均达标率，以及主要指标的均值、标准限值比对）；",
      "   - 三、超标情况统计（本段需列出告警频次及具体超标排口明细列表）；",
      "   - 四、水质趋势分析（提供如下可选模板）：",
      "      > 报告期内区域内主要水体监测指标总体呈平稳趋势，受近期环境及气象条件影响，部分截污未完全闭环的排口（如[XXX]区域）在部分时段内主要指标（如[XXX]）有小幅上涨，其余指标在可控区间波动。（触发条件：80% <= 整体达标率 < 95%，且单一排口连续超标次数 <= 3次）",
      "      > 近期降雨量增加导致管网溢流，[XXX]区域多个排口数据出现明显恶化趋势，其中[XXX]指标连续超过排放标准，需引起高度重视。（触发条件：整体达标率 < 80%，或某一行政区划内新增告警数环比上涨 > 20%）",
      "      > 自[XXX]片区截污纳管工程完工后，该片区排口水质显著改善，各项指标均已稳定在国家规定标准内。（触发条件：整体达标率 >= 95%，且告警模块近7天新增告警数环比下降 > 30%）",
      "   - 五、问题与建议措施（提供如下可选模板）：",
      "      > 问题：近期监测设备掉线频发。建议：运维单位应当加大老旧高频故障设备（如[XXX]点位）的例行维护和标定校准频次。（触发条件：设备在线率 < 90%，或离线状态设备数量 >= 5台）",
      "      > 问题：部分老城区及工业周边排口存在污水混流引发的短时超标风险。建议：相关执法部门尽快安排人工对频发超标点位（如[XXX]排污口）进行深度溯源排查。（触发条件：告警模块中同一排口关联的记录出现连续水质超标且溯源状态为空）",
      "      > 问题：汛期部分管网溢流不堪重负。建议：配合住建或水务加快推进[XXX]片区雨污分流彻底改造工程，降低汛期溢流负荷。（触发条件：溯源模块结论字段包含“管网破损/雨污混流”等关键词的大约等于3次）"
    ]
  },
  "/devices": {
    title: "设备管理",
    content: [
      "1. 【数据来源】：汇聚所有安装的在线监测设备台账信息及运行状态监控数据。",
      "2. 【状态规则】：根据最近上报时间差(Now - LastUpdate)和通信状态计算设备在线或离线；",
      "3. 【联动逻辑】：对故障、断连的设备系统会自动触发运维工单流转至 /maintenance 模块；",
      "4. 【权限与安全】：修改配置或重新分配设备需要系统管理员或运维主管审批权限。"
    ]
  },
  "/warnings": {
    title: "事件与告警中心",
    content: [
      "1. 【数据来源】：由系统内部规则引擎触发的「水质监测超标告警」，由移动端上报的「公众扫码反馈投诉」外链打入数据，以及内部「巡查排查填报异常」。",
      "2. 【状态机流转与归档计算】：",
      "   - 待处置(Pending)：最新系统捕捉告警，可伴随大屏闪烁或钉钉/短信消息推至“整治管理员”。",
      "   - 处置中(Processing)：已被人认领、响应或派发跟进单。",
      "   - 已闭环(Resolved)：需记录整改方案与附件后关闭，或直接转办成立为长期整治项目，建立外键映射机制完成关闭逻辑。",
      "3. 【SLA超时机制】：动态求差(当前时间 - 告警首发时间)，若大于规定响应时效（如24h未处理），字段标记为超时，用于在 /analysis 生成部门履职绩效统计。"
    ]
  },
  "/remediation": {
    title: "整治管理",
    content: [
      "1. 【立项数据】：作为整治闭环的核心枢纽模块，“一口一策”方案来源于 /warnings (告警研判评估) 或 /traceability (溯源报告要求的后续整改)。",
      "2. 【核心状态与工作流计算】：",
      "   - 基于BPM状态机的核心审批流：前期准备阶段 -> 方案设计与评审 -> 进场开工实施 -> 完工自查阶段 -> 联合最终销号验收。",
      "   - 前后节点相互制约，每一状态流转都需要上报角色、目标审核角色执行状态计算。",
      "3. 【数据联动终点】：",
      "   - 联合验收销号完成，工作流终止，系统自动触发 webhook 将 /outfalls 中对应主键的排口记录状态置为「已达标/已销号」。",
      "   - 涉及到的专项治理投入资金及完成周期用于流入 /analysis 宽表供看板提取。"
    ]
  },
  "/maintenance": {
    title: "运维管理",
    content: [
      "1. 【数据来源与触发设计】：",
      "   - 故障派单自动触发：/monitoring (在线监测) 判断仪器掉线或探头故障，可一键流转为设备维修工单。",
      "   - 计划基准任务：通过定时系统根据各排口仪器质保及校准周期生成下发日常巡防保养工单。",
      "2. 【数据结构】：包含分配的运维部门人员，关联的唯一设备编号以及处理工单过程中抵扣登记的配件及材料耗损明细。",
      "3. 【业务打通闭环】：工单状态为完工验收后，/monitoring 中的相应设备才可被解除“维修停用锁定”重新恢复上线状态与数据接收通道。"
    ]
  },
  "/analysis": {
    title: "数据分析",
    content: [
      "1. 【数据来源】：读取业务数据库定时通过 ETL（Extract, Transform, Load）清洗到数据分析宽表（Data Warehouse）的全量脱敏时序与记录数据。",
      "2. 【主要计算指标】：",
      "   - 全年水质考核画像：汇集全年 /monitoring 每天均值指标与本地水系定段国标要求阈值进行差异比较度量，绘制图表。",
      "   - 污染高发区域密图：收集 /warnings 中历史告警表单所处经纬度进行聚类或核密度计算，实现热力图层叠加渲染。",
      "   - 部门履职绩效与响应统计：根据前述事件状态流转所花费的时间差汇算求值。",
      "3. 【钻取交互与OLAP】：依托图表库，实现按“年/季/月/片区”的多维下拉维度联动，具备报表区块点击下钻查询原始工单明细能力。"
    ]
  },
  "/system": {
    title: "系统管理",
    content: [
      "1. 【数据源保障】：支撑上层系统的 RBAC（Role-Based Access Control）配置权限关系表，以及如（地区行政编码、设备标准类型等）被全量组件依赖获取的系统核心字典集合。",
      "2. 【拦截计算机制】：",
      "   - 控制前端呈现：配置的菜单节点映射成动态返回的路由树配置注入前端层，决定侧边导航呈现可见度并充当防越权拦截阀门。",
      "   - 操作鉴权与过滤：接口携带用户 Department 树级参数限定（如执法人员仅看属地数据权限设定计算），将拼在 HTTP 请求层面执行服务端检查过滤。",
      "3. 【全局参数与联动】：对报警阈值的灵敏度参数设置等存入表后，被 /monitoring 模块的后台消费者服务作为动态策略变量读入进行告警运算拦截判定。"
    ]
  }
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) return JSON.parse(saved);
    return mockUsers[0];
  });
  
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showDevDocs, setShowDevDocs] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setShowRoleSwitcher(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserChange = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowRoleSwitcher(false);
    window.dispatchEvent(new Event('userChange'));
    
    // Redirect to home if current page is not allowed
    const allowed = roleFeatures[user.role] || [];
    if (!allowed.includes(location.pathname)) {
      navigate('/');
    }
  };

  const allowedPaths = roleFeatures[currentUser.role] || [];
  const navItems = allNavItems.filter(item => allowedPaths.includes(item.path));

  const currentNav = navItems.find(item => item.path === location.pathname) || navItems[0];


  return (
    <div className="flex h-screen w-full bg-[#F0F2F5] font-sans text-[#333333]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0056B3] text-white flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
          <h1 className="text-lg font-bold tracking-wider truncate">铜山区排污口监管系统</h1>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                      isActive
                        ? "bg-white/20 font-medium"
                        : "hover:bg-white/10 text-white/80 hover:text-white"
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-4">
          <Link 
            to="/screen" 
            target="_blank"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all"
          >
            <MonitorPlay className="w-4 h-4" />
            可视化大屏
          </Link>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.roleName}</p>
              <p className="text-xs text-white/60 truncate">{currentUser.name.split(' ')[0]}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#333333]">
              {currentNav?.name || "页面"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-[#666666] hover:text-[#0056B3] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4D4F] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                3
              </span>
            </div>
            
            <button 
              onClick={() => setShowDevDocs(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              title="查看开发者文档"
            >
              <TerminalSquare className="w-4 h-4" />
              <span className="hidden sm:inline">开发者必读</span>
            </button>

            <div className="h-6 w-px bg-gray-200" />
            
            <div className="relative" ref={switcherRef}>
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              >
                <div className="w-8 h-8 bg-[#0056B3] text-white rounded-full flex items-center justify-center font-medium text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">{currentUser.roleName}</div>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", showRoleSwitcher ? "rotate-180" : "")} />
              </div>
              
              {showRoleSwitcher && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg border border-gray-100 shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    模拟切换账号体验权限
                  </div>
                  {mockUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleUserChange(user)}
                      className={cn(
                        "w-full text-left px-4 py-3 flex flex-col hover:bg-blue-50 transition-colors",
                        currentUser.id === user.id ? "bg-blue-50/50" : ""
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        {currentUser.id === user.id && <span className="w-2 h-2 rounded-full bg-[#0056B3]"></span>}
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">{user.roleName} - {user.username}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-50 mt-2">
                    <button className="w-full text-left px-4 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      退出登录 (模拟)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {showDevDocs && (
        <Modal title="开发者页面说明" onClose={() => setShowDevDocs(false)} showFooter={false}>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="flex items-center gap-2 font-medium text-blue-900 mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                当前页面模块：{devDocs[location.pathname]?.title || "当前页面"}
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 list-disc pl-4">
                {(devDocs[location.pathname]?.content || []).map((text, idx) => (
                  <li key={idx} className="leading-relaxed">{text}</li>
                ))}
                {!devDocs[location.pathname] && (
                  <li>该页面暂无补充开发者文档说明。</li>
                )}
              </ul>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="font-semibold mb-1 text-gray-700">📌 全局开发提示</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>本系统为纯前端实现，所有数据结构与增删改查仅在内存模拟，浏览器刷新后重置（当前用户角色已做本地持久化）。</li>
                <li>您可点击顶部的用户头像切换不同的角色账号，体验菜单权限与操作权限隔离效果。</li>
                <li>点击表格列表右侧的「编辑/查看」按钮，可以体验数据的弹窗编辑交互。</li>
              </ul>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setShowDevDocs(false)} className="px-4 py-2 bg-[#0056B3] text-white rounded-lg hover:bg-[#004494] text-sm font-medium transition-colors">
                我知道了
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* AI Assistant Floating Chat */}
      <AIAssistant />
    </div>
  );
}

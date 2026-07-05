// Lyrics data — each entry has a time (seconds) and text

export interface LyricLine {
  time: number; // seconds into the song
  text: string;
}

const LYRICS: LyricLine[] = [
  { time: 0, text: "🎵  ~  ♪  ~" },
  { time: 13.936, text: "丘比特 惩罚我 让你去砍我的树" },
  { time: 21.742, text: "丘比特 惩罚我" },
  { time: 27.742, text: "丘比特 惩罚我" },
  { time: 32.261, text: "苹果园 让你去挖我的树" },
  { time: 35.677, text: "这回我 带上了枷锁" },
  { time: 39.227, text: "随便 whatever whatever u do" },
  { time: 42.657, text: "在不同机场" },
  { time: 44.286, text: "我非常大方" },
  { time: 45.996, text: "从后面随便给你抱我多久" },
  { time: 49.629, text: "也会有争吵" },
  { time: 51.210, text: "和大把的笑" },
  { time: 53.104, text: "so baby whatever whatever u do" },
  { time: 56.807, text: "whatever u do" },
  { time: 58.328, text: "只要不伤到皮肤" },
  { time: 59.503, text: "当阳光照进窗户" },
  { time: 61.130, text: "u white like a snow" },
  { time: 62.087, text: "我看得清楚" },
  { time: 63.097, text: "我不太会写情书" },
  { time: 64.512, text: "很凶 但没有 坏的心术" },
  { time: 66.812, text: "等我车保养结束" },
  { time: 68.009, text: "过来接你 记得在路边招手" },
  { time: 70.282, text: "我转向左" },
  { time: 71.688, text: "选一个角度像李奥纳多" },
  { time: 73.635, text: "要专门系安全带" },
  { time: 75.108, text: "把手故意靠近你那头" },
  { time: 77.460, text: "那夕阳 露出了一半 一半被隐藏" },
  { time: 80.762, text: "就好像 你有时侯点头 有时候摇头" },
  { time: 84.654, text: "丘比特 惩罚我" },
  { time: 88.208, text: "苹果园 让你去挖我的树" },
  { time: 91.771, text: "这回我 带上了枷锁" },
  { time: 95.352, text: "随便 whatever whatever u do" },
  { time: 98.699, text: "在不同机场" },
  { time: 100.430, text: "我非常大方" },
  { time: 102.293, text: "从后面随便给你抱我多久" },
  { time: 105.733, text: "也会有争吵" },
  { time: 107.485, text: "和大把的笑" },
  { time: 109.246, text: "so baby whatever whatever u do" },
  { time: 119.782, text: "别想太复杂" },
  { time: 120.651, text: "不过爱情的毒打" },
  { time: 122.349, text: "我带上行李出发" },
  { time: 123.971, text: "找你把没有的经历补上" },
  { time: 126.618, text: "球鞋 擦干净了纯白色" },
  { time: 129.049, text: "邋里邋遢不可能的" },
  { time: 130.587, text: "更何况你美丽动人的" },
  { time: 132.241, text: "眼神里早已经 tired of luv" },
  { time: 134.877, text: "但被你拯救 干脆就接受惩罚吧" },
  { time: 138.712, text: "whatever whatever u do" },
];

export default LYRICS;

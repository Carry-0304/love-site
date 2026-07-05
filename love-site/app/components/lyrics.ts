// Lyrics data — each entry has a time (seconds) and text
// Replace with your own song lyrics and adjust timestamps

export interface LyricLine {
  time: number; // seconds into the song
  text: string;
}

const LYRICS: LyricLine[] = [
  { time: 0, text: "🎵  ~  ♪  ~" },
  { time: 5, text: "想把你写成一首歌" },
  { time: 10, text: "用最温柔的旋律" },
  { time: 15, text: "每个音符都在诉说" },
  { time: 20, text: "我有多爱你" },
  { time: 26, text: "想养一只猫" },
  { time: 31, text: "想和你有个家" },
  { time: 36, text: "在每一个清晨醒来" },
  { time: 42, text: "身边都是你" },
  { time: 48, text: "你是我所有的温柔" },
  { time: 54, text: "是我不变的守候" },
  { time: 60, text: "不管世界怎么变" },
  { time: 66, text: "我都在你左右" },
  { time: 72, text: "从日出到日落" },
  { time: 78, text: "从春夏到秋冬" },
  { time: 84, text: "我的故事里" },
  { time: 90, text: "全是你" },
  { time: 96, text: "想和你一起看星星" },
  { time: 102, text: "数一颗两颗三颗" },
  { time: 108, text: "直到我们都老去" },
  { time: 114, text: "依然牵着你的手" },
  { time: 120, text: "你是我的光" },
  { time: 126, text: "是我所有的向往" },
  { time: 132, text: "这一生有你就足够" },
  { time: 138, text: "不需要别的什么" },
  { time: 144, text: "我爱你" },
  { time: 150, text: "胜过世间万物" },
  { time: 156, text: "你是我最美的相遇" },
  { time: 162, text: "永远的唯一的" },
  { time: 168, text: "我最爱的你 💕" },
];

export default LYRICS;

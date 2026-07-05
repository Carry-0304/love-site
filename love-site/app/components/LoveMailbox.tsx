"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- CONFIG ----
const GIRLFRIEND_NAME = "胡鑫玥";
const PASSWORD = "1229"; // Her birthday MMDD format

// 365 love notes — one picked each unlock, never repeats until all shown
const LOVE_NOTES = [
  // ===== 一月 · 冬日暖阳 =====
  "你是我所有温柔和浪漫的起点，也是终点。💗",
  "遇见你之后，我的世界里连风都是甜的。🍬",
  "我把所有的好运都攒起来，只为遇见你这件事。✨",
  "你一笑，我的世界就亮了，比阳光还温暖。☀️",
  "想和你一起看遍世间万物，从日出到星河。🌙",
  "你是我的今天，也是我所有的明天。💕",
  "有你在身边，连呼吸都变成了幸福的事情。🌸",
  "我喜欢你，像风走了八千里，不问归期。🌬️",
  "你是我写不完的情诗，唱不完的歌。🎵",
  "第一次见你，我就知道，我等的人来了。💘",
  "你眼中有星辰大海，而我的眼里只有你。🌟",
  "做我的女主角吧，故事我们一起写。📖",
  "世界上最美好的事，就是我喜欢你，你也喜欢我。💞",
  "你就像冬日里的暖阳，温暖了我的整个世界。☀️",
  "不管世界怎么变，我永远站在你这边。🛡️",
  "你的名字，是我见过最短的情诗。📝",
  "陪伴是最长情的告白，而我想陪你一辈子。🤝",
  "你是我平淡生活里的英雄梦想。🦸",
  "余生很长，但我只想和你一起度过。⏳",
  "你的出现，让我之前的等待都有了意义。🎯",
  "我喜欢你，不仅仅是喜欢，是很喜欢很喜欢。💖",
  "你是我宇宙里最亮的那颗星，永远闪耀。⭐",
  "想牵着你的手，走过春夏秋冬。🍂",
  "你是我不想跟任何人分享的好。🔒",
  "有你的地方，就是我想去的地方。📍",
  "你是我最珍贵的宝藏，谁也不许碰。💎",
  "每天醒来第一个想到的人，是你。🌅",
  "你的笑容，是我每天最期待的风景。🏞️",
  "我的世界很小，装下一个你刚刚好。🎁",
  "你是我一生只会遇见一次的惊喜。🎉",
  "在所有人声鼎沸的欢喜里，我唯独望向你。👀",

  // ===== 二月 · 浪漫情人节 =====
  "如果可以，我想把所有的温柔都给你。🎀",
  "你是我做过最美的梦，也是我醒来的理由。🌄",
  "我对你的喜欢，是词不达意的汹涌。🌊",
  "你是我的软肋，也是我的铠甲。⚔️",
  "我不想做全世界的英雄，只想做你一个人的超人。🦸‍♂️",
  "遇见你，是我这辈子最美丽的意外。🎲",
  "你的声音，是我听过最动听的旋律。🎶",
  "我愿化身石桥，受五百年风吹，只为等你走过。🏛️",
  "你是我疲惫时最想依靠的港湾。⚓",
  "说不清哪里好，但就是谁都替代不了。🔑",
  "想念是会呼吸的痛，而你就是我的止痛药。💊",
  "你是我最想留住的幸运。🍀",
  "我愿意为你，变得温柔又坚定。💪",
  "你的名字，从我的笔尖流淌到心里。🖊️",
  "我看过很多风景，但最美的永远是你的眼睛。👁️",
  "你是我漫长岁月里唯一的执着。🎯",
  "想和你一起浪费时间，做尽世间浪漫事。⏰",
  "你是我荒芜心田里开出的一朵花。🌷",
  "没有你，赢了全世界又如何。🏆",
  "你是我义无反顾的奔赴。🏃",
  "我攒了一生的温柔，只为给你一个人。💝",
  "你是我心底最柔软的秘密。🤫",
  "众生皆苦，唯有你是草莓味的。🍓",
  "我想把你藏进我心里，谁也找不到。🙈",
  "你是我的光，照亮了我所有的黑暗。🔦",
  "和你在一起的每一天，都是情人节。💐",
  "我不敢说永远，但我会爱你很久很久。♾️",
  "你是我最想环游的世界。🌍",

  // ===== 三月 · 春暖花开 =====
  "春风十里，不如你。🌿",
  "你一笑，春天就来了。🌺",
  "想和你一起种花，看着它们和我们一起成长。🌻",
  "你是春天里最温柔的那抹绿。🍃",
  "三月的风，带着你的气息，让我心醉。💨",
  "花开是你，花落也是你。🥀",
  "你的笑容比春天的阳光还灿烂。🌞",
  "想和你手牵手走在樱花树下。🌸",
  "你是人间四月天，虽然现在是三月。🌤️",
  "春风拂面，就像你在我耳边说情话。💬",
  "春天很短，但想你的日子很长。📏",
  "你是我漫长冬季后的第一抹春色。🌱",
  "万物复苏的季节，我的爱也在疯长。🌿",
  "想用一整个春天给你写一封情书。✉️",
  "你的笑声是春天最美的声音。🔔",
  "在花开的季节遇见花开般的你。💮",
  "每一朵花开，都是我对你的思念。🏵️",
  "春天把大地染绿，你把我的心填满。💚",
  "三月的雨很温柔，但不如你的眼神。☔",
  "你是我生命里永不凋谢的春天。🌸",

  // ===== 四月 · 温柔相伴 =====
  "你是爱，是暖，是希望，是人间的四月天。🕊️",
  "最美不过人间四月天，最好不过有你在身边。🌼",
  "四月的风，轻轻柔柔，像你在我耳边呢喃。🍃",
  "想和你一起看云卷云舒，花开花落。☁️",
  "你是四月里最温柔的诗。📜",
  "想和你一起躺在草地上看蓝天白云。🌤️",
  "四月的阳光不燥，微风正好，而你也在这里。🌤️",
  "你是我所有美好想象的总和。🧩",
  "四月是你的谎言？不，四月是我的真心。💝",
  "想和你一起放风筝，让爱飞得更高。🪁",
  "你的温柔像四月的雨，润物细无声。🌧️",
  "四月适合恋爱，而我只想和你恋爱。💑",
  "你是我生命中最美的人间四月天。🌻",
  "四月花开正好，你来得正好。🌷",
  "和你在春天里走走，就很好。🚶",
  "四月的每一天都因你而特别。📅",
  "你是大自然写给人间最美的情诗。🌿",
  "想和你一起看一场四月夕阳。🌇",

  // ===== 五月 · 初夏心动 =====
  "你是五月里最温柔的风。🌬️",
  "初夏的微风，替我告诉你我有多想你。💨",
  "五月的天，刚诞生的夏天，而你刚好出现。🌞",
  "想和你在夏夜的星空下散步。🌌",
  "你是我的夏日限定，也是我的来日方长。☀️",
  "西瓜的第一口给你，冰淇淋的最后一口也给你。🍉",
  "五月的晚霞很美，但不如你脸红的样子。🌅",
  "想和你看一场五月天的演唱会。🎤",
  "你是我夏日里沁人心脾的凉风。🌊",
  "夏天的风我永远记得，清清楚楚地说你爱我。🍃",
  "五月的阳光正好，就像你在我生命里刚好出现。☀️",
  "想和你一起喝冰可乐，吃小龙虾。🦞",
  "你比夏天还耀眼。😎",
  "五月的每一天都冒着粉红泡泡。🫧",
  "你是我的夏日清凉，冬日暖阳。🌡️",
  "想和你一起去看海，听海浪拍打的声音。🌊",
  "五月的草莓很甜，但没你甜。🍓",
  "你的笑容是夏天最好的降温剂。🧊",
  "想和你一起数星星，一颗两颗三颗……⭐",
  "你是我限定版的五月快乐。🎊",

  // ===== 六月 · 盛夏热恋 =====
  "你是我夏日里最甜的冰淇淋。🍦",
  "六月的天很热，但我的心为你更热。🔥",
  "想和你一起在空调房里看一整天电影。🎬",
  "夏天很长，但爱你更久。📏",
  "你是我的专属避暑山庄。🏔️",
  "六月的雨说来就来，就像我对你的心动。⛈️",
  "你是我夏日里的橘子汽水，冒着甜蜜的气泡。🥤",
  "想和你一起吃遍所有口味的冰淇淋。🍧",
  "六月的星空很美，但你比星星更耀眼。✨",
  "你的出现让我的夏天变得值得期待。🎆",
  "想和你在夏天的傍晚压马路。🛣️",
  "六月的晚风很温柔，就像你。🌬️",
  "你是我永远不想结束的夏天。🏖️",
  "热恋的夏天，连汗水都是甜的。💦",
  "你是盛夏里的一抹清凉。💧",
  "六月的每一天都想和你腻在一起。👫",
  "想和你一起看一场夏日烟火。🎇",
  "你是我整个夏天最想留住的瞬间。📸",
  "六月很热，但你很甜。🍯",

  // ===== 七月 · 生日月专属 =====
  "你是七月最特别的礼物，是我的专属天使。👼",
  "七月的风懒懒的，连云都变热热的，但想到你心就凉凉的。💙",
  "如果生日可以许一个愿，我每年的愿望都是你。🎂",
  "你是上天给我最好的生日礼物。🎁",
  "想和你一起吹蜡烛，一起许愿。🕯️",
  "七月流火，而你是那抹最清凉的月色。🌙",
  "有你的每一天都是值得庆祝的日子。🎉",
  "只想和你一起慢慢变老，从青丝到白发。👴👵",
  "这一生，我做过最正确的决定就是喜欢你。✅",
  "七月是你的季节，而你是我的全世界。🌍",
  "生日快乐的时候最想听到的是你的声音。🎈",
  "每个夏天都会过去，但我对你的爱不会。♾️",
  "七月最浪漫的事就是和你一起虚度光阴。⌛",
  "你是我七月里最温柔的一阵风。🌬️",
  "没有什么比和你一起吹夏日晚风更幸福的事。😊",
  "七月的夜很短，想你的夜很长。🌃",
  "想为你过每一个生日，直到我们很老很老。🎂",
  "你是这个夏天最美的风景。🏞️",

  // ===== 八月 · 盛夏星河 =====
  "八月的星空最亮，但亮不过你的眼睛。🌟",
  "想和你一起躺在屋顶看英仙座流星雨。🌠",
  "你是我浩瀚星河里唯一的坐标。🧭",
  "八月的每个夜晚都想和你一起看星星。🔭",
  "如果每一颗星星代表一个想你的理由，那满天的星都不够。🌌",
  "你的眼眸里有银河，让我忍不住想探索。🔍",
  "你是我在这颗星球上最想私藏的人。🌏",
  "想和你一起去看极光，看这个星球最美的光。🌌",
  "八月的晚风很轻，但我对你的爱很重。⚖️",
  "宇宙很大，而我有你足矣。🚀",
  "你是落入凡间的星辰，是我能触摸到的光。🌠",
  "八月要和你一起喝着冰饮看星星。🥂",
  "和你比，银河都显得黯淡。🌌",
  "你是我环游宇宙后最想回到的星球。🪐",
  "想和你一起坐摩天轮，在最顶端接吻。🎡",
  "八月的心跳，每一拍都在喊你的名字。💓",
  "星河滚烫，你是人间理想。🔥",
  "你是我在地球上发现的最美风景。🌎",

  // ===== 九月 · 秋意渐浓 =====
  "九月的风带着凉意，但我的心因为你永远温暖。🧣",
  "秋天很好，因为你在场。🍂",
  "想和你一起踩落叶，听秋天清脆的声音。🍁",
  "你是秋日里最温暖的那抹颜色。🍂",
  "九月的第一杯奶茶，只想和你一起喝。🧋",
  "秋天的风都是从往年吹来的，而我的爱是全新的。🍃",
  "你是我的秋日限定温柔。🍂",
  "想和你一起在秋天里散步，踩着嘎吱响的落叶。🍁",
  "九月适合思念，而我每天都在想你。💭",
  "你是秋天给我最好的收获。🌾",
  "秋意渐浓，而我对你的喜欢也越来越浓。🍂",
  "九月的阳光很温暖，就像你的手掌。🤲",
  "想和你一起看枫叶变红，就像我们越爱越深。🍁",
  "你是我四季轮回里不变的欢喜。🔄",
  "初秋的晚风替我告诉你我很想你。💨",
  "九月是丰收的季节，而我的丰收就是你。🌽",
  "想和你一起去果园摘苹果。🍎",
  "你是这个秋天最温暖的存在。☕",

  // ===== 十月 · 金秋浪漫 =====
  "十月的阳光很暖，但不如你的怀抱。🤗",
  "想和你在金秋十月一起看银杏叶落。🍂",
  "你是十月里最浪漫的一首诗。📜",
  "十月适合恋爱，适合和你一起浪费时光。⌛",
  "金秋十月，我的心里只装得下你。💛",
  "想和你一起喝秋天的第一杯热可可。☕",
  "十月的黄昏很美，而你是黄昏里最美的风景。🌆",
  "你是我所有秋天里的金色梦想。🌟",
  "层林尽染，不及你眉眼半分。🍁",
  "十月要把你裹进我的外套里。🧥",
  "想和你一起烤红薯，在冷风中分享温暖。🍠",
  "秋天该很好，你若尚在场。🍂",
  "十月的每一天都是想你的形状。💟",
  "你是秋日私语里最动人的那一句。🗣️",
  "想和你一起看满月，圆圆满满。🌕",
  "金秋十月，你是我最大的收获。🌾",
  "十月的风很凉，但想起你心就是暖的。🔥",

  // ===== 十一月 · 深秋初冬 =====
  "十一月想把你的手揣进我的口袋里。🤝",
  "天冷了，想给你全世界最好的温暖。🧤",
  "你是深秋里最后的一抹暖阳。☀️",
  "十一月的第一杯咖啡，想和你一起暖手。☕",
  "天越冷，我就越想靠近你。🫂",
  "你是冬日来临前最温柔的序曲。🎵",
  "十一月要把你裹成一个暖暖的粽子。🫔",
  "想和你一起等第一场雪。❄️",
  "你的笑容能驱散所有寒冷。🔥",
  "十一月适合拥抱，适合依偎，适合说爱你。💕",
  "你是我在寒风中唯一的温暖源。♨️",
  "冬天要来了，而我有你就不怕冷。🧣",
  "想和你一起围着火锅，热气腾腾地聊天。🍲",
  "十一月的夜空很清澈，像你的眼睛。🌌",
  "你是我最温暖的过冬装备。🧤",
  "深秋的思念比落叶还密。🍂",
  "十一月想和你共享一个耳机，听同一首歌。🎧",

  // ===== 十二月 · 冬日恋歌 =====
  "十二月想和你一起跨年，一起倒数。🎆",
  "你是冬日里最温暖的那束光。🕯️",
  "想和你在圣诞树下交换礼物。🎄",
  "十二月的第一场雪，想和你一起看。❄️",
  "你是我最想共度余生的人。💍",
  "冬天很冷，但你的手很暖。🤲",
  "十二月要和喜欢的人一起看雪喝热巧克力。☕",
  "你是圣诞老人给我最好的礼物。🎅",
  "一年的终点，想和你一起画上句号。⭕",
  "十二月有太多浪漫，而我只想和你一个人分享。🎊",
  "你是冬日恋歌里最美的音符。🎶",
  "想和你一起堆雪人，然后笑着看它融化。⛄",
  "十二月适合许愿，而我的愿望永远是你。🌠",
  "年末了，谢谢你这一年都在我身边。🙏",
  "你是我冬天里的小太阳。☀️",
  "十二月要给你全世界最温暖的拥抱。🤗",
  "想和你一起看跨年烟火，许下新年愿望。🎆",

  // ===== 甜蜜日常 =====
  "想和你一起逛超市，推着购物车挑零食。🛒",
  "你做饭我洗碗，这就是我理想的生活。🍳",
  "想和你一起瘫在沙发上看无聊的综艺。📺",
  "每天最期待的事就是见到你。👋",
  "想和你养一只猫，再养一只狗。🐱🐶",
  "你是我所有早安和晚安的理由。🌅🌙",
  "想和你一起煮泡面，加两个蛋。🍜",
  "你是我的Wi-Fi密码、手机壁纸、微信置顶。📱",
  "想和你在下雨天窝在家里什么也不做。🏠",
  "你的起床气很可爱，虽然你不承认。😤",
  "想和你一起去菜市场讨价还价。🥬",
  "你是唯一一个让我秒回消息的人。💬",
  "想和你一起刷牙，对着镜子做鬼脸。🪥",
  "你的小怪癖我都觉得很可爱。😋",
  "想和你一起去便利店买关东煮。🍢",
  "你是我想带回家见爸妈的人。🏡",
  "想和你一起看片看到睡着。😴",
  "每个清晨醒来，都庆幸身边是你。🛏️",
  "想和你一起煮火锅，抢最后一片毛肚。🥩",
  "你是我聊天记录里出现最多的人。📊",

  // ===== 深情告白 =====
  "我爱你，不是因为你完美，而是因为你是你。💯",
  "你是我的独一无二，我的非你不可。☝️",
  "在所有可能的选择里，我永远选你。✅",
  "我想把世界上所有美好的词都用在你身上。🏆",
  "你是我的定数，也是我的变数，是我所有的心甘情愿。🎲",
  "我可以拒绝全世界，但拒绝不了你。🚫",
  "你是我深思熟虑后依然坚定的选择。🧠",
  "我爱你，胜过我解释这句话的能力。🗣️",
  "你是我的原则，也是我的例外。📏",
  "世界很大，但我的眼里只装得下你。🌐",
  "我爱你，从南到北，从东到西。🧭",
  "你是我做过最不后悔的事。☑️",
  "我不完美，但我爱你的心很完美。💓",
  "你是我的百分之百女孩。💯",
  "这一生，我想把我的所有都给你。🎁",
  "你是我写下的最美的诗句。✍️",
  "我爱你，不自量力，无药可救。🏥",
  "你是我所有偏爱和例外的理由。🔐",
  "这辈子就你了，不换了。🔒",
  "你是我的心之所向，梦之所往。🎯",

  // ===== 思念想念 =====
  "刚分开就开始想你，这可怎么办。😔",
  "你在身边的每一天，都是好日子。☀️",
  "我走过很多路，但最想走的是去见你的路。🛤️",
  "思念是一种病，而你是唯一的解药。💊",
  "你不在的每一秒，我都在想你。⏱️",
  "距离不重要，重要的是我的心一直跟着你。🧲",
  "最幸福的事就是和你在一起，其他都是将就。👫",
  "我想穿越人海去拥抱你。🏃",
  "你是我翻山越岭也想见的人。⛰️",
  "对你的思念像野草一样疯长。🌿",
  "见不到你的日子，时间过得好慢。🐌",
  "你是我想时刻带在身边的人。🎒",
  "我最大的愿望就是每天都能见到你。🙏",
  "想念如果有声音，恐怕你早已震耳欲聋。🔊",
  "你不在身边的时候，做什么都心不在焉。💭",
  "翻看我们的聊天记录是我每天必做的事。📱",
  "你不在这座城市，但无处不在我心里。🏙️",
  "等见面的时候，我要把攒了很久的拥抱都补上。🤗",
  "地图上这点距离，阻挡不了我的想念。🗺️",
  "你是我日思夜想的人。🌙",

  // ===== 永恒承诺 =====
  "一辈子很长，但和你在一起就觉得太短。♾️",
  "我不是一个轻易承诺的人，但我承诺永远爱你。🤞",
  "不管未来怎样，我都坚定地站在你这边。🛡️",
  "我想和你从黑发走到白发。👨‍🦳👩‍🦳",
  "你是我想用一生去守护的人。🛡️",
  "时光会变，但爱你的心不变。⏳",
  "未来也许有很多不确定，但你是我的唯一确定。🔮",
  "我想和你一起慢慢变老，老到哪儿也去不了。🧓",
  "你说过的话我都记得，答应你的事我都会做到。📝",
  "来生太远，这辈子我先好好地爱你。💎",
  "不管发生什么，记得我永远在。📍",
  "我许你一世温柔，永不食言。🤙",
  "你是我这辈子最想珍惜的人。🙌",
  "时间会证明，我有多认真地在爱你。⏰",
  "有你，我可以和全世界和解。☮️",
  "我愿陪你走完这一生的路。🛣️",
  "永远有多远，我就爱你多远。📏",
  "给你我的全部，毫无保留。🎁",

  // ===== 温暖陪伴 =====
  "无论你开心还是难过，我都在。🫂",
  "你的小情绪我都能接住。🤲",
  "累了就靠在我肩膀上，我撑得住你。💪",
  "你的眼泪是我的紧急事态。🚨",
  "不用逞强，在我面前你可以做最真实的自己。😌",
  "你的委屈我都懂，你的难过我心疼。💔",
  "天塌下来有我顶着。🏋️",
  "想当你的树洞，听你所有的碎碎念。🕳️",
  "你不需要很好，做你自己就好，我永远站你。🧍",
  "全世界都可以不理解你，但我理解。💡",
  "你需要我的时候，我随时都在。📞",
  "在外面累了就回来，我的怀抱永远为你敞开。🤗",
  "你不会是一个人，因为有我在。👥",
  "你的快乐和难过，我都想参与。🤝",
  "陪你度过每一个低谷，是我的荣幸。🏔️",
  "别怕，有我在呢。🫶",
  "我会一直做你身后最坚实的后盾。🛡️",
  "你是被坚定地爱着的，永远不要怀疑。💖",

  // ===== 俏皮可爱 =====
  "这位同学，你涉嫌偷走我的心，请配合调查。👮",
  "我怀疑你是一颗糖，不然为什么这么甜。🍬",
  "你的可爱已超标，请立即收敛，不然我要亲你了。😘",
  "除了喜欢你，我什么都不会，你看着办吧。🤷",
  "今天也是被你的可爱击中的一天。🎯",
  "把你的名字写在烟上吸进肺里……哦我不抽烟。🚭",
  "看了你一眼，我就忘了手机解锁密码。📱",
  "你是年少的欢喜，喜欢的少年是你。🔄",
  "麻烦你笑一下，我的咖啡忘加糖了。☕",
  "你知道吗，我最近喜欢睡懒觉，因为梦里都是你。🛌",
  "你是我见过最会偷东西的人，偷走了我的心。🫀",
  "我发现你长得像一个人……像我未来的女朋友。👰",
  "我今天吃了一碗面，叫好想见你一面。🍜",
  "你知道我属什么吗？我属于你。🐶",
  "你是哪里人？你是我的心上人。❤️",
  "你最近是不是胖了？在我心里越来越重了。⚖️",
  "我可以和你拍一张合照吗？方便我炫耀。📸",
  "你是我见过第二好看的人，第一是我未来的老婆。👰",
  "你知道我最擅长什么吗？擅长喜欢你。🏅",

  // ===== 诗意浪漫 =====
  "愿我如星君如月，夜夜流光相皎洁。🌙",
  "山有木兮木有枝，心悦君兮君不知。🌳",
  "执子之手，与子偕老。🤝",
  "海底月是天上月，眼前人是心上人。🌊",
  "既见君子，云胡不喜。☁️",
  "死生契阔，与子成说。💍",
  "只愿君心似我心，定不负相思意。💞",
  "两情若是久长时，又岂在朝朝暮暮。⏳",
  "天涯地角有穷时，只有相思无尽处。🌐",
  "愿得一心人，白头不相离。🤍",
  "玲珑骰子安红豆，入骨相思知不知。🎲",
  "身无彩凤双飞翼，心有灵犀一点通。🦋",
  "衣带渐宽终不悔，为伊消得人憔悴。💪",
  "问世间情为何物，直教人生死相许。💘",
  "南风知我意，吹梦到西洲。🌬️",
  "欲寄彩笺兼尺素，山长水阔知何处。✉️",
  "月有阴晴圆缺，而我对你的爱没有。🌕",
  "你是我翻山越岭也要见的人。⛰️",
  "浮世三千，吾爱有三，日月与卿。☀️🌙👩",
  "你如星辰入怀，一瞥便是万年。🌠",

  // ===== 坚定守护 =====
  "任世界天翻地覆，我的温柔永远为你保留。🌍",
  "即使全世界与你为敌，我也站在你这边。⚔️",
  "我不在乎别人的眼光，我只在乎你。👀",
  "你是我愿意倾尽所有去守护的人。🏰",
  "风雨再大，我会为你撑伞。☔",
  "只要你在，我就不怕任何困难。⛰️",
  "我可能不是最强大的，但我是最爱你的。💪",
  "无论顺境逆境，我都牵着你的手不放开。🤝",
  "你往前走吧，我永远在你身后。🚶",
  "就算你错了，我也先护着你，回家再讲道理。🏠",
  "我的底线是你，谁也不能触碰。⛔",
  "为你，千千万万遍。🔁",
  "你可以不坚强，因为有我在。🛡️",
  "有什么风雨，我来扛。🏋️",
  "谁欺负你，我第一个不答应。🥊",
  "你的梦想我帮你守护，你的路上我陪你走。🛤️",
  "做你的专属保镖，二十四小时待命。🛡️",
  "你是我拼了命也要保护的人。💂",

  // ===== 感恩珍惜 =====
  "谢谢你来到我的世界，让我变得完整。🧩",
  "有你真好，这四个字我每天都说不够。🙏",
  "谢谢你包容我的不完美。🫶",
  "遇见你花光了我所有的运气，但我心甘情愿。🍀",
  "谢谢你愿意把余生交给我。💍",
  "你的出现让我的生活从黑白变成了彩色。🎨",
  "感谢你成为我最坚实的后盾。🛡️",
  "谢谢你一直在我身边，不离不弃。💗",
  "有你是我这辈子最大的福气。🧧",
  "谢谢你教会了我什么是爱。📖",
  "能遇见你，三生有幸。🍀🍀🍀",
  "谢谢你的每一次微笑，都是给我的充电。🔋",
  "珍惜和你在一起的每分每秒。⏱️",
  "谢谢你选择了我，我会让你不后悔这个选择。✅",
  "你是我生命中最美好的意外。🎁",
  "每一天都因为你而值得感恩。🙏",
  "谢谢你让我的爱有了归处。🏠",
  "珍惜眼前人，而我的眼前人就是你。👀",

  // ===== 未来憧憬 =====
  "想和你一起规划未来，一字一句都关于你。📋",
  "我们的家要有落地窗、大书架和软软的沙发。🏠",
  "想和你一起去冰岛看极光。🇮🇸",
  "未来想和你一起养一条金毛。🐕",
  "想和你一起去西藏，看最蓝的天。🏔️",
  "我们要一起去很多很多地方，拍很多很多照片。📸",
  "等我们老了，就在院子里种满你喜欢的花。🌻",
  "想和你一起去北海道看雪。🗾",
  "未来每一天的日出日落，都想和你一起看。🌅",
  "我们一起攒钱，一起去环游世界。🌍",
  "想和你一起学会做饭，然后互相嫌弃对方的厨艺。👨‍🍳",
  "我们要有一个小小的阳台，种满你喜欢的花草。🪴",
  "未来不管去哪，只要你在身边就够了。🧳",
  "想和你一起去大理，在洱海边发呆。🏞️",
  "我们的未来，我每天都在想象。🔮",
  "以后给你做饭、给你暖被窝、给你揉肩膀。💆",
  "等我们老了，坐在摇椅上回忆这一生。🪑",
  "未来很远，但有你就不怕。🗺️",
];

/** Get day of year in Beijing time (UTC+8), 1–365 */
function getBeijingDayOfYear(): number {
  const now = new Date();
  // Convert to Beijing time: UTC + 8
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const beijing = new Date(utc + 8 * 3600000);
  const start = new Date(beijing.getFullYear(), 0, 0);
  const diff = beijing.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Pick the love note for today — based on Beijing time day-of-year */
function pickLoveNote(): string {
  const day = getBeijingDayOfYear();
  return LOVE_NOTES[(day - 1) % LOVE_NOTES.length];
}

const PASSWORD_HINT = "提示：密码是你的生日 (A B C D格式) ";
// Voice message URLs — replace with your real audio files
const VOICE_MESSAGES = [
  { id: "1", title: "早安，宝贝 ☀️", src: "", duration: "0:15" },
  { id: "2", title: "想你的时候 🌙", src: "", duration: "0:20" },
  { id: "3", title: "睡前悄悄话 💤", src: "", duration: "0:18" },
];
// -----------------

// ============================================================
//  Text Rain Effect Canvas
// ============================================================
function TextRain({ isActive, name }: { isActive: boolean; name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -500, y: -500 });
  const dropsRef = useRef<
    Array<{
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;
      text: string;
    }>
  >([]);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Warm love phrases for the rain
    const phrases = [
      "我爱你", "I ❤️ U", "想你", "宝贝", "honey",
      "❤️", "miss you", "forever", "我的唯一",
      "love you", "你是光", "心动", "💕","QRK的onlyone", "hxy小宝贝儿"

  ];

    // Initialize with scattered drops
    dropsRef.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.25 + Math.random() * 1.1,
      size: 12 + Math.random() * 18,
      opacity: 0.12 + Math.random() * 0.38,
      text: phrases[Math.floor(Math.random() * phrases.length)],
    }));

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("touchmove", handleTouch);

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isMouseOnCanvas = mx > 0 && my > 0;

      dropsRef.current.forEach((drop) => {
        drop.y += drop.speed;

        // Mouse attraction —凝聚成名字
        if (isMouseOnCanvas) {
          const dx = mx - drop.x;
          const dy = my - drop.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            // Magnetic pull
            drop.x += dx * 0.04;
            drop.y += dy * 0.04;
            drop.text = name;
            drop.opacity = Math.min(0.92, drop.opacity + 0.025);
            drop.size = Math.min(34, drop.size + 0.15);
          } else if (drop.text === name && dist > 150) {
            // Release back to random phrase
            drop.text = phrases[Math.floor(Math.random() * phrases.length)];
            drop.size = 12 + Math.random() * 18;
            drop.opacity = 0.15 + Math.random() * 0.35;
          }
        }

        // Reset when off screen
        if (drop.y > canvas.height + 40) {
          drop.y = -40;
          drop.x = Math.random() * canvas.width;
          drop.opacity = 0.12 + Math.random() * 0.38;
        }
        if (drop.x < -40) drop.x = canvas.width + 40;
        if (drop.x > canvas.width + 40) drop.x = -40;

        ctx.save();
        ctx.globalAlpha = drop.opacity;

        // Name gets the deep rose color; others are softer
        const isName = drop.text === name;
        ctx.font = `${drop.size}px var(--font-script), "Dancing Script", "Noto Serif SC", serif`;
        ctx.fillStyle = isName ? "#B56576" : "#C48B8B";

        // Name text gets a subtle glow
        if (isName) {
          ctx.shadowColor = "rgba(255, 107, 138, 0.4)";
          ctx.shadowBlur = 10;
        }

        ctx.fillText(drop.text, drop.x, drop.y);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("touchmove", handleTouch);
    };
  }, [isActive, name]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, opacity: 0.7 }}
    />
  );
}

// ============================================================
//  Typing animation for the welcome letter
// ============================================================
function Typewriter({ text, delay = 30 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay, started]);

  return <span>{displayed}</span>;
}

// ============================================================
//  Main Mailbox Component
// ============================================================
export default function LoveMailbox() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loveNote, setLoveNote] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsUnlocked(true);
      setError("");
      setLoveNote(pickLoveNote());
      setTimeout(() => setShowWelcome(true), 600);
    } else {
      setAttempts((a) => a + 1);
      if (attempts >= 2) {
        setError("宝贝，再想想……那个只属于你的日子 💕");
      } else if (attempts >= 1) {
        setError("差一点点～你一定能想起来的 ✨");
      } else {
        setError("密码不对哦～再猜猜看？ 💫");
      }
      setPassword("");
    }
  };

  const resetAll = () => {
    setIsUnlocked(false);
    setShowWelcome(false);
    setPassword("");
    setError("");
    setAttempts(0);
  };

  return (
    <section className="relative py-24 px-4 min-h-screen">
      {/* Section title */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-script text-gradient-love mb-3">
          QRK 💞 hxy的秘密空间
        </h2>
        <p className="text-sm text-rose-dried/60 tracking-widest font-sans">
          只有你能打开的秘密空间
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* ======== LOCKED STATE ======== */
            <motion.div
              key="locked"
              className="glass-strong p-10 text-center relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
            >
              {/* Subtle ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(255,182,193,0.15) 0%, transparent 60%)",
                }}
              />

              <div className="relative z-10">
                {/* Lock icon with gentle sway */}
                <motion.div
                  className="text-7xl mb-6"
                  animate={{
                    rotate: [0, -3, 3, -3, 0],
                    scale: [1, 1.03, 1, 1.03, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                  }}
                >
                  🔒
                </motion.div>

                <h3 className="text-2xl font-script text-rose-deep mb-2">
                  这是只属于你的秘密空间
                </h3>
                <p className="text-xs text-rose-dried/50 font-sans mb-8 tracking-wide">
                  除了你，谁也进不来
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="输入密码解锁..."
                      maxLength={6}
                      className="w-full px-5 py-3 rounded-full bg-white/50 border border-rose-dried/20 text-center text-rose-deep placeholder-rose-dried/40 outline-none focus:border-rose-dried/50 focus:ring-2 focus:ring-rose-dried/10 transition-all font-sans"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.p
                      className="text-sm text-rose-deep/70 font-sans"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={error}
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-rose-dried via-rose-deep to-rose-dried text-white font-sans text-sm tracking-wider hover:shadow-lg hover:shadow-rose-dried/30 transition-all active:scale-95"
                  >
                    打开信箱 💌
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-rose-dried/40 hover:text-rose-dried/60 transition-colors font-sans underline underline-offset-4"
                  >
                    {showHint ? "隐藏提示" : "忘记密码？"}
                  </button>

                  <AnimatePresence>
                    {showHint && (
                      <motion.p
                        className="text-xs text-rose-dried/50 font-sans"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {PASSWORD_HINT}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          ) : (
            /* ======== UNLOCKED STATE ======== */
            <motion.div
              key="unlocked"
              className="glass-strong p-8 md:p-10 text-center relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ minHeight: "450px" }}
            >
              {/* Text Rain background */}
              <TextRain isActive={isUnlocked} name={GIRLFRIEND_NAME} />

              {/* Content */}
              <div className="relative z-10">
                {/* ──── Welcome Letter ──── */}
                <AnimatePresence>
                  {showWelcome && (
                    <motion.div
                      className="mb-10"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      {/* Seal stamp */}
                      <motion.div
                        className="text-5xl mb-3"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.2,
                          type: "spring",
                          damping: 10,
                        }}
                      >
                        💝
                      </motion.div>

                      <h3 className="text-2xl md:text-3xl font-script text-gradient-love mb-4">
                        欢迎回来，{GIRLFRIEND_NAME}
                      </h3>

                      {/* Decorative seal line */}
                      <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-rose-dried/30" />
                        <span className="text-rose-dried/25 text-[10px] tracking-[0.3em] font-sans">
                          TOP SECRET
                        </span>
                        <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-rose-dried/30" />
                      </div>

                      {/* The letter */}
                      <motion.div
                        className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-sm border border-white/50 text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="text-sm text-rose-deep/80 leading-relaxed font-sans">
                          <Typewriter
                            text={`嘿，你终于来了。\n\n这个网站只允许你一个人登录，密码是你在我心里的位置——那个最重要的日子。\n\n别人猜不到，也进不来。这是你的专属领地，我做的一切，都只想给你一个人看。\n\n💕`}
                            delay={28}
                          />
                        </p>
                        <motion.p
                          className="text-right text-xs text-rose-dried/50 mt-4 font-script"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 3 }}
                        >
                          —— 你的Only One---Mr.Qin
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ──── Random Love Note ──── */}
                <AnimatePresence>
                  {loveNote && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.3, type: "spring", damping: 14 }}
                    >
                      <div className="bg-gradient-to-r from-rose-dried/8 via-rose-deep/12 to-rose-dried/8 rounded-2xl px-6 py-5 border border-rose-dried/15 backdrop-blur-sm">
                        <p className="text-xs text-rose-dried/50 tracking-widest font-sans mb-2">
                          💌 今日情话
                        </p>
                        <motion.p
                          className="text-base md:text-lg font-script text-rose-deep/90 leading-relaxed italic"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        >
                          "{loveNote}"
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ──── Voice Messages ──── */}
                <div className="space-y-3">
                  <p className="text-xs text-rose-dried/50 tracking-widest font-sans mb-4">
                    🎧 我留给你的悄悄话
                  </p>

                  {VOICE_MESSAGES.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                        playingId === msg.id
                          ? "bg-rose-dried/15 border border-rose-dried/30 shadow-inner"
                          : "bg-white/30 border border-transparent hover:bg-white/50 hover:shadow-md"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (msg.src) {
                          setPlayingId(playingId === msg.id ? null : msg.id);
                          // TODO: integrate real audio playback
                        }
                      }}
                    >
                      {/* Play button */}
                      <motion.div
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                          playingId === msg.id
                            ? "bg-rose-deep text-white shadow-md"
                            : "bg-rose-dried/12 text-rose-deep"
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {playingId === msg.id ? "⏸" : "▶"}
                      </motion.div>

                      <div className="flex-1 text-left">
                        <p className="text-sm font-sans text-rose-deep font-medium">
                          {msg.title}
                        </p>
                        <p className="text-xs text-rose-dried/50 font-sans">
                          {msg.src ? `点击播放 · ${msg.duration}` : `即将上传 · ${msg.duration}`}
                        </p>
                      </div>

                      {/* Sound wave animation when playing */}
                      {playingId === msg.id && (
                        <div className="flex items-end gap-[2px] h-6">
                          {[3, 6, 2, 8, 4, 7, 5].map((h, i) => (
                            <motion.div
                              key={i}
                              className="w-[3px] rounded-full bg-rose-deep/60"
                              animate={{
                                height: [`${h * 2}px`, `${h * 3}px`, `${h * 2}px`],
                              }}
                              transition={{
                                duration: 0.5 + i * 0.08,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Empty state: upload hint */}
                  {VOICE_MESSAGES.every((m) => !m.src) && (
                    <motion.p
                      className="text-xs text-rose-dried/40 font-sans mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      好了，就到这。这封信收好，不许弄丢，因为我不打算再写第二遍——除非你撒娇求我
                    </motion.p>
                  )}
                </div>

                {/* Lock again */}
                <button
                  onClick={resetAll}
                  className="mt-8 text-xs text-rose-dried/40 hover:text-rose-dried/60 transition-colors font-sans"
                >
                  🔒 重新锁上
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

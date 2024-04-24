---
title: 转载-帧锁定同步算法
date: 2024-02-25
tags:
  - 实践
  - 帧同步
---

>教程出自[帧锁定同步算法](https://www.skywind.me/blog/archives/131)
>大佬的思想让我叹为观止
>今日膜拜skywind大佬,并开始写一个帧同步的Demo
>顺带把评论也copy下来了(●'◡'●)

**帧锁定算法解决游戏同步**

早期 RTS，XBOX360 LIVE游戏常用同步策略是什么？格斗游戏多人联机如何保证流畅性和一致性？如何才能像单机游戏一样编写网游？敬请观看《帧锁定同步算法》

**算法概念**

该算法普遍要求网速RTT要在100ms以内，一般人数不超过8人，在这样的情况下，可以像单机游戏一样编写网络游戏。所有客户端任意时刻逻辑都是统一的，缺点是一个人卡机，所有人等待。

1．客户端定时（比如每五帧）上传控制信息。  
2．服务器收到所有控制信息后广播给所有客户。  
3．客户端用服务器发来的更新消息中的控制信息进行游戏。  
4．如果客户端进行到下一个关键帧（5帧后）时没有收到服务器的更新消息则等待。  
5．如果客户端进行到下一个关键帧时已经接收到了服务器的更新消息，则将上面的数据用于游戏，并采集当前鼠标键盘输入发送给服务器，同时继续进行下去。  
6．服务端采集到所有数据后再次发送下一个关键帧更新消息。

这个等待关键帧更新数据的过程称为“帧锁定”  
应用案例：大部分RTS游戏，街霸II(xbox360)，Callus模拟器。

**算法流程**

客户端逻辑：  
1.        判断当前帧F是否关键帧K1：如果不是跳转（7）。  
2.        如果是关键帧，则察看有没有K1的UPDATE数据，如果没有的话重复2等待。  
3.        采集当前K1的输入作为CTRL数据与K1编号一起发送给服务器  
4.        从UPDATE K1中得到下一个关键帧的号码K2以及到下一个关键帧之间的输入数据I。  
5.        从这个关键帧到下 一个关键帧K2之间的虚拟输入都用I。  
6.        令K1 = K2。  
7.        执行该帧逻辑  
8.        跳转（1）

服务端逻辑：  
1．        收集所有客户端本关键帧K1的CTRL数据（Ctrl-K）等待知道收集完成所有的CTRL-K。  
2．        根据所有CTRL-K，计算下一个关键帧K2的Update，计算再下一个关键帧的编号K3。  
3．        将Update发送给所有客户端  
4．        令K1=K2  
5．        跳转（1）

[![3qtcd](/images/posts/3qtcd.png)

服务器根据所有客户端的最大RTT，平滑计算下一个关键帧的编号，让延迟根据网络情况自动调整。

**算法演示**

我根据该算法将街机模拟器修改出了一个可用于多人对战的版本，早期有一个叫做kaillera的东西，可以帮助模拟器实现多人联机，但是并没有作帧锁定，只是简单将键盘消息进行收集广播而已，后来Capcom在PSP和360上都出过街霸的联网版本，但是联网效果不理想。这个算法其实局域网有细就经常使用了，只是近年来公网速度提高，很容易找到RTT<50ms的服务器，因此根据上述算法，在平均RTT=100ms（操作灵敏度1/10秒），情况下，保证自动计算关键帧适应各种网络条件后，就能够像编写单机游戏一样开发网游，而不需状态上作复杂的位置/状态同步。

[![qrg50](/images/posts/qrg50.png)

从上图的演示中可以看到，两个模拟器进程都在运行1941这个游戏，两边客户端使用了该算法，将逻辑统一在一个整体中。  
[![nwr3j](/images/posts/nwr3j.png)  
最后这张图是运行KOF99的效果图，两边完美同步。

**乐观帧锁定**

针对传统严格帧锁定算法中网速慢会卡到网速快的问题，实践中线上动作游戏通常用“定时不等待”的乐观方式再每次Interval时钟发生时固定将操作广播给所有用户，不依赖具体每个玩家是否有操作更新：

1. 单个用户当前键盘上下左右攻击跳跃是否按下用一个32位整数描述，服务端描述一局游戏中最多8玩家的键盘操作为：int player_keyboards[8];

2. 服务端每秒钟20-50次向所有客户端发送更新消息（包含所有客户端的操作和递增的帧号）：

update=（FrameID，player_keyboards）

3. 客户端就像播放游戏录像一样不停的播放这些包含每帧所有玩家操作的 update消息。

4. 客户端如果没有update数据了，就必须等待，直到有新的数据到来。

5. 客户端如果一下子收到很多连续的update，则快进播放。

6. 客户端只有按键按下或者放开，就会发送消息给服务端（而不是到每帧开始才采集键盘），消息只包含一个整数。服务端收到以后，改写player_keyboards

————-

虽然网速慢的玩家网络一卡，可能就被网速快的玩家给秒了（其他游戏也差不多）。但是网速慢的玩家不会卡到快的玩家，只会感觉自己操作延迟而已。另一个侧面来说，土豪的网宿一般比较快，我们要照顾。

随机数需要服务端提前将种子发给各个客户端，各个客户端算逻辑时用该种子生成随机数，另外该例子以键盘操作为例，实际可以以更高级的操作为例，比如“正走向A点”，“正在攻击”等。该方法目前也成功的被应用到了若干实时动作游戏中。

**指令缓存**

针对高级别的抽象指令（非前后可以覆盖的键盘操作），比如即时战略游戏中，各种高级操作指令，在“乐观帧锁定”中，客户端任何操作都是可靠消息发送到服务端，服务端缓存在对应玩家的指令队列里面，然后定时向所有人广播所有队列里面的历史操作，广播完成后清空队列，等待新的指令上传。客户端收到后按顺序执行这些指令，为了保证公平性，客户端可以先执轮询行每个用户的第一条指令，执行完以后弹出队列，再进入下一轮，直到没有任何指令。这样在即时战略游戏中，选择 250ms一个同步帧，每秒四次，已经足够了。如果做的好还可以象 AOE一样根据网速调整，比如网速快的时候，进化为每秒10帧，网速慢时退化成每秒4帧，2帧之类的。

————–

PS：可以把整段战斗过程的操作和随机数种子记录下来，不但可以当录像播放，还可以交给另外一台服务端延迟验算，还可以交给其他空闲的客户端验算，将验算结果的 hash值进行比较，如果相同则认可，如果不通则记录或者处理，服务端如果根据游戏当前进程加入一些临时事件（比如天上掉下一个宝箱），可以在广播的时候附带。

（完）

 21329 total views , 4 views today

 Like22 2

categories:[游戏开发](https://www.skywind.me/blog/topics/gamedev), [编程技术](https://www.skywind.me/blog/topics/program), [网络编程](https://www.skywind.me/blog/topics/network)Tags:[同步](https://www.skywind.me/blog/tags/%e5%90%8c%e6%ad%a5), [网络](https://www.skywind.me/blog/tags/%e7%bd%91%e7%bb%9c)

Comments (28)Trackbacks (7)[Leave a comment](https://www.skywind.me/blog/archives/131#respond)[Trackback](https://www.skywind.me/blog/archives/131/trackback)

1. ![zzpra](/images/posts/zzpra.jpg)
    
    ly
    
    April 13th, 2015 at 15:21 | [#1](https://www.skywind.me/blog/archives/131#comment-2641)
    
    Reply | Quote
    
    好文，有demo的源码可以分享下吗？
    
2. ![5rm70](/images/posts/5rm70.png)
    
    [skywind](http://www.skywind.me/blog)
    
    April 13th, 2015 at 19:25 | [#2](https://www.skywind.me/blog/archives/131#comment-2642)
    
    Reply | Quote
    
    [@ly](https://www.skywind.me/blog/archives/131#comment-2641)  
    我的演示是修改的mame，接管input部分，还有个server，过于零碎庞大了，其实思想很简单，就是上面几行，
    
3. ![54x2q](/images/posts/54x2q.jpg)
    
    terry
    
    May 12th, 2015 at 22:55 | [#3](https://www.skywind.me/blog/archives/131#comment-2701)
    
    Reply | Quote
    
    可以发一份这个算法的demo么，我有兴趣研究研究
    
4. ![w1sru](/images/posts/w1sru.png)
    
    [skywind](http://www.skywind.me/blog)
    
    May 12th, 2015 at 22:58 | [#4](https://www.skywind.me/blog/archives/131#comment-2703)
    
    Reply | Quote
    
    [@terry](https://www.skywind.me/blog/archives/131#comment-2701)  
    这个算法没有，太庞大了，修改的mime，零碎庞大，其实思想很简单，就是上面几行。
    
5. ![nwldp](/images/posts/nwldp.jpg)
    
    lswzzz
    
    March 12th, 2016 at 01:47 | [#5](https://www.skywind.me/blog/archives/131#comment-11938)
    
    Reply | Quote
    
    感谢博主提供这样的思路，非常有用，谢谢
    
6. ![ccjjl](/images/posts/ccjjl.jpg)
    
    bb
    
    May 7th, 2016 at 15:52 | [#6](https://www.skywind.me/blog/archives/131#comment-13577)
    
    Reply | Quote
    
    客户端a和b帧率能一致？帧率受机器性能影响
    
7. ![v3mw9](/images/posts/v3mw9.png)
    
    [skywind](http://www.skywind.me/blog)
    
    May 7th, 2016 at 23:20 | [#7](https://www.skywind.me/blog/archives/131#comment-13590)
    
    Reply | Quote
    
    [@bb](https://www.skywind.me/blog/archives/131#comment-13577)  
    逻辑帧和显示帧是分离的。
    
8. ![hz3i6](/images/posts/hz3i6.jpg)
    
    jayce
    
    May 11th, 2016 at 11:58 | [#8](https://www.skywind.me/blog/archives/131#comment-13671)
    
    Reply | Quote
    
    这里是比较适合单一操作的吧，比如左移一格，右移一格，这种简单操作。如果是那种按下按钮匀速移动，按下0.143秒，这种上传的操作数据是什么？是“方向，速度，时间”吗？
    
9. ![xjdl5](/images/posts/xjdl5.jpg)
    
    jayce
    
    May 11th, 2016 at 12:04 | [#9](https://www.skywind.me/blog/archives/131#comment-13672)
    
    Reply | Quote
    
    简单说就是：”每次关键帧回合，都会等待所有的玩家的输入过来，等待的过程就快的等待了延迟的玩家，每个回合开始的时候服务器都是一起给大家发送该回合的消息。“，”玩家收到的消息如果与上次处理的帧间隔小于5帧就等待5帧到了执行，超过了就立即执行“。
    
10. ![0totl](/images/posts/0totl.jpg)
    
    jayce
    
    May 11th, 2016 at 13:16 | [#10](https://www.skywind.me/blog/archives/131#comment-13673)
    
    Reply | Quote
    
    如果5帧内有2个操作，第一帧左移一格，第三帧右移动一格，那么显示帧是否也需要在第一帧左移一格，第三帧右移动一格，而不是在第一帧把左移和右移都操作了。
    
11. ![r25rs](/images/posts/r25rs.jpg)
    
    bb
    
    May 12th, 2016 at 13:02 | [#11](https://www.skywind.me/blog/archives/131#comment-13704)
    
    Reply | Quote
    
    [@skywind](https://www.skywind.me/blog/archives/131#comment-13590)  
    懂了，3ks
    
12. ![3rn81](/images/posts/3rn81.jpg)
    
    Smile
    
    June 23rd, 2016 at 15:37 | [#12](https://www.skywind.me/blog/archives/131#comment-14594)
    
    Reply | Quote
    
    请问乐观帧锁定方法中，服务端向客户端发数据的时间间隔是不是需要大于客户端网络通信的延迟时间？
    
13. ![xg4kk](/images/posts/xg4kk.png)
    
    [skywind](http://www.skywind.me/blog)
    
    June 23rd, 2016 at 15:52 | [#13](https://www.skywind.me/blog/archives/131#comment-14595)
    
    Reply | Quote
    
    [@Smile](https://www.skywind.me/blog/archives/131#comment-14594)  
    不需要，想间隔多少就间隔多少。
    
14. ![0cyhs](/images/posts/0cyhs.png)
    
    [skywind](http://www.skywind.me/blog)
    
    June 23rd, 2016 at 15:52 | [#14](https://www.skywind.me/blog/archives/131#comment-14596)
    
    Reply | Quote
    
    [@Smile](https://www.skywind.me/blog/archives/131#comment-14594)  
    街机三国每秒钟客户端上传25次，服务端下发50次，供你参考。
    
15. ![rt4dx](/images/posts/rt4dx.jpg)
    
    Smile
    
    June 23rd, 2016 at 20:19 | [#15](https://www.skywind.me/blog/archives/131#comment-14603)
    
    Reply | Quote
    
    [@skywind](https://www.skywind.me/blog/archives/131#comment-14596)  
    知道了 3QQQQ
    
16. ![ttdra](/images/posts/ttdra.jpg)
    
    blues
    
    July 11th, 2016 at 16:25 | [#16](https://www.skywind.me/blog/archives/131#comment-15251)
    
    Reply | Quote
    
    请问nextKeyFrame在算法中的意义是什么？
    
17. ![af3s5](/images/posts/af3s5.jpg)
    
    fins
    
    July 27th, 2016 at 21:50 | [#17](https://www.skywind.me/blog/archives/131#comment-15450)
    
    Reply | Quote
    
    您好, 我有两个疑问想请叫.
    
    1 您原文提到：『客户端只有按键按下或者放开，就会发送消息给服务端（而不是到每帧开始才采集键盘）』  
    .为什么不能 『每帧开始才采集』呢？ 如果这么做会有什么问题？
    
    2 文中提到 服务端只是转发客户端的按键状态（操作），或者是更高级的操作。 那如果服务端直接计算逻辑和状态（比如坐标 当前状态等），然后广播出去， 是否可行呢? 会有什么问题?
    
    谢谢
    
18. ![guy7c](/images/posts/guy7c.jpg)
    
    fins
    
    July 27th, 2016 at 21:53 | [#18](https://www.skywind.me/blog/archives/131#comment-15451)
    
    Reply | Quote
    
    网络出问题了, 一些重复发了好多次. 实在抱歉. 只保留 #16 就好. 谢谢 & Sorry
    
19. ![esx10](/images/posts/esx10.png)
    
    Tsubasa
    
    April 11th, 2017 at 14:50 | [#19](https://www.skywind.me/blog/archives/131#comment-23565)
    
    Reply | Quote
    
    很好的文章。不知道有没有可以相关同步算法的书籍或者资料可以推荐呢？
    
20. ![lkjg2](/images/posts/lkjg2.jpg)
    
    zcg
    
    July 21st, 2017 at 09:09 | [#20](https://www.skywind.me/blog/archives/131#comment-30502)
    
    Reply | Quote
    
    楼主你好，帧同步技术已经实现了， 现在最大的问题是 怎么检查客户端的不一致性。 有哪些可供参考的方案吗。  
    项目里面，经常会发现一段时间后 客户端的表现就不一样了，我想在出现这种情况时 能检测到。
    
21. ![e9por](/images/posts/e9por.jpg)
    
    mazi
    
    August 4th, 2017 at 00:54 | [#21](https://www.skywind.me/blog/archives/131#comment-31093)
    
    Reply | Quote
    
    [@skywind](https://www.skywind.me/blog/archives/131#comment-14596)  
    为什么客户端上传25次，而服务器下发50次？
    
22. ![ubdmw](/images/posts/ubdmw.jpg)
    
    Brock
    
    November 29th, 2017 at 22:25 | [#22](https://www.skywind.me/blog/archives/131#comment-42470)
    
    Reply | Quote
    
    你的demo不仅要接管输入 还要接管模拟器的时钟吧？
    
23. ![xaztt](/images/posts/xaztt.jpg)
    
    Brock
    
    November 29th, 2017 at 22:30 | [#23](https://www.skywind.me/blog/archives/131#comment-42471)
    
    Reply | Quote
    
    你的demo不仅要接管模拟器的输入还要接管模拟器的时钟吧？
    
24. ![ru6g2](/images/posts/ru6g2.jpg)
    
    zhangyuhui
    
    January 1st, 2018 at 10:13 | [#24](https://www.skywind.me/blog/archives/131#comment-46910)
    
    Reply | Quote
    
    谢谢你的思路，但是我有几个问题想要请教你，首先 比如你说的街机三国每秒钟客户端上传25次，服务端下发50次，是不是说客户端发送完数据之后，不需要等待当前服务端返回的数据包（也就是客户端发送一次等待服务端返回一次），如果不需要等待怎么确认当前的数据包是否被丢失了，如果需要等待那一秒50次，那就是20毫秒一次数据包，对于android渲染界面16毫秒那肯定会卡
    
25. ![gr2yr](/images/posts/gr2yr.jpg)
    
    小塔
    
    January 20th, 2018 at 19:57 | [#25](https://www.skywind.me/blog/archives/131#comment-48258)
    
    Reply | Quote
    
    关于帧同步游戏我有如下俩个问题 请教一下各位 不胜感激 帧同步游戏采用如下的策略 逻辑帧1-2客户端直接接收用户操作 然后发送给服务器 服务器在1-2帧的时候接受客户端的同步数据 主要是用户的操作 比如我按下了向右的按键 在第二帧的时候服务器广播接受到的客户端数据 客户端在2-3帧接受服务器端的广播数据 然后客户端在第三帧的时候统一执行操作 逻辑大概就是这样 在具体实现的过程中我遇到了如下的细节问题 1 客户端在第1-2帧接受用户操作 发送给服务器 理想状态是服务器端的1-2帧接受到了数据 但是如果这个操作发生在1帧晚些时候 服务器端就是在2-3帧才能接受到数据 在第3帧将这个数据广播出去 客户端在第四帧才能执行 这样造成的问题就是比如1-2帧有用户的俩个操作 但是服务器接受到的时候一个是在1-2帧 一个是在2-3帧 客户端执行的时候就是第3帧和第4帧了 如何才能处理这个问题 2 在1-2帧的时候我有俩个操作 按下左 抬起左 这是俩个操作 但是控制的是物体的一个属性 移动 这个时候如果不做特殊处理 那客户端看到的表现就是物体没有移动 而事实上我按下了左键并且抬起 只是时间很短 短于一个逻辑帧 我自己测试了一下 最快的时间间隔大概70毫秒 我的逻辑帧一帧是200毫秒 这样就造成了由于按键速度太快 导致用户的第二个操作覆盖了第一个操作 如何解决这个问题 这俩个问题困扰了我很久 希望大家能谈谈自己的看法
    
26. ![1ora7](/images/posts/1ora7.jpg)
    
    QQEat
    
    September 16th, 2018 at 17:23 | [#26](https://www.skywind.me/blog/archives/131#comment-66418)
    
    Reply | Quote
    
    @skywind 您好，感觉这个同步方法很好，但是感觉有点难懂。。能不能提供一个简单的范例呢。。
    
27. ![kkpfj](/images/posts/kkpfj.jpg)
    
    QQEat
    
    September 16th, 2018 at 17:25 | [#27](https://www.skywind.me/blog/archives/131#comment-66419)
    
    Reply | Quote
    
    [@QQEat](https://www.skywind.me/blog/archives/131#comment-66418)  
    您好，感觉这个同步方法很好，但是感觉有点难懂。。能不能提供一个简单的范例呢。。只要一个小球移动就可以了。。  
    刚刚没@上。。
    
28. ![4lrsc](/images/posts/4lrsc.jpg)
    
    NetCode
    
    June 4th, 2021 at 11:57 | [#28](https://www.skywind.me/blog/archives/131#comment-81790)
    
    Reply | Quote
    
    非常好的文章，很有启发性。但有些错字啊，”写自己的文章，让别人猜去吧。” 哈哈
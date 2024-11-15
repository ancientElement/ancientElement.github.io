---
title: TCP的一些问题
date: 2024-04-01
tags:
  - 随手记
  - 所想
---

频繁发送消息可能导致接收方面临以下问题：

消息堆积： 如果消息发送速率高于接收方处理消息的速率，消息可能会在接收方的缓冲区中堆积。这可能导致**缓冲区溢出**，使得部分消息丢失或被丢弃。

资源消耗： 高频率的消息接收会**增加系统资源的消耗**，包括CPU和内存。如果处理消息的速度跟不上消息的到达速度，系统可能会因资源不足而变得不稳定。

延迟增加： 如果接收方处理消息的速度跟不上消息的到达速度，消息在缓冲区中等待处理的时间会增加，导致消息的传输延迟增加。

响应性下降： 高频率的消息接收可能会**影响接收方对其他任务**的响应性能。如果接收方花费过多的时间处理消息，可能会影响到对其他事件或请求的及时响应。

网络拥塞： 高频率的消息发送可能会导致**网络拥塞**，特别是在网络带宽有限或者网络负载较高的情况下。这可能会影响到整个网络的性能，导致丢包、延迟增加等问题。

因此，在设计网络通信系统时，需要合理控制消息的发送频率，以避免以上问题的发生，保证通信的稳定性和可靠性。

## 处理

再Unity中如果处理的逻辑不影响Unity主线程可以用开新的线程。
---
title: TCP网络通信框架的讲解与使用
categories:
  - 实践
date: 2024-02-24
tags:
  - 实践
series:
  - 实践
---
## 客户端

### 1.消息基类`BaseMessage`

在消息基类中定义了得到**消息ID**、**消息长度**的函数，以便于我们后续解析消息，处理分包与粘包。

#### 派生类`BaseMessage<T>`

这个类的`T`泛型被约束为`Google.Protobuf.IMessage`,是`Protobuf`的基本消息类型，我们的`BaseMessage<T>`中保存着一个`data`是`T`类型用于承载数据。

```C#
public abstract class BaseMessage
{
	public abstract int GetByteLength();

	public abstract byte[] GetBytes();

	public abstract int GetMessageID();

	public abstract void WriteIn(byte[] buffer, int beginIndex,int length);
}

public abstract class BaseMessage<T> : BaseMessage where T : Google.Protobuf.IMessage,new()
{
	public T data = new T();

	public override int GetByteLength()
	{
		return 8 + (data == null ? 0 : data.CalculateSize());
	}

	public override byte[] GetBytes()
	{
		byte[] buffer = new byte[GetByteLength()];
		BitConverter.GetBytes(GetMessageID()).CopyTo(buffer, 0);
		BitConverter.GetBytes(GetByteLength()).CopyTo(buffer, 4);
		if (buffer.Length > 8)
			data.ToByteArray().CopyTo(buffer, 8);
		return buffer;
	}

	public override int GetMessageID()
	{
		throw new NotImplementedException();
	}

	public override void WriteIn(byte[] buffer, int beginIndex,int length)
	{
		throw new NotImplementedException();
	}
}
```

### 2.`NetAsyncMgr`网络管理器

这个类的作用是用来建立对服务器的`TCP`连接。

>值得一提的是这个网络管理器是完全用异步函数写的,这说明不会造成阻塞
>不会造成阻塞就可以**避免**开启其他线程执行任务，**避免**资源浪费

#### 连接

`public static void Connect(string host, int port)`

通过`Socket`来建立`TCP`连接，初始化本地`Socket`，为`SocketAsyncEventArgs`设置服务器端口，再添加连接成功（三次握手）之后的回调，在回调中开启异步接收。

```C#
 public static void Connect(string host, int port)
{
	if (isConnected) return;

	IPEndPoint SeveriPEndPoint = new IPEndPoint(IPAddress.Parse(host), port);
	m_socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

	SocketAsyncEventArgs argsConnect = new SocketAsyncEventArgs();
	argsConnect.RemoteEndPoint = SeveriPEndPoint;

	argsConnect.Completed += (socket, args1) =>
	{
		if (args1.SocketError == SocketError.Success)
		{
			Debug.Log($"连接成功: {host}:{port}");
			SendHeartMessage();
			//接收消息
			SocketAsyncEventArgs argsRecive = new SocketAsyncEventArgs();
			argsRecive.SetBuffer(bufferBytes, 0, bufferBytes.Length);
			argsRecive.Completed += Recive;
			m_socket.ReceiveAsync(argsRecive);
			isConnected = true;
		}
		else
		{
			Debug.Log($"连接失败:{args1.SocketError}");
		}
	};
	m_socket.ConnectAsync(argsConnect);
}
```

#### 发送

` public static void Send(BaseMessage info)`

这里同样使用异步函数，进行发送消息

```C#
public static void Send(BaseMessage info)
{
	if (m_socket != null && m_socket.Connected && isConnected)
	{
		byte[] bytes = info.GetBytes();

		SocketAsyncEventArgs argsSend = new SocketAsyncEventArgs();
		argsSend.SetBuffer(bytes, 0, bytes.Length);
		argsSend.Completed += (socket, args) =>
		{
			if (args.SocketError == SocketError.Success)
			{
			}
			else
			{
				Debug.Log($"{args.SocketError}");
				Close();
			}
		};
		m_socket.SendAsync(argsSend);
	}
	else
	{
		if (isConnected == true)
			Close();
	}
}
```

#### 接收消息

在建立好连接后立即开始了消息的接收，每一次接成功收到消息后**再次开启接收**异步函数。

接收到消息后我们对消息进行**处理**。

```C#
private static void Recive(object socket, SocketAsyncEventArgs args)
{
	if (args.SocketError == SocketError.Success)
	{
		int bytesLength = args.BytesTransferred;

		HandleReceiveMessage(bytesLength);

		//接收消息
		if (socket != null && m_socket.Connected && isConnected)
			args.SetBuffer(bufferLenght, bufferBytes.Length);
		m_socket.ReceiveAsync(args);
	}
	else
	{
		Debug.Log($"{args.SocketError}");
		if (isConnected == true)
			Close();
	}
}
```

#### 处理消息

用`Try Catch`进行异常捕获，并在接收消息时进行处理分包和粘包现象。

在`Connect`函数中，设置了接收到的消息的储存位置 `argsRecive.SetBuffer(bufferBytes, 0, bufferBytes.Length);`从`bufferBytes`的第零位开始存储，大小为`bufferBytes`的长度。

- **bufferLenght**是待处理的消息长度，将`bufferLenght+=reciveLength`
- 循环
	- 当`bufferLenght >= 8`的时候才能够解析出**消息ID**、**消息长度**，否则不是一个完整的消息。
	- `bufferLenght - currentIndex >= messageBodyLength && massageID != -1`如果解析出消息，且接收到的消息长度**大于**解析到的消息长度，那么可以解析
		- 根据ID**实例化**一个消息
		- 通过接收到的数据**反序列化**消息
		- 将消息推进消息队列
		- `currentIndex += messageBodyLength`
		- `if (currentIndex == bufferLenght)`判断是否还有剩余的消息
			- 没有`bufferLenght`置零
			- 结束循环
		- `else`
			- 还有字节没有解析，说明发生了**粘包**
			- 继续循环解析
	- 否则接收到的消息长度**小于**解析到的消息长度，发生了**分包**
		- 将当前接受的**残缺的消息**放到`bufferLenght`的开头
		- 消息长度设置为**残缺的消息**的长度
		- 停止循环，这样等待到下一个消息接收到就可以拼接成完整消息

```C#
 private static void HandleReceiveMessage(int reciveLength)
{
	try
	{
		if (reciveLength == 0) return;

		//处理
		int massageID = -1;
		int messageBodyLength = 0;
		int currentIndex = 0;


		bufferLenght += reciveLength;

		while (true) //粘包
		{
			if (bufferLenght >= 8)
			{
				//ID
				massageID = BitConverter.ToInt32(bufferBytes, currentIndex);
				currentIndex += 4;
				//长度
				messageBodyLength = BitConverter.ToInt32(bufferBytes, currentIndex) - 8;
				currentIndex += 4;
			}

			if (bufferLenght - currentIndex >= messageBodyLength && massageID != -1)
			{
				//消息体 
				BaseMessage baseMassage = MessagePool.GetMessage(massageID);
				baseMassage.WriteIn(bufferBytes, currentIndex, messageBodyLength);

				reciveMessageQueue.Enqueue(baseMassage);

				currentIndex += messageBodyLength;
				if (currentIndex == bufferLenght)
				{
					bufferLenght = 0;
					break;
				}
			}
			else //分包
			{
				Array.Copy(bufferBytes, currentIndex - 8, bufferBytes, 0, bufferLenght - currentIndex + 8);
				bufferLenght = bufferLenght - currentIndex + 8;
				break;
			}
		}
	}
	catch (Exception e)
	{
		Console.WriteLine($"消息解析出错: {e.Message}");
	}
}
```

#### 消息分发

>注意哦：要调用MsgUpdate这个消息才会开启消息分发的哦
>可以考虑用其他线程来处理消息

在`MsgUpdate`循环中
- 如果消息队列为空返回
- 循环`MAX_MESSAGE_FIRE`次
	- 从队列中取一条消息
	- 取到了解析消息
	- 取不到，队列为空，结束循环

```C#
public static void MsgUpdate()
{
	//初步判断，提升效率
	if (reciveMessageQueue.Count == 0)
	{
		return;
	}

	//重复处理消息
	for (int i = 0; i < MAX_MESSAGE_FIRE; i++)
	{
		//获取第一条消息
		BaseMessage msgBase = null;
		lock (reciveMessageQueue)
		{
			if (reciveMessageQueue.Count > 0)
			{
				msgBase = reciveMessageQueue.Dequeue();
			}
		}

		//分发消息
		if (msgBase != null)
		{
			listeners[msgBase.GetMessageID()]?.Invoke(msgBase);
		}
		//没有消息了
		else
		{
			break;
		}
	}
}
```

#### 添加网络消息监听

一个键为**消息ID**，值为**事件**的字典。

```C#
//监听消息
private static Dictionary<int, Action<BaseMessage>> listeners = new Dictionary<int, Action<BaseMessage>>();
```

通过以下函数添加、移除事件监听：

```C#
/// <summary>
/// 添加消息监听
/// </summary>
/// <param name="messageID"></param>
/// <param name="callback"></param>
public static void AddNetMessageListener(int messageID, Action<BaseMessage> callback)
{
	if (listeners.ContainsKey(messageID))
		listeners[messageID] += callback;
	else
		Debug.LogWarning("没有这个消息类型" + messageID);
}

/// <summary>
/// 移除网络消息监听
/// </summary>
/// <param name="messageID"></param>
/// <param name="callback"></param>
public static void RemoveNetMessageListener(int messageID, Action<BaseMessage> callback)
{
	if (listeners.ContainsKey(messageID))
		listeners[messageID] -= callback;
	else
		Debug.LogWarning("没有这个消息类型" + messageID);
}
```

### 3.消息生成器与消息池

#### 消息生成

![](/images/posts/Pasted%20image%2020240224200037.png)

通过编写`Proto`文件来定义消息。

如果你知道`Protobuf`那么请使用其语法编写你需要的消息类,例如：

```C#
 syntax = "proto3";  
 package NetGameRunning;  
 message GlobalChatData {  
     string chat_words = 1;  
 }  
 message EmptyMessageData {  
     float x = 1;  
     float y = 2;  
     float z = 3;  
     float ex = 4;  
     float ey = 5;  
     float ez = 6;  
 }
```

并且我们需要一个`XML`文件来进行`消息ID`和`Proto类`的映射,例如：

```XML
<messages>
    <message id="1" systemMessage="1" name="QuitMessage" namespace="NetSystem" />
    <message id="2" systemMessage="1" name="HeartMessage" namespace="NetSystem" />
    <!-- 以下是示例文件中的消息,不需要使用示例代码可以删除 -->
    <message id="10002" systemMessage="0" name="ChatMessage" namespace="NetGameRunning"
        datatype="NetGameRunning.GlobalChatData" />
    <message id="10003" systemMessage="0" name="EmptyMessage" namespace="NetGameRunning"
        datatype="NetGameRunning.EmptyMessageData" />
</messages>
```

`id`：消息ID
`namespace`：命名空间，对应`proto`中的`package`
`name`：消息类名(自己定义的,注意**不要**与`proto`中的`message`相同)
`datatype`：消息中`data`（上文中提到过是`BaseMessage`中的泛型`T`），一般是对应`proto`中的`package.message`

最后我们指定**生成位置**和**proto.exe**位置后,依次点击**生成消息类**,**生成消息池**

#### 消息池

```C#
public static class MessagePool
{
	public static int QuitMessage_ID = 1;
	public static int HeartMessage_ID = 2;
	public static int ChatMessage_ID = 10002;
	public static int EmptyMessage_ID = 10003;
	static int[] messageIDs = new int[] { 1, 2, 10002, 10003 };
	public static int[] MessageIDs => messageIDs;
	private static readonly System.Collections.Generic.Dictionary<int, System.Func<BaseMessage>> MessageTypeMap = new System.Collections.Generic.Dictionary<int, System.Func<BaseMessage>>
	{
		{1,() => new NetSystem.QuitMessage()},
		{2,() => new NetSystem.HeartMessage()},
		{10002,() => new NetGameRunning.ChatMessage()},
		{10003,() => new NetGameRunning.EmptyMessage()}
	};
	public static BaseMessage GetMessage(int id)
	{
		if (MessageTypeMap.TryGetValue(id, out System.Func<BaseMessage> messageFactory)) { return messageFactory?.Invoke(); }
		return null;
	}
}
```

这个消息池类由**代码生成**，使用了一个**字典**，用初始化的方式将**消息ID**和**消息类型**映射，通过消息ID返回一个对应类型，以便正确地**解析消息**。

## 服务器

>服务器采用**全异步方式编写**，避免阻塞线程，避免**开启其他线程**增加开销

### 开启服务器 `ServerSocket`

在`Start`函数里面

- 初始化了`socket`
- 并且开启了接收客户端连接，并且传入连接成功后的回调

```C#
public void Start(string ip, int port, int num)
{
	this.socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
	IPEndPoint ipEndPoint = new IPEndPoint(IPAddress.Parse(ip), port);
	try
	{
		socket.Bind(ipEndPoint);
		socket.Listen(num);
		this.socket.BeginAccept(Accept, this.socket);
	}
	catch (Exception e)
	{
		Console.WriteLine($"服务器开启失败: {e.Message}");
	}
}
```

在`Accept`函数中

- 将连接的客户端加入`clientSockets`列表
- 继续接收客户端连接

```C#
private void Accept(IAsyncResult result)
{
	try
	{
		Socket clientSocket = this.socket.EndAccept(result);
		ClientSocket client = new ClientSocket(clientSocket);
		clientSockets.Add(client.clientID, client);

		Console.WriteLine($"客户端[{clientSocket.RemoteEndPoint}]连接服务器");

		this.socket.BeginAccept(Accept, this.socket);
	}
	catch (Exception e)
	{
		Console.WriteLine($"客户端接入失败: {e.Message}");
	}
}
```

### ClientSocket

这里的`ClientSocket`与客户端中的`ClientSocket`没有太大区别

仅有的不同之处`ThreadPool.QueueUserWorkItem(HandleMassage, baseMassage);`，这里用线程池来处理消息，消息处理方式也是仅仅将**消息分发**出去。

>其实感觉Unity哪里也可以用线程池
>但是有一个问题就是线程太多了
>还有在Unity中用多线程总归不太好，因为只能从主线程访问Unity相关组件、对象以及UnityEngine命名空间中的绝大部分内容


```C#
private void HandleReceiveMessage(int bytesLength)
{
	//省略...

	while (true)//粘包
	{
		if (bufferLenght >= 8)
		{
			//省略...
		}

		if (bufferLenght - currentIndex >= massageBodyLength && massageBodyLength != -1 && massageID != -1)
		{
			//消息体 
			BaseMessage baseMassage = MessagePool.GetMessage(massageID);

			if (baseMassage != null)
			{
				//省略...

				ThreadPool.QueueUserWorkItem(HandleMassage, baseMassage);
			}

			//省略...
		}
		else//分包
		{
				//省略...
		}
	}
}
```

### 消息监听

```C#
public static void AddNetMessageListener(int messageID, Action<BaseMessage> callback)
{
	if (listeners.ContainsKey(messageID))
		listeners[messageID] += callback;
	else
		Debug.LogWarning("没有这个消息类型" + messageID);
}

public static void RemoveNetMessageListener(int messageID, Action<BaseMessage> callback)
{
	if (listeners.ContainsKey(messageID))
		listeners[messageID] -= callback;
	else
		Debug.LogWarning("没有这个消息类型" + messageID);
}
```

同样的，使用`AddNetMessageListener`和`RemoveNetMessageListener`对消息进行添加监听和移除。

>消息ID可以根据**消息池**来获取
>例如：`MessagePool.LoginMessage_ID`




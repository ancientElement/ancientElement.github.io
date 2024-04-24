---
title: leetcode232用栈实现队列
date: 2023-11-11
tags:
  - leetcode刷题
  - 栈
---

![](/images/posts/leetcode232用栈实现队列_231111_153421.pdf)

//TODO:等待完善PDF

```cs
class MyQueue {
public:
    stack<int> stIn;
    stack<int> stOut;
    MyQueue() {

    }
    void push(int x) {
        stIn.push(x);
    }
    int pop() {
        //这里之前写成了 if(!stOut.empty())
        if(stOut.empty()) {
            //push进stOut;
            while(!stIn.empty()) {
                stOut.push(stIn.top());
                stIn.pop();
            }
        }
        int result = stOut.top();
        stOut.pop();
        return result;
    }
    int peek() {
        int result = this->pop();
        stOut.push(result);
        return result;
    }
    bool empty() {
        return stOut.empty() && stIn.empty();
    }
};
```
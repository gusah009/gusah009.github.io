---
date: '2022-07-06'
title: '[item12] toString을 항상 재정의하라'
categories: ['effective_java']
summary: '`java`에서는 어떤 객체를 문자열로 출력할 때를 대비해서 `toString` 메서드를 지원합니다. 하지만 `Object` 클래스에서 기본적으로 제공하는 `toString`메서드는 아래와 같이 클래스의 이름과 해당 객체의 해쉬코드를 반환하기 때문에 알아보기 힘듭니다.'
thumbnail: './effective_java_thumb.png'
---

> **toString을 항상 재정의하라**

`java`에서는 어떤 객체를 문자열로 출력할 때를 대비해서 `toString` 메서드를 지원합니다. 하지만 `Object` 클래스에서 기본적으로 제공하는 `toString`메서드는 아래와 같이 클래스의 이름과 해당 객체의 해쉬코드를 반환하기 때문에 **알아보기 힘듭니다.**

<script src="https://gist.github.com/gusah009/5dd37eaa571a414668bc269ab019c38c.js"></script>

보통 사용자가 객체를 문자열로 출력할 때 원하는 것은 각 필드엔 어떤 값이 있는지, 혹은 사람이 알아 보기 쉬운 객체의 정보를 원합니다. 따라서 책의 저자는 될 수 있으면 반드시 `toString`을 재정의하라고 하고 있습니다.

## toString을 재정의 할 때 주의할 점
toString으로 재정의 할 때에는 반드시 객체의 모든 정보를 정확하게 전달해야 합니다. 아래의 예시로 문제를 살펴보겠습니다.

> Assertion Failure : expected **{abc, 123}**, but was **{abc, 123}**.

출력값만 봐서는 같은 {abc, 123}인데 어디서 다른건지 알 수 없습니다. 위와 같은 문제 때문에 저자는 **반드시 객체의 모든 정보를 확실하게 전달하라고 얘기하고 있습니다.**


> ## lombok 사용을 권장합니다.
요즘은 IDE에서 해당 기능을 잘 지원해주기도 하고, `lombok`에서 `toString`을 제공해주기 때문에 이를 사용하길 권장합니다. `lombok`에서 지원해주는 `toString`을 권장하는 이유는, `toString`을 단순히 오버라이딩 했다가, 만약에 해당 객체의 필드가 변하거나 새로 생기고 `toString`을 재정의해주지 않는 경우가 생길 수 있기 때문입니다. `lombok`은 이런 문제를 사전에 예방해줍니다.





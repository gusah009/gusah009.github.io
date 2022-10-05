---
date: '2022-06-29'
title: '[item9] finalizer와 cleaner 사용을 피하라'
categories: ['effective_java']
summary: '`Java`에는 직접 닫아줘야 하는 자원이 많습니다. 예를 들면 `InputStream`, `OutputStream`, `java.sql.Connection`등이 그 예시입니다.'
thumbnail: './effective_java_thumb.png'
---

> **try-finally 보다는 try-with-resources를 사용하라**

`Java`에는 직접 닫아줘야 하는 자원이 많습니다. 예를 들면 `InputStream`, `OutputStream`, `java.sql.Connection`등이 그 예시입니다. 만약 닫아야 하는 자원임에도 닫지 않고 방치해둔다면 [item8]에서 봤던 문제가 발생하기도 합니다.

## 옛날 수단: `try-finally`
옛날에는 자원의 닫힘을 보장하는 수단으로 `try-finally`가 많이 쓰였습니다. 하지만 두 개 이상의 자원을 닫을 일이 있다면 아래 코드와 같이 **매우 지저분해집니다.**

<script src="https://gist.github.com/gusah009/84bf80bd76b5f62a05f94a4cd6abf0e1.js"></script>

자원이 만약 3개, 4개, ... 그 이상으로 많아진다면 더더욱 지저분해질 것입니다. 이를 위해 `Java7`부터 `try-with-resources`가 등장하게 되었습니다.

## 요즘 수단: `try-with-resources`
위의 코드에 `try-with-resources`를 적용한 코드입니다.

<script src="https://gist.github.com/gusah009/88d1a1939e82ede405bd06af4a7e283e.js"></script>

물론, 앞선 `try-finally`와 마찬가지로 `catch`문도 적용하여 쓸 수 있습니다.

## 그 외 장점
앞선 코드를 통해 `try-with-resources`를 사용하면 코드가 간단해짐을 보았습니다. 그 외에 다른 장점 역시 존재합니다.

만약 앞선 `try-finally`코드에서 물리적인 문제가 생기면 `copy` 메서드 안의 `read()` 메서드가 예외를 던질 것이고, 그렇게 되면 `close()`메서드 역시 실패하게 됩니다. 이 때 첫 번째 예외를 완전히 삼켜버리게 되서 **실제 시스템에서 디버깅을 어렵게 합니다.**

하지만 `try-with-resources`를 사용한 코드에서 문제가 생기면 `close()`에서 발생한 예외는 숨겨지고, `read()` 메서드에서 일어난 예외가 기록됩니다. 물론 이렇게 숨겨진 예외들도 그냥 버려지지는 않고 스택 추적 내역에 '숨겨졌다(suspressed)'는 꼬리표를 달고 출력됩니다.

## 요약
**예외는 없습니다.** 어떠한 경우에도 `try-with-resources`가 `try-finally` 코드보다 낫습니다.
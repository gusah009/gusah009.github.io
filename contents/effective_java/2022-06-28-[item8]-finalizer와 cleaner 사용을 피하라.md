---
date: '2022-06-28'
title: '[item8] finalizer와 cleaner 사용을 피하라'
categories: ['effective_java']
summary: '`Java`의 소멸자로 불리는 `finalizer`와 `cleaner`는 흔히 아는 `C++`과 다릅니다. 본래 소멸자는 소멸자를 호출한 객체와 연관 된 자원을 회수하는 역할을 합니다. 하지만 `Java`에선 기본적으로 GC가 그 역할을 해줍니다. '
thumbnail: './effective_java_thumb.png'
---

> **finalizer와 cleaner 사용을 피하라**

`Java`의 소멸자로 불리는 `finalizer`와 `cleaner`는 흔히 아는 `C++`과 다릅니다. 본래 소멸자는 소멸자를 호출한 객체와 연관 된 자원을 회수하는 역할을 합니다. 하지만 `Java`에선 기본적으로 GC가 그 역할을 해줍니다. 

간혹 GC가 자동적으로 해제해주는 걸 기다리는 것 보다 **빨리 해제해 줄 필요가 있습니다.**

## 사용을 자제하자
위에서 말한 것 처럼 메모리에서 빠르게 해제해 줄 필요가 있을 때 `finallizer`나 `cleaner`같은 소멸자를 사용할 수 있습니다. 하지만 책에서 저자는 기본적으로 **쓰지 말아야 한다**고 말합니다. 대신 `try-with-resources`를 권장하고 있습니다.

> `try-with-resources` 는 이후 [item9]에서 나옵니다.

저자는 쓰지 말아야 할 이유로 몇 가지를 들고 있습니다.
1. **언제 호출될 지 모릅니다.**
2. **느립니다.**
3. **일반적으로 불필요합니다.**

### 1. 언제 호출될 지 모릅니다.
`finalizer`나 `cleaner`의 수행 시점은 전적으로 GC 알고리즘에 달려있습니다. 만약 당장 해제해야 하는 객체들 *(파일 시스템이나 DB Lock같은)* 은 `finalizer`나 `cleaner`에서 즉각 해제되리라는 보장이 없습니다.

또, 만약 `finalizer`나 `cleaner`가 수행되는 도중에 `Exception`이 발생하면 해당 객체는 마무리가 덜 된 상태로 남아 있을 수 있습니다.

### 2. 느립니다.
저자가 직접 테스트 해봤을 때 `try-with-resources`로 객체를 수거하는 게 `finalizer`로 객체를 수거하는 것보다 50배정도 빨라졌다고 말합니다.

### 3. 일반적으로 불필요합니다.
파일이나 스레드같이 종료해야 할 자원을 담고 있는 객체의 클래스에서 자원을 수거하는 다른 방법은 바로 **AutoCloseable을 구현**해주고 `close` 메서드를 호출하는 것입니다. `close` 메서드는 이 객체가 더 이상 유효하지 않음을 필드에 기록하고, 객체가 닫힌 후에 불렸다면 `IllegalStateException`을 호출하는 방식으로 자신이 닫혔음을 알려줍니다.

## `finallizer`, `Cleaner` 어디에 써야하는 걸까?
지금까지 단점만 나열했지만 `finallizer`와 `cleaner` 역시 쓰임새가 있습니다. 바로 안전망 역할을 해주는 것입니다. 아예 회수가 안되는 것 보단, 늦게라도 회수가 되는 것이 낫습니다. 그럴 때 안전망 역할로 사용합니다.

`FileInputStream`, `FileOutputStream`, `ThreadPoolExecutor`가 안전망 역할의 `finallzer`를 제공하는 대표적인 클래스입니다.

### 안전망 역할로서 `Cleaner`의 사용

<script src="https://gist.github.com/gusah009/ac0149528b2ca3c2d11685109514f417.js"></script>

위와 같이 `AutoCloseable`을 구현한 `Room` 클래스가 있다고 가정하겠습니다. 해당 클래스는 생성자에서 `cleaner`에 자기 자신과 청소가 필요한 자원인 `State`를 등록하고 있습니다. 이후 해당 클래스가 `close()`될 때 `State.run()`을 수행합니다.

이는 단순히 안전망 역할만 합니다. 당연히 `try-with-resources` 블럭으로 감쌌다면 즉시 해당 자원이 해제되기 때문에 안전망이 필요하지 않습니다. 아래는 안전망이 필요하지 않은 예시와 그 결과입니다.

<script src="https://gist.github.com/gusah009/997b4abb237a3574d695b82f577def83.js"></script>

```
어른
방 청소
```

<script src="https://gist.github.com/gusah009/dab4e7d54b368af4417cc488f15eea6b.js"></script>

```
아이
```

어른 클래스에선 즉시 방 청소가 일어났지만, 아이 클래스에선 방 청소가 일어나지 않았습니다. 실제 `Cleaner`의 명세엔 다음과 같이 기재되어 있습니다.
> `System.exit`을 호출할 때의 `cleaner` 동작은 구현하기 나름입니다. 청소가 이뤄질 지는 보장하지 않습니다.

## 요약
**`Cleaner`(자바 8까지는 `finalizer`)**는 안전망 역할이나 중요하지 않은 네이티브 자원 회수용으로만 사용합시다. 물론 이런 경우에도 불확실성과 성능 저하에 주의해야 합니다.

---
date: '2022-07-11'
title: '[item16] public 클래스에서는 public 필드가 아닌 접근자 메서드를 사용하라'
categories: ['effective_java']
summary: '클래스의 필드는 되도록이면 `public`이어선 안됩니다. 그 이유에 대해 아래에 풀어나가도록 하겠습니다.'
thumbnail: './effective_java_thumb.png'
---

> **public 클래스에서는 public 필드가 아닌 접근자 메서드를 사용하라**

지금까지 누차 말했던 내용들이 정리 된 파트입니다. 클래스의 필드는 되도록이면 `public`이어선 안됩니다. 그 이유에 대해 아래에 풀어나가도록 하겠습니다.

## 객체지향적 관점
`public`으로 선언 한 데이터 필드는 **캡슐화**의 이점을 얻지 못합니다. `public`으로 선언하게 되면, 공개하고 싶지 않은 정보는 숨기고, 공개하고자 하는 내용만 보여주는 **캡슐화**의 원칙을 지킬 수 없게 됩니다. 또, API를 수정하지 않고 내부 표현을 바꿀 수 없으며, **불변식을 보장할 수 없습니다.** 그래서 자바빈 규약에서와 같이 `getter`, `setter`로 접근하길 권장하고 있습니다.

## package-private, private nested 클래스
클래스가 `private nested 클래스`거나 `package-private`라면 `public` 필드를 허용한다고 저자는 밝히고 있습니다. 필드를 `public`으로 바꾼다고 해서 외부로 노출되는 API에 영향이 가는 것도 아니고, 코드 작성자가 얼마든지 내부 구조를 바꿀 수 있기 때문입니다.

## 자바 플랫폼 라이브러리에서 규약을 어긴 사례
실제로 `java.awt.package`의 `Dimension` 클래스에서 위 규약을 어기고 있습니다. 아래 코드를 보면 필드를 `public`으로 열어놨는데 이 실수로 인한 심각한 성능 문제는 오늘날까지도 해결되지 못했습니다.

```java
public class Dimension extends Dimension2D implements java.io.Serializable {

  public int width;
  public int height;
}
```

## 요약
`public` 클래스는 절대 가변 필드를 직접 노출해서는 안됩니다. 불변 필드라면 노출해도 덜 위험하지만 완전히 안심할 수는 없습니다. 하지만 `package-private` 클래스나 `private` 중첩 글래스에서는 종종 필드를 노출하는 편이 나을 때도 있습니다.
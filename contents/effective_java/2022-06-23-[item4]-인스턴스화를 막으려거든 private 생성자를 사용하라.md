---
date: '2022-06-23'
title: '[item4] 인스턴스화를 막으려거든 private 생성자를 사용하라'
categories: ['effective_java']
summary: '가끔 정적 메서드와 정적 필드만을 담은 클래스를 만들고 싶을 때가 있습니다. 저자는 이런 클래스를 남용하는 것을 곱게 보고 있진 않지만, 분명 쓰임새가 있다고 말합니다.'
thumbnail: './effective_java_thumb.png'
---

> **인스턴스화를 막으려거든 private 생성자를 사용하라**

가끔 정적 메서드와 정적 필드만을 담은 클래스를 만들고 싶을 때가 있습니다. 저자는 이런 클래스를 남용하는 것을 곱게 보고 있진 않지만, 분명 쓰임새가 있다고 말합니다. 그 예시로 `java.lang.Math`, `java.util.Arrays`와 같이 관련 메서드들을 모아놓을 수도 있고, `java.util.Collections`처럼 특정 인터페이스를 구현하는 객체를 생성해주는 정적 메서드를 모아놓을 수도 있다고 말합니다. 또 `final`클래스를 상속해서 하위 클래스에 메서드를 넣는 게 불가능하기 때문에 `final`클래스와 관련한 메서드들을 모아놓을 때도 사용합니다.

아래는 실제 java에서 제공하는 `Arrays`, `Collections`코드의 일부를 가져온 것입니다.
```java
public class Arrays {

  // Suppresses default constructor, ensuring non-instantiability.
  private Arrays() {}
  
  public static void sort(int[] a) {
    DualPivotQuicksort.sort(a, 0, 0, a.length);
  }
}
```
<br>

```java
public class Collections {
  
  // Suppresses default constructor, ensuring non-instantiability.
  private Collections() { }
  
  static class SynchronizedSet<E> extends SynchronizedCollection<E> implements Set<E> {
    @java.io.Serial
    private static final long serialVersionUID = 487447009682186044L;

    (...) // 중략
  }
}
```

`Collections`는 `Set` 인터페이스를 실제 구현하고 있음을 볼 수 있습니다.

위의 두 코드에서 공통점을 발견하셨나요?

## `private` 생성자를 사용해 인스턴스화를 막자!

네, 바로 `private` 생성자를 호출해주고 있다는 것입니다. 하위 클래스를 만들어서 인스턴스화 할 수 있기 때문에 앞서 말한 **추상 클래스로 만드는 것 만으론 인스턴스화를 막을 수 없습니다.** 만약 `private` 생성자를 호출해주지 않는다면 컴파일러가 자동으로 `public` 생성자를 만들어 줍니다. 이는 해당 클래스를 사용하는 사용자들은 상속을 해서 써도 된다고 판단할 수도 있습니다.

```java
public class MyDate {
  
  // 기본 생성자가 만들어지는 것을 막는다(인스턴스화 방지용).
  private MyDate() {
    throw new AssertionError();
  }
}
```

### 주석을 달아 혼동을 막자!
위의 코드들을 보면, `private`생성자 위에 주석을 달아줌으로서 사용자들에게 클래스에 생성자가 존재하지만 생성할 수 없음을 명확히 알려주고 있습니다. 저자는 주석으로 명시해 주길 권장하고 있습니다.

### 상속을 막는 효과
또, 상속을 막는 효과를 가져올 수 있습니다. 모든 생성자는 상위 클래스의 생성자를 호출하게 되는데, 이게 `private`으로 막혀 있어서 하위 클래스가 상위 클래스의 생성자에 접근할 길이 막혀버립니다. **이는 곧 상속을 막는 효과를 가져옵니다.**

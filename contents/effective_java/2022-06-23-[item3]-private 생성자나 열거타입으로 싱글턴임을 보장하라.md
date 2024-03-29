---
date: '2022-06-23'
title: '[item3] private 생성자나 열거타입으로 싱글턴임을 보장하라'
categories: ['effective_java']
summary: '저자는 싱글턴을 만들 때 private 생성자나 열거타입(enum)으로 만들길 권장하고 있습니다. 그 이유에 대해 알아보겠습니다.'
thumbnail: './effective_java_thumb.png'
---

> **private 생성자나 열거타입으로 싱글턴임을 보장하라**

저자는 싱글턴을 만들 때 private 생성자나 열거타입(enum)으로 만들길 권장하고 있습니다. 그 이유에 대해 알아보겠습니다.
> **싱글턴**: 인스턴스를 오직 하나만 생성할 수 있는 클래스를 말한다.

싱글턴을 만드는 방식엔 총 3가지가 있습니다.
1. `public static final` 필드 방식의 싱글턴
2. 정적 팩터리 메서드를 사용하는 방식의 싱글턴
3. **열거 타입 방식의 싱글턴**

결론부터 말씀드리면, 저자가 생각하는 가장 좋은 싱글턴 패턴은 **열거 타입**을 사용하는 것입니다. 위의 싱글턴을 만드는 방식에 대해 하나하나 알아보면서 각각 어떤 장단점이 있는 지 알아보겠습니다.

## public static final 필드 방식의 싱글턴
```java
public class MyDate {

  public static final MyDate INSTANCE = new MyDate();
  private MyDate() {} // private 생성자

  public long getNextMonth() {...}
}
```

`private` 생성자는 `MyDate.INSTANCE`를 생성할 때 단 한번만 호출되고, `public`이나 `protected` 생성자가 없기 때문에 항상 시스템엔 `MyDate`의 객체가 하나임이 보장됩니다. 하지만 `setAccessible`이란 리플렉션 API를 사용하면 `private` 생성자를 호출할 수 있는데, 이 내용에 대해선 뒤에 배웁니다.

### 장점
해당 클래스가 싱글턴임이 API에 명백히 드러난다는 장점이 있습니다. public static 필드가 final이니 절대 다른 객체를 참조할 수 없음을 한 눈에 확인할 수 있습니다. 또 간결함이 가장 큰 장점입니다.

## 정적 팩터리 메서드 방식의 싱글턴
```java
public class MyDate {

  private static final MyDate INSTANCE = new MyDate();
  private MyDate() {} // private 생성자
  public static MyDate getInstance() { return INSTANCE; }

  public long getNextMonth() {...}
}
```

`INSTANCE`가 `private`이기 때문에 이를 호출하는 방식은 `getInstance()`밖에 없습니다. 위와 무슨 차이가 있는거지? 하실 수 있기 때문에 아래에서 정적 팩터리 메서드 방식의 장점을 바로 살펴보겠습니다.

### 장점
위 방식의 장점은 마음이 바뀌면 API를 바꾸지 않고도 싱글턴이 아니게끔 변경할 수 있습니다. 클라이언트 코드에선 `getInstance()`로 instance를 불러오기 때문에 **이게 싱글턴인지, 아니면 다른 어떤 객체인 지 알지 않아도 됩니다.** 

두 번째 장점은 원한다면 정적 팩터리를 제네릭 싱글턴 팩터리로 만들 수 있다는 점입니다. 제네릭 싱글턴 팩터리에 대해선 이후 `[item30]`에서 배웁니다.

마지막 장점은 정적 팩터리 메서드 참조를 공급자(supplier)로 사용 할 수 있다는 점입니다. `Supplier<INSTANCE>`로도 쓸 수 있다는 장점이 있습니다.

### 위의 두 방식의 단점
하지만 위의 두 방식 모두 단점이 존재합니다. 바로 직렬화할 때의 문제인데, 보통 직렬화를 구현하기 위해 우리는 `Serializable` 인터페이스를 구현해 사용합니다. 하지만 이 방식만으로 객체를 직렬화하고, **역직렬화해서 객체를 사용하게 되면 새로운 인스턴스가 만들어 집니다.** 즉, 싱글턴이 보장되지 않는다는 것입니다. 이런 가짜 인스턴스를 막기 위한 방법이 존재하는데, 이는 이후 `[item89]`에서 살펴보겠습니다.

## 열거 타입 방식의 싱글턴
결국 저자가 권유하는 싱글턴 생성 방식은 열거타입(enum)입니다.
```java
public enum MyDate {
  BIRTHDAY, HAPPY_DAY;

  public long getNextMonth() {...}
}
```

아래와 같이 특정 `Instance`를 싱글턴 형식으로 사용할 수 있으며, 앞서 봤던 단점들인 아주 복잡한 직렬화 상황이나 리플렉션 공격에서도 제2의 인스턴스가 생기는 일을 완벽히 막아줍니다. 저자는 **부자연스러워 보일 순 있지만 대부분의 상황에서 원소가 하나뿐인 열거 타입이 싱글턴을 만드는 가장 좋은 방법**이라고 말하고 있습니다.

### 단점
단, 만드려는 싱글턴이 Enum 외의 클래스를 상속해야 한다면 이 방법은 사용할 수 없다는 단점이 있습니다.

### Ref.
[https://junha.tistory.com/25](https://junha.tistory.com/25)
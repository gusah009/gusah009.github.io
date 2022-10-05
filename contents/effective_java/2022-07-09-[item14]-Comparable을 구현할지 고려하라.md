---
date: '2022-07-09'
title: '[item14] Comparable을 구현할지 고려하라'
categories: ['effective_java']
summary: '`Java`에는 `Comparable` 인터페이스가 존재합니다. 이 인터페이스는 `compareTo()`라는 메서드만을 가지고 있고, 이를 구현한 클래스의 인스턴스들에는 자연적인 순서가 있음을 뜻합니다.'
thumbnail: './effective_java_thumb.png'
---

> **Comparable을 구현할지 고려하라**

`Java`에는 `Comparable` 인터페이스가 존재합니다. 이 인터페이스는 `compareTo()`라는 메서드만을 가지고 있고, **이를 구현한 클래스의 인스턴스들에는 자연적인 순서가 있음을 뜻합니다.** 따라서 `Comparable` 인터페이스를 구현한 클래스는 정렬이나 대/소 비교가 가능합니다.

## compareTo() 메서드의 일반 규약
`compareTo()` 메서드는 이 객체와 주어진 객체의 순서를 비교합니다. 이 객체(this)보다 작으면 음의 정수를, 같으면 0을, 크면 양의 정수를 반환합니다.

`compareTo()` 메서드를 재정의 할 때에는 몇 가지 지켜야 할 규약들이 있는데, 이는 아래와 같습니다. *(다음 설명에서 sgn(표현식) 표기는 수학에서 말하는 부호 함수(signum function)를 뜻하며, 표현식의 값이 음수, 0, 양수일 때 -1, 0, 1을 반환하도록 정의했다고 가정합니다.)*

1. `Comparable`을 구현한 클래스는 모든 **x**, **y**에 대해 **sgn(x.compareTo(y)) == -sgn(y.compareTo(x))**여야 한다. *(따라서 **x.compareTo(y)**는 **y.compareTo(x)**가 예외를 던질 때에 한해 예외를 던져야 한다.)*
2. `Comparable`을 구현한 클래스는 추이성을 보장해야 한다. 즉, **(x.compareTo(y) > 0 && y.compareTo(z) > 0)**이면 **x.compareTo(z) > 0**이다.
3. `Comparable`을 구현한 클래스는 모든 **z**에 대해 **x.compareTo(y) == 0**이면 **sgn(x.compareTo(z)) == sgn(y.compareTo(z)) > 0**이다.
4. 이번 권고가 필수는 아니지만 꼭 지키는 것이 좋다. **(x.compareTo(y) == 0) == (x.equals(y))**여야 한다. `Comparable`을 구현하고 이 권고를 지키지 않는 모든 클래스는 그 사실을 명시해야 한다. 다음과 같이 명시하면 적당할 것이다. *"주의 : 이 클래스의 순서는 `equals` 메서드와 일관되지 않다."*

위 일반 규약은 모든 객체에 대해 전역 동치 관계를 부여하는 `equals()` 메서드와 달리, `compareTo()`는 타입이 다른 객체는 신경쓰지 않아도 됩니다. 즉, 타입이 다른 객체가 주어지면 간단히 `ClassCastException`을 던져도 되며, 대부분 그렇게 합니다.

마지막 4번 규약은 필수는 아니지만 지키는 것이 좋습니다. **만약 지켜지지 않는다면 `HashSet`과 `TreeSet`에서 서로 다르게 동작할 수 있습니다.**

## 기본 타입 클래스의 `compareTo()` 메서드
자바 7 이후로 박싱된 기본 타입 클래스들에 정적 메서드 `compareTo()`가 추가되었습니다. `compareTo()`에서 관계 연산자 `<` `>`를 이용하는 것은 오류를 유발하니 **`compareTo()`메서드를 적극 활용하길 권장하고 있습니다.**

필자 역시 `C++`에서 가장 곤혹스러웠던 것이 정렬을 위해 `compare()` 함수를 선언하는 것이었습니다. 아래는 `C++`에서 compare 함수를 선언하는 방식입니다. *"`i`가 `j`보다 크면 `true`를 반환해라."* 저에겐 이런 방식이 사용할 때 마다 헷갈렸습니다.

`bool compare(int i, int j) { return i > j; }`

하지만 `Java 7`부턴 달라집니다. 기본적으로 제공해주는 `compareTo()`메서드를 활용하면 쉽게 정렬을 위한 `compareTo`를 작성할 수 있습니다. **크다, 작다**라는 헷갈릴 수 있는 상황에서 벗어나게 해줍니다. 아래는 이번 장을 공부하고 PS에 바로 사용한 코드입니다. `Ticket`이라는 클래스에는 문자열인 `dst`와 `isUsed`라는 필드가 있는데, 정렬은 `dst` 기준으로만 하고 싶을 때 아래와 같이 코드를 작성할 수 있었습니다.

```java
class Ticket implements Comparable {

  String dst;
  boolean isUsed;

  public Ticket(String dst, boolean isUsed) {
    this.dst = dst;
    this.isUsed = isUsed;
  }

  @Override
  public int compareTo(Object o) {
    return dst.compareTo(((Ticket) o).dst);
  }
}
```

## 클래스를 확장 했을 떄 `Comparable` 문제
아래와 같은 코드가 있다고 가정해보겠습니다.
```java
@AllArgsConstructor
public class Point implements Comparable<Point> {

  public Integer x;
  public Integer y;

  @Override
  public int compareTo(Point o) {
    if (x.compareTo(o.x) == 0) {
      return y.compareTo(o.y);
    }
    return x.compareTo(o.x);
  }
}
```

```java
public class PointColor extends Point implements Comparable<Point> {

  public String color;

  public PointColor(Integer x, Integer y, String color) {
    super(x, y);
    this.color = color;
  }

  @Override
  public int compareTo(Point o) {
    int result = super.compareTo(o);
    if (result == 0) {
      return color.compareTo(((PointColor) o).color);
    }
    return result;
  }
}
```

위와 같이 코드가 있을 때, `compareTo` 규약을 지킬 수 없습니다. 아래 예시를 보겠습니다.

```java
class PointColorTest {

  public static void main(String[] args) {
    Point point = new Point(1, 2);
    PointColor pointColor = new PointColor(1, 2, "RED");

    System.out.println("point.compareTo(pointColor): " + point.compareTo(pointColor) + " == " + 0);

    try {
      System.out.println(pointColor.compareTo(point) + " == " + 0);
    } catch (ClassCastException e) {
      System.out.println("ClassCastException");
    }
  }
}
```

위 코드의 결과는 아래와 같습니다.
```
point.compareTo(pointColor): 0 == 0
ClassCastException
```
위와 같은 현상이 발생하는 이유는, `compareTo`를 재정의하는 과정에서 `ClassCastException`이 발생할 수 있는 코드를 작성하게 되기 때문입니다. 따라서 위 코드는 아래와 같이 수정되어야 규약을 지킬 수 있습니다.

```java
public class GoodPointColor implements Comparable<GoodPointColor> {

  Point point;
  String color;

  @Override
  public int compareTo(GoodPointColor o) {
    int result = point.compareTo(o.point);
    if (result == 0) {
      return color.compareTo(o.color);
    }
    return result;
  }
}
```

위와 같이 `GoodPointColor`처럼 사용하여야 서로 다른 `Class`에 대한 `compareTo` 비교를 컴파일 단계에서 막을 수 있습니다.
## 요약
순서를 고려해야 하는 값 클래스를 작성한다면 꼭 `Comparable` 인터페이스를 구현하여, 그 인스턴스들을 쉽게 정렬하고, 검색하고, 비교 기능을 제공하는 컬렉션과 어우러지도록 해야 합니다. `compareTo` 메서드에서 필드 값을 비교할 때 `<`와 `>` 연산자는 쓰지 말아야 합니다. 대신 박싱 된 기본 타입 클래스가 제공하는 정적 `compare`메서드나 `Comparator`인터페이스가 제공하는 비교자 생성 메서드를 사용합시다.
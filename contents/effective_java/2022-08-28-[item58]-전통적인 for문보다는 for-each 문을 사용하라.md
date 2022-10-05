---
date: '2022-08-28'
title: '[item58] 전통적인 for문보다는 for-each 문을 사용하라'
categories: ['effective_java']
summary: '`Java`에선 `JDK 1.5`부터 `for-each`문을 지원했습니다. 배열이나 `Iterable<>`을 상속받은 객체라면 `for-each`문을 사용할 수 있습니다.'
thumbnail: './effective_java_thumb.png'
---

> **전통적인 for문보다는 for-each 문을 사용하라**

`Java`에선 `JDK 1.5`부터 `for-each`문을 지원했습니다. 배열이나 `Iterable<>`을 상속받은 객체라면 `for-each`문을 사용할 수 있습니다.

## `for` vs `for-each`
앞 장에서 `while`문에 비해 `for`문이 자연스럽게 **변수의 범위를 축소해주는 장점** 때문에 `for`문을 쓰길 권장했었습니다.

물론 `for`문도 좋은 방식이지만 `for-each`문은 더 나은 가독성을 주면서 `for`문의 장점을 모두 가져갑니다.

> `for-each`문의 정식 명칭은 **향상된 for문(enhanced for statement)**이라고 합니다.

아래 코드는 `1, 1`, `1, 2`, `1, 3`, ... , `3, 4` 같이 각 숫자의 쌍을 만드는 코드인데, 사실 치명적 오류를 가지고 있습니다. 바로 `i.next()`가 매번 불려서 결국엔 `NoSuchElementException`을 일으킵니다.
```java
public static void main(String[] args) {
  List<Integer> numbers = Arrays.asList(1, 2, 3);
  List<Integer> numbers2 = Arrays.asList(1, 2, 3, 4);
  List<Result> result = new ArrayList<>();

  for (Iterator<Integer> i = numbers.iterator(); i.hasNext(); ) {
    for (Iterator<Integer> j = numbers2.iterator(); j.hasNext(); ) {
      result.add(new Result(i.next(), j.next())); // i는 총 4번 불리기 때문에 에러가 발생한다.
    }
  }

  System.out.println(result);
}
```

위 코드를 `for-each`문을 사용하면 아래와 같이 사용이 가능합니다. `for-each`문을 사용하면 가독성도 올라가고 오류를 찾기도 훨씬 쉽습니다.
```java
for (Integer number : numbers) {
  for (Integer number2 : numbers2) {
    result.add(new Result(number, number2)); // i는 총 4번 불리기 때문에 에러가 발생한다.
  }
}
```

`Iterable`을 처음부터 직접 구현하긴 까다롭지만, 원소들의 묶음을 표현하는 타입을 작성해야 한다면 `Iterable`을 구현하는 쪽으로 고민해볼만 합니다.

## 결론
전통적인 `for`문과 비교했을 때 `for-each`문은 명료하고, 유연하고, 버그를 예방해줍니다. 성능 저하도 없기 때문에 가능한 모든 곳에서 `for`문 대신 `for-each`문을 사용하도록 합시다.
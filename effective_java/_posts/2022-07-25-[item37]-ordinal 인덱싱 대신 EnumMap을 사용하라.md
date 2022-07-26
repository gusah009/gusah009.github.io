---
title: "[item37] ordinal 인덱싱 대신 EnumMap을 사용하라"
toc_label: "[item37]"
toc: false
toc_sticky: false
---

> **ordinal 인덱싱 대신 EnumMap을 사용하라**

가끔, `Enum`을 Key로 만들어서 원소를 가져올 때, `ordinal()`을 사용하여 배열로 가져오는 경우가 있습니다. 아래에서 자세히 살펴보겠습니다.

## ordinal() 사용하기
```java
Set<String>[] fruitsByFruitColor = (Set<String>[]) new Set[FruitColor.values().length];
for (int i = 0; i < fruitsByFruitColor.length; i++) {
  fruitsByFruitColor[i] = new HashSet<>();
}
fruitsByFruitColor[RED.ordinal()].add("apple");
fruitsByFruitColor[RED.ordinal()].add("strawberry");
fruitsByFruitColor[YELLOW.ordinal()].add("banana");
```
위 코드는 `ordinal()`을 배열의 인덱스로 사용하고 있어서 앞선 장에서 말한 `ordinal()`사용의 단점들을 그대로 가지고 있을 뿐 아니라, 제네릭 배열을 사용하여 타입 안전하지 않기 때문에 비검사 경고까지 갖게 됩니다.

## EnumMap 사용하기
```java
EnumMap<FruitColor, Set<String>> fruitsByFruitColor = new EnumMap<>(FruitColor.class);
for (FruitColor fruitColor : FruitColor.values()) {
  fruitsByFruitColor.put(fruitColor, new HashSet<>());
}
fruitsByFruitColor.get(RED).add("apple");
fruitsByFruitColor.get(RED).add("strawberry");
fruitsByFruitColor.get(YELLOW).add("banana");
```

`EnumMap`을 사용하면 비검사 경고를 없앨 수 있을 뿐만 아니라 위의 모든 단점을 해결할 수 있습니다. 그 뿐만 아니라 성능 역시 위에서 배열을 이용한 것과 비슷한데, 그 이유는 `EnumMap`이 내부적으로 배열을 사용하고 있기 때문입니다. 내부 구현을 숨겨서 배열의 성능과, `Map`의 안정성까지 모두 잡은 셈입니다.

책에서 `Phase`예시로 `EunmMap`을 활용했을 때의 확장성까지 보여주고 있으므로 참고하시면 될 것 같습니다.

## 결론
배열의 인덱스를 얻기 위해 ordinal을 쓰는 것은 일반적으로 좋지 않습니다. 대신 `EnumMap`을 사용하고, 다차원 관계는 `EunmMap<... EnumMap<...>>`으로 표현합시다.
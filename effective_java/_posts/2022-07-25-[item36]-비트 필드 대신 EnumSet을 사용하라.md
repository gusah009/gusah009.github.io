---
title: "[item36] 비트 필드 대신 EnumSet을 사용하라"
toc_label: "[item36]"
toc: false
toc_sticky: false
---

> **비트 필드 대신 EnumSet을 사용하라**

과거에 열거한 값들을 집합으로서 사용할 때에는 각 상수에 2의 거듭제곱 값을 할당한 정수 열거 패턴을 사용해 왔습니다. 이를 통해 비트 연산으로 집합 연산들을 효율적으로 할 수 있다는 장점이 있었지만, 여전히 앞서 말했던 정수 열거 패턴의 단점들을 고스란히 안고 가야 했습니다. 이에 `EnumSet`이 등장했습니다.

## EnumSet
`EnumSet`은 `Set`인터페이스를 완벽하게 구현하고 있으며, 내부적으로 비트 벡터로 구현됐기 때문에 연산들이 비트 필드에 필적할 정도의 성능을 보여줍니다. 동시에, `EnumSet`에서 난해한 작업들을 모두 해주기 때문에 직접 비트를 다룰 때 겪는 오류들에서도 해방됩니다.

## 여담) HashSet과 EnumSet의 속도 차이 테스트
`addAll` 연산자만 진행했지만, 원한다면 어떤 연산자든 아래 코드를 이용해 테스트 해보실 수 있습니다.

> 테스트 환경: `jdk17`, `M1 mac`, `IntelliJ`

```java
enum Test {
  A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
}

public static void main(String[] args) {
  long hashSetResult = 0;
  long enumSetResult = 0;

  List<Test> testList = new ArrayList<>(Arrays.stream(Test.values()).toList());
  for (int i = 0; i < 1000; i++) {
    Collections.shuffle(testList);
    int randomSliceIndex = new Random().nextInt(Test.values().length);
    List<Test> testSubList1 = testList.subList(0, randomSliceIndex);
    List<Test> testSubList2 = testList.subList(randomSliceIndex, Test.values().length);
    hashSetResult += getHashSetTakeTime(testSubList1, testSubList2);
    enumSetResult += getEnumSetTakeTime(testSubList1, testSubList2);
  }
  System.out.println("hashSetResult = " + hashSetResult / 1000.0 + "ms");
  System.out.println("enumSetResult = " + enumSetResult / 1000.0 + "ms");
}

private static long getHashSetTakeTime(List<Test> testSubList1, List<Test> testSubList2) {
  HashSet<Test> hashSet1 = new HashSet<>(testSubList1);
  HashSet<Test> hashSet2 = new HashSet<>(testSubList2);
  long startTime = System.nanoTime();
  hashSet1.addAll(hashSet2);
  long finishTime = System.nanoTime();
  return finishTime - startTime;
}

private static long getEnumSetTakeTime(List<Test> testSubList1, List<Test> testSubList2) {
  EnumSet<Test> enumSet1 = EnumSet.noneOf(Test.class);
  enumSet1.addAll(testSubList1);
  EnumSet<Test> enumSet2 = EnumSet.noneOf(Test.class);
  enumSet1.addAll(testSubList1);
  long startTime = System.nanoTime();
  enumSet1.addAll(enumSet2);
  long finishTime = System.nanoTime();
  return finishTime - startTime;
}
```
```java
// 결과
// hashSetResult = 2149.954ms
// enumSetResult = 94.424ms
```
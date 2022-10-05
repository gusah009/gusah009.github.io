---
date: '2022-07-27'
title: 'System.SetIn과 Scanner를 이용한 Junit 다중 테스트 시 NoSuchElementException'
categories: ['etc']
summary: '`Scanner`를 이용한 테스트를 진행하던 중, 단일 Junit 테스트에서는 문제 없이 성공하던게, 전체 테스트를 돌리기만 하면 실패가 나오는 현상이 발생했습니다. 비슷한 문제를 겪고 있을 분들을 위해 문제의 원인과 해결 방법에 대해 말씀드리겠습니다.'
thumbnail: './Junit_test_success.png'
---

> System.SetIn()과 Scanner를 이용한 Junit 다중 테스트 시 NoSuchElementException 발생하는 오류

`Scanner`를 이용한 테스트를 진행하던 중, **단일 Junit 테스트에서는 문제 없이** 성공하던게, **전체 테스트를 돌리기만 하면** 실패가 나오는 현상이 발생했습니다. 비슷한 문제를 겪고 있을 분들을 위해 문제의 원인과 해결 방법에 대해 말씀드리겠습니다.

> **테스트 환경**
>
> `M1 mac`, `junit 5.8.1`, `assertj 3.11.1`, `IntelliJ`

## 간단한 예제
아래에 `Scanner`를 이용한 간단한 예제를 만들어 보았습니다.
```java
public class ScannerExample {

  public static final Scanner SCANNER = new Scanner(System.in);
  Integer inputNum;

  Status input1or2() {
    try {
      inputNum = Integer.valueOf(SCANNER.nextLine());
      if (inputNum != 1 && inputNum != 2) {
        throw new IllegalArgumentException();
      }
      return SUCCESS;
    } catch (Exception e) {
      return FAIL;
    }
  }

  public enum Status {
    SUCCESS, FAIL
  }
}

```
위와 같이 코드를 작성한 뒤, 코드의 의도대로 1과 2만 받는 지 검증하는 테스트 코드를 작성했습니다.
먼저 1만 넣었을 때 테스트 코드입니다.
```java
@Test
void input1Test() {
  // given
  System.setIn(new ByteArrayInputStream("1".getBytes()));
  ScannerExample ex = new ScannerExample();

  // when
  Status result = ex.input1or2();

  // then
  Assertions.assertThat(result).isEqualTo(SUCCESS);
}
```
만족스럽게 통과합니다. 다음으로 2의 경우를 테스트 해보겠습니다.
```java
@Test
void input2Test() {
  // given
  System.setIn(new ByteArrayInputStream("2".getBytes()));
  ScannerExample ex = new ScannerExample();

  // when
  Status result = ex.input1or2();

  // then
  Assertions.assertThat(result).isEqualTo(SUCCESS);
}
```
역시 만족스럽게 통과합니다. 이제 두 개를 동시에 돌려보겠습니다.

<img width="974" alt="image" src="https://user-images.githubusercontent.com/26597702/181231712-0d36ee72-0739-4eb4-b08d-d1452652616b.png">

놀랍게도 하나는 통과하고, 하나는 `NoSuchElement`를 발생시키며 실패합니다. 이는 테스트코드 순서에 따라 다른데, 사진에선 1이 2보다 먼저 실행됐지만, 2가 먼저 실행된다면 2는 성공하고 1은 실패하게 됩니다. 왜 이런 현상이 발생할까요?

### Scanner와 테스트가 서로 다른 InputStream을 이용중이다
범인은 `System.SetIn()`안의 `new ByteArrayInputStream()`에 있습니다. 매 테스트마다 새로운 `InputStream`을 `System.in`에게 제공하고 있는데, 우리는 맨 처음 `ScannerExample`을 만들 때 `Scanner`를 `new Scanner(System.in)`으로 선언했습니다. 따라서 맨 처음 `InputStream`이 `Scanner`에는 계속 남아 있게 되는 것이고 두 번째 테스트부터는 `Scanner`가 다른 `InputStream`을 가지고 테스트를 진행하고 있는 꼴이 되는 것입니다.

이에 대한 해결 방법으로 `Scanner`를 non-final 하게 풀고 매 테스트마다 초기화 해주는 방법이 있습니다.
```java
public class ScannerExample {
  public static Scanner SCANNER = new Scanner(System.in);

  ...
}
```
```java
@Test
void input1Test() {
  // given
  ByteArrayInputStream inputStream = new ByteArrayInputStream("1".getBytes());
  SCANNER = new Scanner(inputStream);
  System.setIn(inputStream);

  ...
}
```
이렇게 되면, 매 테스트마다 `Scanner`가 서로 다른 `InputStream`을 가져서 충돌 없이 원활하게 다중 테스트를 실행시킬 수 있습니다.

<img width="785" alt="image" src="https://user-images.githubusercontent.com/26597702/181233460-a5ac4112-a7be-45c8-aba9-ecfc613f6b57.png">

## inputStream을 수정할 순 없을까?
위 코드 예시에서 매 테스트마다 `InputStream`을 새로 생성하고 있는데, 제일 초기 `InputStream` 하나로 계속 코드를 작성하면 더 깔끔하고 `Scanner`도 `final`로 유지할 수 있을 것입니다. **하지만 안타깝게도 `InputStream` 내부적으로 데이터를 넣는 메서드를 제공하고 있지 않습니다.**

따라서 위 방식이 현재로선 최선으로 보입니다.

**사용한 코드: [https://github.com/gusah009/javaStudy/tree/master/blog/src/main/java/scanner_issue_220727](https://github.com/gusah009/javaStudy/tree/master/blog/src/main/java/scanner_issue_220727)**

**사용한 테스트 코드: [https://github.com/gusah009/javaStudy/tree/master/blog/src/test/java/scanner_issue_220727](https://github.com/gusah009/javaStudy/tree/master/blog/src/test/java/scanner_issue_220727)**
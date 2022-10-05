---
date: '2022-09-08'
title: '키퍼 홈페이지 트러블슈팅 - 스케줄러와 Transaction 그리고 테스트 코드에서 생긴 문제 해결하기'
categories: ['keeper_homepage']
summary: '안녕하세요. 오늘은 스케줄러를 이용하면서 생긴 `LazyInitializationException`문제와 테스트 코드에서의 문제에 대해 작성해 보겠습니다.'
thumbnail: './thumbnail/READ_UNCOMMITED.png'
---

> 스케줄러와 Transaction 그리고 테스트 코드에서 생긴 문제 해결하기

안녕하세요. 오늘은 스케줄러를 이용하면서 생긴 `LazyInitializationException`문제와 테스트 코드에서의 문제에 대해 작성해 보겠습니다.

해당 문제를 재현하기 위해 **간단한 예시 프로젝트**를 생성하였습니다.

> 사용한 기술 스택 버전 정보
>
> gradle `7.5`
>
> springboot `2.7.3`
>
> JDK `17`
>
> MySQL `8.0.29`

전체 코드는 해당 링크에서 확인할 수 있습니다. [https://github.com/gusah009/javaStudy/tree/master/webBlog](https://github.com/gusah009/javaStudy/tree/master/webBlog)

전체 디렉토리 구조는 다음과 같습니다.

<img width="396" alt="image" src="https://user-images.githubusercontent.com/26597702/189026938-e05d5463-fe3f-4518-b77f-c150a496f724.png">

간단하게 프로젝트 설명을 하자면, 시간(seconds)과 함께 요청을 보낼 경우 **해당 시간에 모든 회원의 팀이 `"정현모 팀"`으로 바뀝니다.**

```java
@RestController
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;

  @PostMapping("/reserve")
  public String reserveMemberTeamChange(
      @RequestBody @NotNull Integer seconds
  ) {
    return memberService.reserveMemberTeamChange(seconds);
  }
}
```
간단한 `MemberController`입니다. `seconds`와 함께 요청을 보내면 해당 `seconds`후에 모든 회원의 팀이 변경됩니다.

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

  public static final ZoneOffset SEOUL_ZONE_OFFSET = ZoneOffset.of("+09:00");

  private final SchedulerService schedulerService;
  private final MemberRepository memberRepository;
  private final TeamRepository teamRepository;

  @Transactional
  public String reserveMemberTeamChange(int seconds) {
    Date taskDate = getDatePlusSeconds(seconds);
    Runnable task = () -> changeDefaultTeamMembersTeamTo("정현모");
    schedulerService.scheduleTask(task, taskDate);

    return "SUCCESS";
  }

  private Date getDatePlusSeconds(int seconds) {
    return Date.from(now().plusSeconds(seconds).toInstant(SEOUL_ZONE_OFFSET));
  }

  private void changeDefaultTeamMembersTeamTo(String teamName) {
    List<Member> allMembers = memberRepository.findAll();
    Team myTeam = getTeamByName(teamName);
    for (Member member : allMembers) {
      // 조금 억지스럽지만, 추후에 있을 LazyInitializationException을 보여주기 위해 이름으로 비교
      if (Objects.equals(member.getTeam().getName(), DEFAULT_NAME)) {
        member.changeTeam(myTeam);
      }
    }
    memberRepository.saveAll(allMembers);
  }

  private Team getTeamByName(String teamName) {
    return teamRepository.findByName(teamName)
        .orElseThrow(RuntimeException::new);
  }
}
```
다음으로 서비스 코드입니다.

```java
@Configuration
public class SchedulerConfig {

  @Bean
  public TaskScheduler taskScheduler() {
    ScheduledExecutorService scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
    return new ConcurrentTaskScheduler(scheduledExecutorService);
  }
}
```

마지막으로 `SchedulerConfig`입니다. 크게 어려운 내용 없이 `Spring`의 `TaskScheduler`를 `Bean`으로 주입해주고 있는 모습입니다.

## `LazyInitializationException` 발생

아주 간단한 로직이고 문제가 없어보이지만 실행시킬 경우 아래와 같은 에러가 발생합니다.

<img width="1678" alt="image" src="https://user-images.githubusercontent.com/26597702/189481790-ed6cf68c-f905-4e53-928b-200758cc0311.png">

문제가 발생한 원인은 간단합니다.

`Lazy Loading`을 위해선 하나의 트랜잭션에서 영속성 컨텍스트 관리가 되어야 하는데, `task`로 수행시킨 `changeDefaultTeamMembersTeamTo()`메서드에선 **트랜잭션이 존재하지 않기 때문에** 발생한 에러였습니다.

이런 의구심이 들 수 있습니다. **`reserveMemberTeamChange()` 메서드에 분명 `@Transactional`을 선언해 줬는데, 왜 트랜잭션이 생기지 않은거지?**

정답은 바로 스프링의 `TaskScheduler`에 있습니다. 스프링의 `TaskScheduler`는 **내부적으로 새로운 스레드를 만들어서 동작하기 때문에 상위 메서드에서 선언한 트랜잭션과 무관합니다.**

해결하기 위한 방법으로 **스케줄러 스레드**에 트랜잭션을 걸어주는 방법을 선택했습니다. 하지만 선언적 트랜잭션 (`@Transactional` 어노테이션)은 사용할 수 없었습니다. 

이유는 바로 `private changeDefaultTeamMembersTeamTo()` 메서드가 `private`이기 때문입니다. `@Transactional` 어노테이션은 `public` 메서드만 지원하기 때문에 해당 방법은 쓸 수 없었습니다.

> 접근자를 `public`으로 바꾸고 사용해도 되지만, 실제 프로젝트에서 해당 메서드는 다른 서비스에서 사용하지 않길 원했기 때문에 `private`이 더 적절하다고 생각했습니다.

## 프로그래밍 트랜잭션

선언적 트랜잭션은 사용할 수 없었기 때문에, `TransactionTemplate`을 이용해 프로그래밍 트랜잭션을 사용하였습니다.

```java
public class MemberService {

  private final TransactionTemplate transactionTemplate;

  @Transactional
  public String reserveMemberTeamChange(int seconds) {
    ...
    Runnable task = () -> changeDefaultTeamMembersTeamToWithTransaction("정현모");
    ...
  }

  ...

  private void changeDefaultTeamMembersTeamToWithTransaction(String teamName) {
    transactionTemplate.execute(new TransactionCallbackWithoutResult() {
      @Override
      protected void doInTransactionWithoutResult(TransactionStatus status) {
        changeDefaultTeamMembersTeamTo(teamName);
      }
    });
  }
}
```

위와 같이 프로그래밍 트랜잭션을 사용하여 정상적으로 서비스가 돌아가는 것을 확인할 수 있었습니다.

## 테스트 코드 문제

이제 서비스 로직에선 잘 동작했지만, 이번엔 **테스트 코드에서 문제**가 발생했습니다.

```java

@SpringBootTest
@Transactional
class MemberServiceTest {

  ...

  @Test
  public void reserveMemberTeamChange() throws InterruptedException {
    // given
    generateTeam(DEFAULT_NAME);
    Team changeTeam = generateTeam("정현모");
    Member member1 = generateMember();
    Member member2 = generateMember();

    // when
    String result = memberService.reserveMemberTeamChange(1);

    // wait task running
    Thread.sleep(2000);

    // then
    assertThat(result).isEqualTo("SUCCESS");
    assertThat(member1.getTeam()).isEqualTo(changeTeam);
    assertThat(member2.getTeam()).isEqualTo(changeTeam);
  }

  ...
}
```

위 코드는 `기본 팀`과 바뀔 `정현모 팀`을 생성한 뒤에, 서비스 코드를 실행시키는 테스트입니다.

`Thread.sleep(2000)`으로 task가 완료될 충분한 시간을 준 뒤, `Team`이 제대로 바뀌었는지 확인하는 테스트입니다.

하지만 수행시켜보면 **아래와 같은 에러**가 나타납니다.

<img width="932" alt="image" src="https://user-images.githubusercontent.com/26597702/189484474-87c16cfb-5517-4fa3-a625-523d2fc7e2cd.png">

오류의 내용은 **`"정현모 팀"`**을 찾을 수 없다는 내용입니다.

분명히 `Team changeTeam = generateTeam("정현모");` 코드를 통해 **`정현모 팀`**을 넣어줬는데, 왜 찾지 못할까요?

원인은 바로 스케줄러가 새로운 스레드에서 돌면서 테스트 트랜잭션과 달리 **완전히 새로운 트랜잭션**으로 돌기 때문에 생긴 것입니다.

그림으로 보겠습니다.

<img width="888" alt="image" src="https://user-images.githubusercontent.com/26597702/189912300-2a7040d2-a392-45b8-ba6f-cc651e93ee79.png">

그림에서 볼 수 있듯이 `스케줄러 트랜잭션`이 `테스트 트랜잭션`의 데이터를 볼 수 없는데, 그 이유는 `MySQL`의 기본 `Isolation Level` 때문입니다.

## 테스트가 실패한 원인을 찾자! `Isolation Level` 살펴보기

`Isolation Level`은 크게 아래와 같이 4단계로 분류됩니다.

### READ UNCOMMITTED
- COMMIT 되지 않은 데이터에 다른 트랜잭션에서 접근할수 있다.
- INSERT, UPDATE, DELETE 후 COMMIT 이나 ROLLBACK에 상관없이 현재의 데이터를 읽어온다.
- ROLLBACK이 될 데이터도 읽어올 수 있으므로 주의가 필요하다.

### READ COMMIITED
- COMMIT 된 데이터에 다른 트랜잭션에서 접근할 수 있다.
- 구현 방식이 차이 때문에 Query를 수행한 시점의 데이터와 정확하게 일치하지 않을 수 있다.
- LOCK이 발생하지 않는다.

### REPEATABLE READ
- **MySQL의 Default LEVEL**
- SELECT시 현재 시점의 스냅샷을 만들고 스냅샷을 조회한다.
- 동일 트랜잭션 내에서 일관성을 보장한다.

### SERIALIZE
- 가장 강력한 LEVEL

이 중 3번째의 **REPEATABLE READ**를 보시면, `MySQL`의 기본 고립 수준인 것을 볼 수 있습니다.

출처: [MySQL의 Transaction Isolation Level (Lock에 관하여)](https://labs.brandi.co.kr/2019/06/19/hansj.html)

## 생각해 본 해결 방법 1 - `READ UNCOMMITED`
해당 문제를 해결하기 위해 `READ UNCOMMITED`를 사용해보려고 했습니다.

**예상 시나리오**는 아래와 같습니다.

<img width="888" alt="image" src="https://user-images.githubusercontent.com/26597702/189916238-c6906413-7097-4d58-a7b3-f79bb4c63352.png">

`스케줄러 트랜잭션`에서 `테스트 트랜잭션`의 커밋되지 않은 데이터를 보려면 고립 수준을 `READ UNCOMMITED`로 바꿔야 한다는 점에서 착안하였습니다.

하지만 `READ UNCOMMITED`는 `Dirty Read` 문제가 있어 **실제 프로덕션 코드**의 고립 수준을 `READ UNCOMMITED`로 수정하면 **데이터 정합성에 큰 문제**가 발생할 수 있습니다.

따라서 테스트 시의 트랜잭션 수행 코드와 프로덕션에서의 트랜잭션 수행 코드를 분리했습니다.

아래와 같이 `@TestConfiguration`을 이용하여 테스트 시에 사용하는 트랜잭션 템플릿을 따로 만들어 주었습니다.

```java
@TestConfiguration
@RequiredArgsConstructor
static class TestSchedulerConfig {

  private final PlatformTransactionManager txManager;

  @Bean
  TransactionTemplate schedulerTransactionTemplateTest() {
    TransactionTemplate txTemplate = new TransactionTemplate(txManager);
    txTemplate.setIsolationLevel(TransactionDefinition.ISOLATION_READ_UNCOMMITTED);
    return txTemplate;
  }
}
```

테스트 코드에선 고립 수준을 `READ_UNCOMMITTED`로 설정해주는 것을 확인할 수 있습니다.

테스트 코드에도 **약간의 수정**이 필요했습니다.

바로 `em.flush()`와 `em.clear()`를 통해 실제 쿼리를 보내는 일입니다. 실제 쿼리가 나가서 DB가 업데이트 되어야 **새로운 스레드의 트랜잭션에서 읽을 수 있기** 때문입니다.

```java
@Test
public void reserveMemberTeamChange() throws InterruptedException {
  // given
  generateTeam(DEFAULT_NAME);
  Team changeTeam = generateTeam("정현모");
  generateMember();
  generateMember();

  // 쿼리가 나가야 새로운 스레드의 트랜잭션에서 데이터를 읽을 수 있다.
  em.flush();
  em.clear();

  // when
  String result = memberService.reserveMemberTeamChange(1);
  
  ...
}
```

**이론상 완벽하다..!**
**테스트를 돌려보면...!**

<img width="999" alt="image" src="https://user-images.githubusercontent.com/26597702/189489751-9bf67c84-fcd5-4031-b161-d1781c92e64c.png">

기가 막히게 **낙관적 락 에러**를 일으킵니다.

<img width="515" alt="image" src="https://user-images.githubusercontent.com/26597702/189504868-559a64b3-78af-4aad-8a0a-dff946a0f1e2.png">

쿼리를 보면, `update`문이 **하나만 나가고 그 이후로 나가지 않고 있습니다.** `member`가 2명이기 때문에 `update`문이 두 번 나가야 될 것 같은데 한 번만 나가고 다음 `update`문은 나가지 않고 있는 모습입니다.

원인은 바로 **DB단에서 row에 lock**이 걸려있기 때문입니다.

`MySQL`이 사용하는 `InnoDB`는 서로 다른 트랜잭션에서 데이터를 수정할 수 없도록 **각 `record`에 `Record lock`을 걸어 놓습니다.**

그래서 `테스트 트랜잭션`의 `lock`을 기다리느라 `스케줄러 트랜잭션`에선 코드가 수행되지 않고 있었던 것입니다.

그렇게 `테스트 트랜잭션`의 코드가 모두 수행되면 **테스트의 데이터는 모두 롤백**될 것이고, 이제서야 락을 획득한 `스케줄러 트랜잭션` 입장에선 `member`나 `team`의 데이터가 없어서 `ObjectOptimisticLockingFailureException`를 일으키는 것입니다.

따라서 이 방법으론 테스트 코드 문제를 해결할 수 없었습니다.

## 생각해 본 해결 방법 2 - 새로운 스레드까지 트랜잭션을 전파

사실 `테스트 트랜잭션`을 `스케줄러 트랜잭션`까지 전파만 시킬 수 있다면 모두 해결 될 문제입니다. 아래 링크에 관련 정보도 있는 것 같은데, 아직 실력이 되지 않아 해당 내용을 이해하지 못했습니다.

[https://stackoverflow.com/questions/5232351/how-to-propagate-spring-transaction-to-another-thread](https://stackoverflow.com/questions/5232351/how-to-propagate-spring-transaction-to-another-thread)

## 생각해 본 해결 방법 3 - 트랜잭션을 걸지 않고, 테스트 후 데이터 삭제

결국 가장 무식한 방법으로, 테스트에 트랜잭션을 걸지 않고 테스트 후에 데이터를 삭제하는 방식을 택했습니다.

```java
@SpringBootTest
//@Transactional // 트랜잭션 제거!
class MemberServiceTest {
  ...

  @Test
  public void reserveMemberTeamChange() throws InterruptedException {
    ...

    // then
    assertThat(result).isEqualTo("SUCCESS");
    List<Member> resultMembers = memberRepository.findAll();
    assertThat(resultMembers.get(0).getTeam().getId()).isEqualTo(changeTeam.getId());
    assertThat(resultMembers.get(1).getTeam().getId()).isEqualTo(changeTeam.getId());

    // after // 로직 수행 후 더미 데이터 모두 삭제!
    deleteAllMember();
    deleteAllTeam();
  }
}
```

무식하지만 깔끔하게 해결이 되었습니다.

> 물론 더 좋은 방법이 있을 수 있지만, 우선 제가 이렇게 해결했다는 점을 봐주시면 감사하겠습니다. 더 좋은 방법이 있으면 댓글로 남겨주세요!

전체 코드는 해당 링크에서 확인할 수 있습니다. [https://github.com/gusah009/javaStudy/tree/master/webBlog](https://github.com/gusah009/javaStudy/tree/master/webBlog)


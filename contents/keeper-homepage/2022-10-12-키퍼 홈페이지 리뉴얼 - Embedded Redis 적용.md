---
date: '2022-10-12'
title: '키퍼 홈페이지 리뉴얼 - Embedded Redis 적용'
categories: ['keeper_homepage']
summary: '오늘은 프로젝트에 Embedded Redis를 적용한 사례와 방법을 말씀드리겠습니다.'
thumbnail: './thumbnail/redis_test_configuration.png'
---

> 오늘은 프로젝트에 Embedded Redis와 방법을 적용한 사례를 말씀드리겠습니다.

포스팅에 들어가기 앞서 두 포스팅의 글을 많이 참고했음을 밝힙니다.
- [Embedded Redis Server with Spring Boot Test](https://www.baeldung.com/spring-embedded-redis)
- [[Redis] SpringBoot Data Redis 로컬/통합 테스트 환경 구축하기](https://jojoldu.tistory.com/297)

## Embedded Redis
`Embedded Redis`는 `Java` 내부적으로 Redis를 실행시키고 사용함으로써 Redis 서버를 따로 띄우지 않아도 됩니다.

우연히 `Embedded Redis`의 존재를 알게 됐고, 매번 테스트를 돌릴 때 마다 로컬에서 Redis 서버를 여느니 **편의를 위해서 테스트만이라도 내장 Redis를 사용하기로 했습니다.**

## 몇 번의 시행착오
### TestConfiguration 사용해보기
처음엔 [밸떵님 블로그](https://www.baeldung.com/spring-embedded-redis)를 참고해서 `TestConfiguration`으로 테스트시에만 `Embedded Redis`를 사용하고자 했습니다.

```java
@TestConfiguration
public class TestRedisConfiguration {

  @Value("${spring.redis.port}")
  private int port;

  private RedisServer redisServer;

  public TestRedisConfiguration() {
    this.redisServer = new RedisServer(port);
  }

  @PostConstruct
  public void postConstruct() {
    redisServer.start();
  }

  @PreDestroy
  public void preDestroy() {
    redisServer.stop();
  }
}
```

하지만 문제가 있었는데, 바로 `@SpringBootTest`는 `@TestConfiguration`을 자동으로 `ComponentScan` 해주지 않는다는 것이었습니다.

`Redis`를 **사용하는 테스트에 명시적으로** `@SpringBootTest(classes = TestRedisConfiguration.class)` 해주어야만 했습니다.

하지만 저희 프로젝트에서 사용하는 `@SpringBootTest` 어노테이션이 여기저기 많기도 했고, 무엇보다 만약 새로 추가하는 테스트에서 깜빡하고 명시적으로 `Configuration`을 선언해주지 않아 에러가 발생한다면 **다른 사람이 이 부분에서 많은 시간을 디버깅하는데 허비할 것이라 생각했습니다.**

결국 다른 방법으로 `Embedded Redis`를 적용하고자 했습니다.

### 의존성 문제와 maxmemory 문제 해결

위와 같은 문제 외에도 **라이브러리 자체 문제**가 몇 개 있었는데, 해당 문제들은 [향로님의 블로그](https://jojoldu.tistory.com/297)에서 잘 해결해주고 계셔서 링크만 남깁니다.

### 통합 테스트에서 Embedded Redis 포트충돌 문제

이 문제도 [향로님의 블로그](https://jojoldu.tistory.com/297)에서 해결해주고 있지만 조금 더 깔끔한 코드로 해결하여서 제 코드를 올려볼까 합니다.

```java
@Configuration
public class RedisConfig {

  @Value("${spring.redis.host}")
  private String host;

  @Value("${spring.redis.port}")
  private int port;

  @Bean
  public RedisConnectionFactory redisConnectionFactory() {
    return new LettuceConnectionFactory(host, getPort());
  }

  @Bean
  public RedisTemplate<?, ?> redisTemplate() {
    RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(redisConnectionFactory());
    return redisTemplate;
  }

  public int getPort() {
    if (port == -1) {
      return port = findAvailablePort();
    }
    return port;
  }

  public int findAvailablePort() {
    try (ServerSocket serverSocket = new ServerSocket(0)) {
      return serverSocket.getLocalPort();
    } catch (IOException e) {
      throw new IllegalStateException("Port is not available");
    }
  }
}
```

`getPort()` 메서드와 `findAvailablePort()` 메서드를 제외하면 **기본적인 redis 설정 코드**입니다.

전 통합 테스트시 포트 충돌을 막기 위해 `getPort()` 메서드로 포트를 가져오게끔 하고, **테스트 시에는 테스트 `application.properies`의 `spring.redis.port` 값을 -1로 주어서 빈 포트를 찾아 할당하도록 하였습니다.**

```java
@Configuration
@EnableRedisRepositories
@RequiredArgsConstructor
@Profile("test")
public class TestRedisConfiguration {

  private final RedisConfig redisConfig;

  private RedisServer redisServer;

  @PostConstruct
  public void postConstruct() {
    this.redisServer = RedisServer.builder()
        .port(redisConfig.getPort())
        .setting("maxmemory 128M")
        .build();
    redisServer.start();
  }

  @PreDestroy
  public void preDestroy() {
    if (redisServer != null) {
      redisServer.stop();
    }
  }
}
```
또, `Profile`이 `"test"`일 때만 실행되는 `TestRedisConfiguration` 코드에 `Embedded Redis`를 사용할 수 있도록 설정해 놓았습니다.

이렇게 하면 테스트의 모든 `@SpringBootTest`마다 명시적으로 `@SpringBootTest(classes = TestRedisConfiguration.class)` 해 줄 필요도 없고, 테스트 시에는 `Embedded Redis`로, 배포 시에는 `외부 Redis`로 사용할 수 있게 됩니다.
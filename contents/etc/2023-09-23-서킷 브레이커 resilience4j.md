---
date: '2023-09-23'
title: '서킷 브레이커 resilience4j'
categories: ['etc']
summary: '오늘은 자바 서킷브레이커 라이브러리 resilience4j를 사용해 본 내용을 공유해보겠습니다.'
thumbnail: './images/resilience4j.png'
---

**오늘은 자바 서킷브레이커 라이브러리 resilience4j를 사용해 본 내용을 공유해보겠습니다.**

## 서킷 브레이커?

서킷 브레이커는 다른 서비스에 대한 호출을 모니터링 하다가 요청의 실패율이 일정 임계치를 넘어가면, 장애가 발생한 서비스로의 요청을 차단해 **빠르게 실패처리**를 하는 방법입니다.

> *참고: [https://hudi.blog/circuit-breaker-pattern](https://hudi.blog/circuit-breaker-pattern/)*
> 

timeout이 날 때 까지 기다리지 않고 빠르게 실패처리를 하는 이유는, 스레드 기반 웹 서버에서 한 요청이 한 스레드를 너무 오래 점유하기 때문인데요.

이를 감지해서 문제가 있는 API는 빠르게 실패 처리를 함으로써 다른 멀쩡한 요청들을 더 수월하게 받아들이기 위함입니다.

## **Resilience4j CircuitBreaker**

경량화 서킷 브레이커중 자바 라이브러리인 `Resilience4j`를 사용해보겠습니다.

![image](https://user-images.githubusercontent.com/26597702/271819498-1b66a17a-5937-4650-8456-aaf8a243f8fe.png)

컨셉은 아주 간단한데요, 평상시 상태는 `Closed`이고 문제가 생기면 `Open`으로 바뀌며 (*"이 때를 서킷이 열렸다"* 고 표현합니다) 이후 일정 기간동안 오는 모든 요청을 실패처리합니다.

그리고 일정 기간 후엔 `Half Open`으로 바뀌며 여전히 외부 서버에 문제가 있는지 확인하고, 문제가 있으면 다시 `Open`, 없으면 `Closed`로 바뀝니다.

### Implementation

제 프로젝트에선 `spring-boot3`를 사용하고 있어서 아래처럼 의존성을 추가해줍니다.

> 참고로 뒤에서 사용할 `@CircuitBreaker` 어노테이션은 내부적으로 AOP를 사용하기 때문에 aop 관련 의존성도 추가해주어야 합니다.
> 

```groovy
implementation 'io.github.resilience4j:resilience4j-spring-boot3:2.1.0'
implementation 'org.springframework.boot:spring-boot-starter-aop'
implementation 'org.springframework.boot:spring-boot-starter-actuator' // 선택!
implementation 'io.micrometer:micrometer-registry-prometheus' // 선택!
```

먼저, `application.yaml` 파일에 아래와 같이 설정해줍니다.

```yaml
resilience4j:
  circuitbreaker:
    configs:
      default:
        sliding-window-type: COUNT_BASED # window는 개수 base로 설정. 이외에 TIME_BASED도 있음
        sliding-window-size: 100         # 100개의 요청 중에,
        waitDurationInOpenState: 3s      # OPEN 상태에서 3초간 기다림. HALF_OPEN 상태로 빨리 전환되어 장애가 복구 될 수 있도록 기본값(60s)보다 작게 설정
        failureRateThreshold: 30         # 실패가 30퍼센트 이상이면 서킷이 열린다. 기본값(50%)보다 조금 작게 설정
        permittedNumberOfCallsInHalfOpenState: 10 # HALF_OPEN 상태에서 10개의 요청을 허용
        slowCallRateThreshold: 80        # 80퍼센트 이상 slowCall이 발생하면 서킷이 열린다. 기본값(100%)보다 조금 작게 설정
        slowCallDurationThreshold: 500ms # API를 가져오는데 500ms 이상 걸리면 slowCall로 판단함. 해당 값은 TimeLimiter의 timeoutDuration보다 작아야 함
        registerHealthIndicator: true    # actuator를 이용해 health를 확인할 지 여부
        recordFailurePredicate: com.example.playground.resilience4j.RestTemplateCircuitRecordFailurePredicate
    instances:
      gusah009:
        baseConfig: default
      default:
        baseConfig: default
  timelimiter:
    configs:
      call:
        timeoutDuration: 1000ms # slowCallDurationThreshold보다는 크게 설정되어야 함
```

> 각각의 config에 대해선 guide에 매우 상세하게 잘 나와있습니다.
> 
> guide: https://resilience4j.readme.io/docs/circuitbreaker

이번 테스트에 사용된 코드입니다.

```java
@Slf4j
@RestController
@RequiredArgsConstructor
public class GetExchangeRateTemplate {

    private final ResilienceService resilienceService;
    private final CircuitBreakerRegistry circuitBreakerRegistry;

    @GetMapping("/many-calls")
    public ResponseEntity<State> manyCalls(
            @RequestParam(defaultValue = "0") int ok,
            @RequestParam(defaultValue = "0") int error) {
        callMany("ok", ok);
        callMany("error", error);
        return ResponseEntity.ok(
                circuitBreakerRegistry
                        .circuitBreaker("gusah009")
                        .getState());
    }

    private void callMany(String param, int count) {
        for (int i = 0; i < count; i++) {
            try {
                resilienceService.call(param);
            } catch (Exception ignore) {
            }
        }
    }

    @GetMapping("ok")
    public ResponseEntity<String> ok() {
        return ResponseEntity.ok("ok~!");
    }

    @GetMapping("error")
    public ResponseEntity<String> error() {
        return ResponseEntity.internalServerError().body("error~!");
    }
}
```

```java
@Service
@RequiredArgsConstructor
public class ResilienceService {

    private final RestTemplate restTemplate;

    @CircuitBreaker(name = "gusah009")
    public String call(String param) {
        return restTemplate.getForEntity("http://localhost:8080/" + param, String.class).getBody();
    }
}
```

```java
// true 를 리턴하면 Fail 로 기록됨.
public class RestTemplateCircuitRecordFailurePredicate implements Predicate<Throwable> {
    @Override
    public boolean test(Throwable throwable) {
        // 4XX 클라이언트 에러는 fail로 기록하지 않음
        if (throwable instanceof HttpClientErrorException) {
            return false;
        }
        // 그 외에 에러는 모두 failure로 기록함(HttpServerErrorException, connection, timeout, IOException 등)
        return true;
    }
}
```

`http://localhost:8080/many-calls?ok=100`

위 url을 이용해서 100회 호출 모두 ok가 떨어지도록 계속 호출해보겠습니다.

![image](https://user-images.githubusercontent.com/26597702/271819513-7bbb4b5d-44b7-4218-bf57-74527c721259.png)

grafana에서 successful이 잘 증가하는 것을 볼 수 있습니다.

그럼 실패 10, 성공 90으로 다시 호출해보겠습니다.

`http://localhost:8080/many-calls?ok=90&error=10`

기가 막히게 10% 실패율이 뜨는 것을 볼 수 있습니다.

![image](https://user-images.githubusercontent.com/26597702/271819608-049936a4-ad34-4eb8-a5cf-10f0c56e1261.png)

`http://localhost:8080/many-calls?ok=71&error=error=10)29`

하지만 아직 실패 임계치(30%)엔 미치지 못했네요. 29%까지 늘려봅시다.

![image](https://user-images.githubusercontent.com/26597702/271819595-a7839811-5653-4ec0-84b8-28851c4cafd8.png)


실패율은 29%를 찍었지만 서킷은 여전히 닫혀(closed)있는 것을 볼 수 있습니다.

이제 서킷을 열어봅시다. 실패율을 30%로 맞춰보겠습니다.

`http://localhost:8080/many-calls?ok=70&error=error=10)30`

![image](https://user-images.githubusercontent.com/26597702/271819620-015e247e-00f8-42ad-8d1e-f637a64295a7.png)

서킷이 열렸군요!

이제 오픈 상태에선 `waitDurationInOpenState`(3초)동안 아무리 호출을 해도 실패가 떨어질 것입니다.

3초 후에 HALF_OPEN 상태에선 `permittedNumberOfCallsInHalfOpenState` 를 따르는데요, 여기서 10개의 호출을 시범삼아 보내보고, 앞서 설정했던 `failureRateThreshold` 퍼센트를 또 확인합니다.

여기서 만약 실패율이 30%이상이면 다시 OPEN 상태로 변하고, 30% 미만이면 CLOSED 상태로 변합니다.

서킷이 다시 열리도록 한 번 **성공7실패3** 으로 호출해보겠습니다.

`http://localhost:8080/many-calls?ok=7&error=3`

여전히 위 그래프와 똑같이 서킷이 열려있는걸 확인할 수 있습니다.

![image](https://user-images.githubusercontent.com/26597702/271819624-961cf440-008e-42f8-aaf7-886c0dbe9813.png)

한 번 서킷을 닫아봅시다. **성공8실패2** 로 호출해보겠습니다.

![image](https://user-images.githubusercontent.com/26597702/271819627-5dfd72a3-ea0e-4fd5-83e3-f00e657e7fc9.png)

실패율은 20%로 변하고 서킷이 다시 닫히는걸 볼 수 있습니다. 이제 호출이 다시 정상적으로 이루어집니다.

여기까지 간단하게 자바 서킷 브레이커 라이브러리인 `resilience4j`를 사용해봤습니다.

기회가 된다면 Slow call을 실패로 처리하는 `@TimeLimiter`도 포스팅해보겠습니다.

감사합니다.

참고: [https://mangkyu.tistory.com/290](https://mangkyu.tistory.com/290)

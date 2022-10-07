---
date: '2022-08-13'
title: '키퍼 홈페이지 리뉴얼 4 - 개발 초기 환경 설정 (Spring Security)'
categories: ['keeper_homepage']
summary: '오늘 동아리 회장 선거를 진행했는데, 동아리원들이 직접 만든 선거 페이지로 선거를 진행했습니다. 실시간 투표율부터, 투표 결과를 다이나믹한 애니메이션으로 보여줘서 너무 감격이었습니다. 감동 받은 김에 홈페이지 관련 글을 하나 더 써보려고 합니다!'
thumbnail: './thumbnail/SpringSecurity.png'
---

> 오늘 동아리 회장 선거를 진행했는데, 동아리원들이 직접 만든 선거 페이지로 선거를 진행했습니다. 실시간 투표율부터, 투표 결과를 다이나믹한 애니메이션으로 보여줘서 너무 감격이었습니다. 감동 받은 김에 홈페이지 관련 글을 하나 더 써보려고 합니다!

## 아직 개발 시작 전...
앞선 블로그에서 말했듯이 **인증/인가**파트 역시 개발 전에 진행해야 하는 부분이었습니다. 본격적인 개발 전에 반드시 진행해야 한다고 생각한 이유는 아래와 같습니다.
1. 인증/인가 파트는 모든 기능에 영향을 미치는 **횡단 관심사**입니다. 그렇기 때문에 해당 기능 없이 개발을 하다가 후에 많은 부분을 변경해야 할 지도 모르는 상황이었습니다.
2. 우연히 본 [어떤 영상](https://www.youtube.com/watch?v=aEk-7RjBKwQ)에서 Spring Security가 어려운 기술이라고 했습니다. **시간이 얼마나 걸릴 지 모르는 블랙박스** 파트였기 때문에 무엇보다 먼저, 우선순위를 두고 개발에 착수해야 했습니다.

위와 같은 이유들 때문에 PM인 제가 먼저 **인증/인가** 파트를 개발해놓기로 결심했습니다.

## 이게 뭐람
Spring Security를 알기 위해 굉장히 많은 사전 지식이 필요했습니다. 하지만 공부했던 자세한 내용을 적는건 리뷰글에 어울리지 않기 때문에 최대한 쉽게 풀어서 쓰도록 하겠습니다!

### 쿠키, 세션, JWT
일단 인증/인가 방식을 결정해야 했습니다. 후보군은 총 쿠키, 세션, JWT로 3개가 있었습니다. 그 중에 저희는 JWT를 선택했는데, 그 이유는 아래와 같습니다.
1. **쿠키**: 클라이언트 단에서 아무 암호화 없이 저장되서 너무 위험함.
2. **세션**: 웹 도메인의 핵심인 HTTP가 stateless한데, 세션은 뭔가 stateful한 느낌이 강함.
3. **JWT**: 클라이언트 단에서 저장되지만 암호화 되어 있고, stateless함.

### 필터, 인터셉터, AOP
다음으로 이해해야 하는 부분은 **필터**였습니다. Spring Security는 필터단에서 구성됩니다. 횡단 관심사를 쉽게 개발해주기 위해 스프링 생태계에선 크게 필터, 인터셉터, AOP로 나뉘어지는데 각각의 차이는 어느 위치에서 횡단 관심사를 구현하는 지에 있습니다. 해당 내용을 이해하는데 [이 글](https://goddaehee.tistory.com/154)의 도움을 많이 받았습니다. 

필터는 쉽게 말하면 **스프링에서 본격적으로 요청을 처리하기 전에** 거쳐가는 길이라고 생각하시면 됩니다. 아래 그림에서 **파란 화살표**로 왔다갔다 하는 길이 Spring Security의 필터층입니다.

![image](https://user-images.githubusercontent.com/26597702/184363097-4b77d9fc-b56a-455b-985d-ddd515d8334d.png)

필터층을 잘 보시면 `JwtFilter`라던가 `BearerFilter` 같은 JWT 전용 필터가 없습니다. Spring Security에서 공식적으로 지원해주지 않는 필터층이기 때문에 직접 구현해서 넣어야 했습니다. 

### @Secured
`@Secured`나 `@PreAuthorize`를 사용하면 중앙에서 인증을 관리하는 것이 아니라, 각 컨트롤러에서 인증/인가 허용 범위를 조절할 수 있었습니다. 모든 url의 인증/인가를 중앙에서 관리하는 것보단 각각의 컨트롤러에서 관리하는 것이 훨씬 깔끔하고 가독성도 높다고 생각했기 때문에 `@Secured`를 사용하기로 결정했습니다.

```java
http
    .authorizeRequests() // 다음 리퀘스트에 대한 사용권한 체크
    .antMatchers("/*/signin", "/*/signup").permitAll() // 가입 및 인증 주소는 누구나 접근가능
    .antMatchers(HttpMethod.GET, "helloworld/**")
    .permitAll() // hellowworld로 시작하는 GET요청 리소스는 누구나 접근가능
    .anyRequest().hasRole("USER") // 그외 나머지 요청은 모두 인증된 회원만 접근 가능
```
위 코드는 중앙 config에서 모든 인증/인가를 관리하는 것입니다. 하지만 `@Secured`를 사용하면 아래와 같이 각 컨트롤러에서 관리할 수 있습니다. 각 컨트롤러에서 관리할 수 있다면 중앙 제어 코드는 필요 없다고 생각했기 때문에 **위의 중앙에서 관리하는 코드를 모두 제거했습니다.** (하지만 이게 예상치 못한 버그를 낳는 일로 이어집니다.)
```java
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/members")
@Secured("ROLE_USER") // ROLE_USER 권한만 접근 가능!
public class MemberController { ... }
```

## 이후에 개선한 점
JWT 필터를 어떻게 구현하고, 어떻게 삽입할 지에 대해 고민을 많이 했고, 결국 구글링을 통해 코드를 집어넣었습니다. 그 과정에서 생긴 약간의 문제점들과 개선한 내용에 대해 작성하겠습니다.
### 1. DB 접근
세션과 JWT의 가장 큰 차이 중 하나가 DB에 부하가 걸리느냐 아니냐입니다. 세션은 매번 DB를 뒤져서 해당 요청의 사용자가 올바른 세션코드를 가지고 있는 지 확인해야 하지만, JWT는 토큰 내부적으로 인증/인가에 필요한 모든 정보를 담고 있기 떄문에 그럴 필요가 없어야 합니다.

하지만 구글링해서 가져온 코드에서는 아래와 같이 매번 DB에 접근하여 회원 정보를 가져오고, 그 정보로 인증/인가를 시도하고 있었습니다.
```java
public UserDetails loadUserByUsername(String userPk) {
  return memberRepository.findById(Long.valueOf(userPk))
      .orElseThrow(CustomMemberNotFoundException::new);
}
```
이렇게 불필요한 DB 접근은 필요없다고 판단했고, 직접 JWT에서 권한 파트를 파싱해서 해당 내용으로 인증/인가를 진행하도록 변경하였습니다.

### 2. Member Entity의 지저분해짐
`Spring Security`는 내부적으로 `Security Context`라는 인증/인가 context를 사용합니다. 이 `Security Context`에 해당 회원의 인증/인가 정보를 담는데, 이 때 아이디는 일치하는지, 비밀번호는 일치하는지와 같은 메서드를 가지는 `UserDetails` 인터페이스를 구현해야 했습니다. 처음엔 이를 아래와 같이 모두 `MemberEntity`에 구현했습니다. 하지만 `MemberEntity`가 하는 역할이 많아지고 FK를 많이 가질 수록 커지고 복잡해졌습니다.
```java
public class MemberEntity implements UserDetails
```
그래서 JWT 인증/인가 전용 `JwtEntity`를 따로 만들어서 구현하였습니다.
```java
public class JwtMemberEntity implements UserDetails {

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    ...
  }

  @Override
  public String getPassword() { return ""; }

  @Override
  public String getUsername() { return id; }

  @Override
  public boolean isAccountNonExpired() { return true; }

  @Override
  public boolean isAccountNonLocked() { return true; }

  @Override
  public boolean isCredentialsNonExpired() { return true; }

  @Override
  public boolean isEnabled() { return true; }
}
```

### 3. 모든 비인증/비인가 요청이 403 Forbidden으로 옴

<img width="492" alt="image" src="https://user-images.githubusercontent.com/26597702/184517233-ad0c6ad8-75a1-48b4-a863-16a5406aae4d.png">

인증/인가에는 두 가지 방식의 요청 거부가 있습니다. 인증이 되지 않은 사용자에게 던지는 401 요청 거부, 인가가 되지 않은 사용자에게 던지는 403 요청 거부입니다. 그런데, 어떤 요청이 와도 저희 프로젝트에선 403 Access Denied를 일으켰습니다. 그 원인에 대해 조사한 내용에 대해 말씀드리겠습니다.

앞서 `@Secured`를 설명하는 내용에서 아래 코드를 모두 제거했었습니다.
```java
http
    .authorizeRequests() // 다음 리퀘스트에 대한 사용권한 체크
    .antMatchers("/*/signin", "/*/signup").permitAll() // 가입 및 인증 주소는 누구나 접근가능
    .antMatchers(HttpMethod.GET, "helloworld/**")
    .permitAll() // hellowworld로 시작하는 GET요청 리소스는 누구나 접근가능
    .anyRequest().hasRole("USER") // 그외 나머지 요청은 모두 인증된 회원만 접근 가능
```
제 계획은 `@Secured`를 사용하지 않은 Controller는 모두 접근이 가능하고ㅠ, `@Secured`를 사용한 Controller에 토큰이 없거나 잘못됐다면 401 Unauthorized 에러를 발생시키는 것이었습니다. 하지만 Spring Security에서 토큰이 없거나 잘못된 사용자를 막지 않았고, 그저 인증은 됐지만 권한이 없는 사용자라고 판단하여 403 Access Denied 에러만 낼 뿐이었습니다. 이유는 바로 아래 필터에 있었습니다.

<img width="137" alt="image" src="https://user-images.githubusercontent.com/26597702/184517252-b1d3cb20-60c9-4b9f-9a6b-ea8889f02d84.png" style="margin:auto; display:block">

눈여겨 봐야 할 부분은 `Anonymous AuthenticationFilter` 였습니다. 토큰이 없거나 잘못되어서 인증이 되지 않았다고 생각했던 모든 사용자가 Anonymous라는 사용자로 둔갑해서 지금까지 동작해 왔던 것이었습니다. 401에러와 403에러를 구분하기 위해서 어떤 인증이라도 필요한 controller의 경우엔 위에서 삭제했던 코드를 다시 살려야 했습니다.

## 아쉬운 점
그럼에도 아직 부족한 부분이 많았습니다. 인지는 하고 있지만 꽤 시간이 걸릴 것 같아서 개발하지 않은 부분은 아래와 같습니다.

### 1. 로그인을 `UsernamePasswordAuthenticationFilter`를 사용하지 못한점
앞선 필터에서 `UsernamePasswordAuthenticationFilter`라는 필터가 있었습니다. username과 password를 이용해 인증/인가를 진행하는 부분인데, 저희의 로그인 방식도 username, password 방식을 따르기 때문에 필터단에서 처리할 수 있을 것 같습니다.
### 2. OAuth2로 SNS 로그인 구현하지 못한 점
OAuth2는 당시 최우선과제가 아니었습니다. 일단 인증/인가를 할 수 있도록 해놓는 것이 목표였기 때문에 미뤄졌지만, 꼭 개발해보고 싶은 부분 중 하나입니다.
### 3. refresh token
현재는 토큰이 만료되면 곧바로 로그인창을 띄워서 다시 로그인 하도록 되어있습니다. 하지만 JWT 특성상 만료시간을 짧게 두기 때문에, 사용자가 계속해서 로그인을 해야 하는 불편함이 있습니다. 이 부분도 꼭 개발하고 싶은 부분입니다.

## Spring Security
글을 작성하다보니, 생각보다 깊이 들어가는 것 같습니다. 최대한 기술적인 내용을 제외하려 했는데, 기술적인 내용을 제외하려니 문제가 생긴 부분을 설명 할 수가 없어서 기술적인 부분이 자꾸 추가되었습니다. 리뷰글인 만큼 다음엔 최대한 쉽게 풀어쓰도록 노력 해보겠습니다!

다음 글은 저희 팀이 어떻게 개발 했는 지 **개발 과정**에 대해 작성해보겠습니다. 그럼 안녕~
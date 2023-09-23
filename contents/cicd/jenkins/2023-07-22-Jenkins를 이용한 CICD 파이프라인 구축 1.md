---
date: '2023-07-22'
title: 'Jenkins를 이용한 CI/CD 파이프라인 구축 1'
categories: ['jenkins']
summary: 'DevOps는 무엇이고 CI/CD는 왜 탄생했는지 알아보자!'
thumbnail: './thumbnail/choonsik_jenkins.jpeg'
---

> **DevOps는 무엇이고 CI/CD는 왜 탄생했는지 알아보자!**

## DevOps & CI/CD

전통적인 개발 방식중에 대표적으로 Waterfall vs Agile 이 있습니다.

**Waterfall**: 요구사항 정의부터 분석/설계 구현 등 한 사이클에 순차적으로 모두 완성하는 방법론.

**Agile**: 시시각각 변하는 요구사항을 반영하기 위해 빠르고 유연하게 대처하는 방법론.

두 소프트웨어 개발론 중에 무엇이 정답이라곤 할 수 없습니다. 각자의 상황에 맞는 방법론을 선택하면 됩니다.

![image](https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/1c591287-48d4-4e4e-98b5-6411d25c50a2)

요즘은 클라우드, MSA가 성황하면서 DevOps라는 방법론이 등장했습니다.

### Cloud Native Application

Cloud Native Application의 대표적인 기술론 크게 `CI/CD`, `Devops`, `Microservices`, `Containers`가 있습니다. 각각에 대해서 알아보겠습니다.

![image](https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/3b016b56-673c-49d9-ab80-0e7de4df8bb3)

**MicroServices**: Inner Architecture와 Outer Architecture로 이루어지는데, Inner는 비즈니스 로직을 가지는 애플리케이션을 의미하고 Outer는 Inner가 잘 동작할 수 있도록 서포팅해주는 것들을 말함.

**Containers**: 컨테이너라이징. 도커 사용하는걸 말함.

**DevOps**: 옛날엔 개발과 배포를 다른 조직에서 관리했는데, 엔지니어가 지속적인 통합 및 배포(CI/CD)를 하면서 유기적으로 코드를 관리하고 배포할 수 있도록 하는 문화.

> 각각의 기술에 사용되는 도구들 예시. 지금은 몰라도 상관 없습니다.
> ![image](https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/518b27fd-a8c8-475e-abce-ef29738fea80)

마지막으로 CI/CD에 대해 알아보겠습니다.

## CI/CD ?

CI (Continuous Integration) ⇒ 뭘 통합한다는거야?

- 여러 개발자들의 코드를 계속해서 통합하는 것.

CD (Continuous Delivery) ⇒ 뭘 배달한다는거야?

- 사용자에게 최신의 제품(코드)를 지속적으로 배달하는 것.
- 코드 베이스가 항상 배포 가능한 상태를 유지하는 것.

### CI가 왜 필요할까?

10명의 개발자가 열심히 개발했는데 갑자기 합쳐서 배포했을 때 서비스가 안돌아간다…! 누구 때문인가..!

- 찾기 힘듦.

10명의 개발자가 열심히 개발! → 커밋 → 로컬 테스트 실패 → 수정해서 다시 커밋 → 성공! → 코드베이스에 머지!

- git 같은걸 활용하면 쉬움.

### CD가 왜 필요할까?

특정 시점에서만 배포시 하나의 배포에 **너무 많은 긴장, 부담이 들어감.**

### 여러 배포 환경의 관리

배포 환경은 아래와 같이 여러 배포 환경이 존재할 수 있습니다.

- 개발자가 개발하는 Local PC 환경
- QA 엔지니어들이 사용하는 환경
- 실제 프로덕트가 돌아가는 서버 환경

각 배포 환경에서 어떤 것이 변수인지 이해하고 이를 잘 설계하는게 핵심입니다.

## 이번 강의에서 사용할 CI/CD Flow

Jenkins, TravisCI, CircleCI등 여러 CI 툴이 있지만 우린 **Jenkins**를 사용할 예정이고, 빌드된 결과물 배포방법은 **ANSIBLE**, 빌드된 결과물을 실행시키는 방법으론 **k8s**를 사용할 예정입니다.

> 강의에선 Maven을 사용하지만 저는 이번 프로젝트에서 **Gradle**을 사용해 진행하겠습니다.

아래의 과정을 로컬에서 모두 구현해보고 클라우드에서도 진행해볼 예정입니다.

![image](https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/90a25b49-b8ce-4700-addb-d72556b0a739)

## ref

[Jenkins를 이용한 CI/CD Pipeline 구축 - 인프런 | 강의](https://www.inflearn.com/course/젠킨스-ci-cd-파이프라인/dashboard)

[[토크ON세미나] Jenkins를 활용한 CI/CD 1강 - 젠킨스(Jenkins) 이해 | T아카데미](https://www.youtube.com/watch?v=JPDKLgX5bRg)

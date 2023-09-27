---
date: '2023-07-22'
title: 'Jenkins를 이용한 CI/CD 파이프라인 구축 2'
categories: ['jenkins']
summary: 'jenkins 시작하기'
thumbnail: './thumbnail/choonsik_jenkins.jpeg'
---

> **jenkins 시작하기**

## Jenkins 시작해보기

## Jenkins 설치

`brew install jenkins-lts`

`brew servies restart jenkins-lis`

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/f2ff1a9d-34ee-4be3-9963-10db07587ff0">

이쁜 UI

<img width="700" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/6fe883c9-4377-4c39-93a8-ea174db58eaa">

Pipeline, Github, Gradle 같이 우리한테 필요한걸 잘 다운받는 모습입니다.

## Jenkins Pipeline 추가

jenkins pipeline 구성 파일을 작성해 보겠습니다.

간단하게

1. jenkins 레포를 클론해오고
2. hello를 찍은 뒤
3. gradle로 프로젝트를 빌드하는 pipeline을 작성해 보겠습니다.

```groovy
node {
    stage('clone') {
        print("git clone start...!")
        git url: "https://github.com/gusah009/jenkins-study.git" // 깃헙 주소
        print("git clone done...!")
    }

	def hello = 'Hello gusah' // 변수 선언
	stage('print test') {
        print(hello) // 함수 및 변수 사용
    }

    stage ('test build') {
        sh "./gradlew build"
    }
}

void print(message) { // 함수 선언
    echo "${message}"
}
```

돌려보면..!

<img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/78df59f8-44c2-4656-85ea-23c1d7d393fa">

_박살…_

원인은 jenkins에서 git clone을 해 올 때 default 브랜치를 master로 잡아서였는데요,

23년 현재 github 초기 default 브랜치는 master가 아니라 main이므로 main 브랜치로 수정해주면 됩니다.

```groovy
git branch: "main", url: "https://github.com/gusah009/jenkins-study.git" // 깃헙 주소
```

<img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/99d79d58-01a3-44d4-9034-3545b00536df">

`clone`, `print test` 는 성공!

이제 간단하게 자바 코드를 넣고 빌드해 봅시다.

<img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/7ab5e2cd-2673-4767-9277-b5da46271f92">

빌드도 성공!

## Jenkins 자동 배포 설정해보기

이제 github에서 코드가 올라오면 자동으로 배포하는 pipeline을 만들어보겠습니다.

### Git, Gradle 적용

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/7292078c-13e3-437f-84d3-eb592384c66c" >

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/548bcf8a-3e68-47ed-975e-fcb561bc0521" >

위와 같이 플러그인이 제대로 깔려있다면 free-style Item을 새로 만들고 아래와 같이 설정을 해줍니다.

<img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/fca7305d-91ae-4b56-80d6-dfe60472177f" > <img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/8907fd2d-8121-4004-8860-58ca3030bc55" >

<img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/cf06aefe-d4b2-4f6b-8bf0-b7f235d1e5b3" > <img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/95419888-0003-48ad-8ad2-4f8d7aea1e79" >

---

![image](https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/8bc6f319-eef3-4b86-85a9-067249f36163)

간단하게 커밋을 하나 올리고 다시 빌드해보면

![image](https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/a7ac1a82-f61b-447d-a094-675e680d2961)

커밋된 내역을 가지고 와서 새로운 코드로 다시 빌드해주는걸 볼 수 있습니다.

### 주기적으로 업데이트된 내용을 확인해서 빌드하기

설정에서 poll SCM을 `* * * * *` 로 설정해주면 매분마다 깃을 확인하는데, 이 때 깃에 변경사항이 있다면 빌드를 쭉 진행해줍니다.

### 젠킨스로 서버 배포해보기

> 저는 오라클 프리티어 인스턴스에서 진행했습니다.

먼저, 젠킨스에 아래와 같이 `Publish Over SSH` 플러그인을 설치해줍니다.

<img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/c9996d7d-a0d6-46f3-a37b-be15eec0be95" >

플러그인을 설치하면 Jenkins 관리 → 설정에 **Publish Over SSH** 란이 생겼을텐데, 아래처럼 ssh 연결을 위한 설정을 해줍니다.

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/da7cf7ac-426a-43ee-aa2a-78d66c1f62c8" >

그리고 **"빌드 후 조치"** 로 아래와 같이 적용해주면 원격 오라클 서버에서 spring이 실행됩니다/

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/023d6bd0-f374-4ade-94ac-e9150e76f7b5" >

로컬에서 오라클 서버의 8080포트로도 잘 접속이 되는걸 볼 수 있습니다.

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/df71395d-1d19-4857-88b1-7be07259fe13" >

하지만 프로세스가 작동중인 상태에서 위의 명령어로 또 배포를 한다면 어떻게 될까요?

포트가 이미 사용중이라 다른 포트로 뜰 수도 있고, 프로세스가 아예 뜨지 않을 수도 있어서 이를 문제를 해결해 줘야 합니다.

> 사실 java -jar로 애플리케이션을 띄우면 8080포트로 계속 listen 하고 있기 때문에 젠킨스 입장에선 ssh로 들어간 내 워커가 영원히 오라클 서버를 물고있는 상황이 됩니다.
>
> 그래서 **Publish Over SSH**의 기본 timeout인 12초가 지나면 자연스럽게 연결이 끊기게 되고, 젠킨스 입장에선 timeout으로 빌드가 실패했다고 하지만 오라클 서버에는 애플리케이션이 잘 구동되고 있는 상황입니다.

해결하는 방법은 3장에서 계속…

## ref

[Jenkins를 이용한 CI/CD Pipeline 구축 - 인프런 | 강의](https://www.inflearn.com/course/젠킨스-ci-cd-파이프라인/dashboard)

[[토크ON세미나] Jenkins를 활용한 CI/CD 3강 - 젠킨스 CI/CD 파이프라인 구성 실습(1) | T아카데미](https://www.youtube.com/watch?v=GOLHN3FHjpI)

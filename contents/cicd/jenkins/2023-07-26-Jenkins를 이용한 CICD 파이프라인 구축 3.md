---
date: '2023-07-26'
title: 'Jenkins를 이용한 CI/CD 파이프라인 구축 3'
categories: ['jenkins']
summary: 'ansible docker 연동하기'
thumbnail: './thumbnail/choonsik_jenkins.jpeg'
---

> **ansible docker 연동하기**

이번엔 jenkins와 배포에 필요한 도구들인 ansible, docker를 연동하는 과정을 진행해 보겠습니다.

## DevOps Tools

1. Kubernates
2. docker
3. lstio
4. GitHub Actions
5. Jenkins
6. Prometheus
7. **Ansible - 이번 강의에서 다룰 것~**
8. Chef

…

## Ansible 기초

**IaC**(Infrastructure as Code): 우리가 가지고 있는 코드로 인프라를 관리하는 방법

- 시스템, 하드웨어, 인터페이스의 구성 정보를 파일(스크립트)로 관리하는 방법.

**IaC를 사용하기 전:** 특정 서버가 다운됐을 때 필요한 서버를 증설하고 사용중이던 서버를 중지시켜 야됨. (수동으로)

**IaC 도입 후:** ansible 서버가 각 서버들을 관리할 수 있도록 설정해두고 서버의 목록이나 서버 설정 파일을 가지고 있으면서 서버가 다운됐을 때 ansible이 자동으로 서버를 추가해줄 수 있음.

**Ansible:** 여러개의 서버를 효율적으로 관리할 수 있게 해주는 환경 구성 자동화 도구로 Push 기반임.

**Ansible의 결과:** `ok` / `fail` / `unreachable` / `changed`

### 도커 설치

Ansible 서버를 로컬에 설치해 보겠습니다.

`docker pull edowon0623/ansible-server:m1`

```bash
docker run --privileged \
  --name ansible-server -itd \
  -p 20022:22 -p 8081:8080 \
  -e container=docker \
	-v /sys/fs/cgroup:/sys/fs/cgroup --cgroupns=host \
	edowon0623/ansible-server:m1 /usr/sbin/init
```

### ansible 서버와 오라클 서버 연결

ansible 도커 설치 후 ansible-server 도커 안에서 `vi /etc/ansible/hosts` 명령어로 아래와 같이 설정을 해줍니다.

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/7faa41c5-7f92-484e-b09c-52839236d2e0">

빨간 네모 부분은 관리할 host의 도메인 주소(IP 주소)를 넣어주면 됩니다.

### ansible 기본 명령어

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/1cc69e15-b740-4633-81e0-9292794ca052">

또 ansible은 멱등성이란 특징을 가지고 있는데, 어떤 동작을 몇 번을 하든 한 번만 적용되는 것을 의미함. (조금 다르지만…)

<img width="600" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/51d0b1d1-491d-4920-a8e1-73f5c22b9e1f">

위와 같이 echo로 `/etc/ansible/hosts`에 mygroup을 추가하면 당연히 2번 들어가게 됩니다. 하지만 ansible로 같은 동작을 반복하면 1번만 들어간다는 사실..!

> ansible에서 멱등성을 유지하는 원리는 모듈 개발자가 직접 하나하나 멱등성을 지켜주도록 개발을 했기 때문입니다. 개인이 만든 모듈에서 멱등성을 지키지 않도록 개발이 되었다면 ansible을 이용하더라도 멱등성이 지켜지지 않을 수도 있습니다.

### Ansible Module

ansible ↔ hosts 연결 확인

`ansible all -m ping` 명령어를 사용하면 내가 등록한 hosts 들에게 ansible이 잘 연결되는지 확인할 수 있습니다.

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/0ffe4125-6343-4d60-b374-2265004f76e2">

그래서 위와 같이 host의 private_key를 주석처리하면 **아래와 같이 실패하는 것**을 볼 수 있습니다.

<img width="600" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/b2fd100b-658b-4063-8f1a-cfec95c24dcc">

### Copy 해보기

Ansible 서버의 test.txt를 오라클 서버로 copy 해보겠습니다.

`ansible all -m copy -a "src=./test.txt dest=/tmp”`

위 명령어를 이용하면 아래와 같이 test.txt가 원격 서버에 잘 복사된걸 볼 수 있습니다.

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/d6144dc8-d741-462e-8c25-7e7e42834f66">

## Ansible Playbook

`Ansible Playbook`은 매번 위와 같이 명령어를 칠 수 없으니 사용자가 원하는 내용을 미리 작성해 놓은 파일입니다.

- yaml 형식으로 작성됩니다.

### 파일 수정 실습

<img width="300" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/4be83404-6b85-40a0-a09e-5f97f398c0b8">

위와 같이 playbook을 작성하고 `ansible-playbook first-playbook.yml` 명령어로 실행해보겠습니다.

<img width="500" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/5f2924ff-052a-404d-b410-b29150e42cce">

위와 같이 **_[mygroup]_** 이 추가된 것을 볼 수 있습니다.

> 멱등성이 적용되기 때문에 한 번 더 `ansible-playbook first-playbook.yml` 명령을 수행해도 **_[mygroup]_** 은 한 번만 추가됩니다.

### 파일 COPY 실습

```yaml
- name: Ansible Copy Example Local to Remote
  hosts: devops
  tasks:
    - name: copying file with playbook
      copy:
        src: ~/sample.txt
        dest: /tmp
        owner: opc
        mode: 0644
```

ansible 서버의 파일들을 devops hosts로 전달하는 실습을 진행해보겠습니다.

아래와 같이 `sample.txt` 파일이 잘 전달된 것을 볼 수 있습니다.

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/39e5de93-98ff-4504-ba82-b2e366442cd7">

### Ansible 서버 Jenkins 연동

<!-- [Jenkins를 이용한 CI/CD 파이프라인 구축 - 2장](https://www.notion.so/Jenkins-CI-CD-2-b2deac90df8743bfb3132ae1a5f0befa?pvs=21) 에서 나온 **Publish Over SSH**를 이용해 Ansible 서버도 설정을 해줍니다. -->

### Ansible Playbook으로 Ansible 서버에서 오라클 서버로 jar 배포하기

아래와 같이 ansible Playbook을 작성해주면 끝!

> _강의와 다르게 환경을 구성해서 많이 고생했네요... ㅠㅠ_

<img width="600" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/6e0f0545-096f-420b-bd6a-697a94304bf4">

1. 8080 포트에 떠있는 프로세스를 죽인다 (jar)
2. 원래 있던 jar 파일을 삭제한다.
3. 새로운 jar 파일로 복사한다.
4. 백그라운드로 jar를 띄운다.

다음 장에선 k8s에 연동해보는 과정을 공부해보겠습니다!

## ref
[Jenkins를 이용한 CI/CD Pipeline 구축 - 인프런 | 강의](https://www.inflearn.com/course/젠킨스-ci-cd-파이프라인/dashboard)
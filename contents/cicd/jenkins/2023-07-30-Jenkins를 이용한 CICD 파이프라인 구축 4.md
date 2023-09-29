---
date: '2023-07-30'
title: 'Jenkins를 이용한 CI/CD 파이프라인 구축 4'
categories: ['jenkins']
summary: 'k8s와 연동하기'
thumbnail: './thumbnail/choonsik_jenkins.jpeg'
---

> **k8s와 연동하기**

## k8s 설치하기

k8s란 쿠버네티스의 약자로 도커같은 컨테이너들을 오케스트레이션 해주는 도구입니다.

k8s를 연동하기 전에 먼저 k8s를 설치해야겠죠?

k8s를 설치하는 방법이나 문서는 너무 많기 때문에 생략하고 개인적으로 k8s를 설치하면서 겪은 문제 과정들을 공유하도록 하겠습니다.

### 서론

강의에선 로컬에 k8s를 싱글노드로 달았지만 **멀티노드 클러스터**를 꼭 만들어보고 싶어서 오라클 서버 2대에 적용해봤습니다.

> 하지만 쉽지않은 길이었습니다... ㅠㅠ

### 삽질기

1. **오라클 서버의 메모리 부족**
    - 기본적으로 k8s는 1700MB 이상의 램을 요구합니다. 따라서 오라클에서 무료로 제공하는 서버(메모리 1기가)로는 애초에 k8s를 띄울 수 없었습니다.
2. **m1 mac에서 k8s 마스터 구동 불가.**
    - 그래서 램이 넉넉한 로컬에서 k8s 마스터를 띄워보려 했지만 맥에선 구동이 안되더라구요…
3. **오라클 서버 기본 OS : centOS**
    - 메모리가 부족했기에 경량화 k8s인 **k3s**를 사용해보려 했는데, k3s가 ubuntu만 지원했습니다… 우쒸 결국 클라우드 서버 다 닫고 ubuntu로 새로 열었습니다...
4. **포트 안엶.**
    - k8s는 6443 포트가 꼭 열려있어야 하는데, 바보같이 클라우드 설정에서만 열어뒀습니다. 아래처럼 OS의 iptable도 갱신해줘야 하더라구요.
        
      <img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/8e94a961-9262-488e-a461-f2b56bf8b99a">

### 성공 !

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/29c376d6-fc95-4fd4-9f44-29d9421ea670">

### 구조도

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/3b1e1db2-2e5d-4243-a5c7-75bb4c81f12e">

# Jenkins + Ansible + k8s

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/e52e2fec-abe9-483c-bc59-0d00b75f610f">

개인 공부 환경 [전체 구조]

### Ansible로 k8s에 deploy 하기

먼저 `springio에서` 제공해주는 `sample-spring` 이미지를 k8s에 올려보겠습니다.

- k8s deployment, service
    
    ```yaml
    kind: Deployment
    metadata:
      name: cicd-deployment
    spec:
      selector:
        matchLabels:
          app: cicd-devops-project
      replicas: 2
    
      template:
        metadata:
          labels:
            app: cicd-devops-project
        spec:
          containers:
          - name: cicd-devops-project
            image: springio/gs-spring-boot-docker
            imagePullPolicy: Always
            ports:
            - containerPort: 8080
    ```
    
    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: cicd-service
      labels:
        app: cicd-devops-project
    spec:
      selector:
        app: cicd-devops-project
      type: NodePort
      ports:
        - port: 8080
          targetPort: 8080
          nodePort: 32000
    ```
    
이미지를 올렸다면, 이제 ansible playbook을 이용해 k8s deployment와 service를 배포해보겠습니다.

```yaml
- name: Create pods using deployment
  hosts: k8s
  # become: true
  # user: ubuntu

  tasks:
  - name: delete the previous deployment
    command: kubectl delete deployment.apps/cicd-deployment
    ignore_errors: True

  - name: create a deployment
    command: kubectl apply -f cicd-devops-deployment.yml
    args:
      chdir: /home/ubuntu/k8s
```

```yaml
- name: create service for deployment
  hosts: k8s
  # become: true
  # user: ubuntu

  tasks:
  - name: create a service
    command: kubectl apply -f cicd-devops-service.yml
    args:
      chdir: /home/ubuntu/k8s
```

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/4a3fc7f6-1f87-4bc1-8c5d-a40c73316cb3">

cicd-deployment가 잘 올라가있는것을 볼 수 있습니다.

> 위 툴은 k9s라는 툴입니다.

> 허약한 오라클 서버의 스펙으론 마스터 노드를 버티기 힘들었는지 자꾸 죽어나갔습니다...
> 
> <img width="600" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/cc4412bb-2bea-4caf-8d38-ad963b3eddef">

> 

이번엔 service를 올려보겠습니다.

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/6391a714-80df-4131-8e1d-708041f2fbe5">

그러고 나면 아래와 같이 32000포트에 sample spring 애플리케이션이 잘 열린걸 볼 수 있습니다.

<img width="400" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/18a513b1-a6fc-4b25-a6ba-5a5d5f012952">

### 이 과정을 Jenkins에 얹어서 진행해보기

위에서 수동으로 진행했던 과정을 jenkins에 그대로 올려주면 되서 과정 자체는 간단합니다.

그저 빌드 후 명령어에 `ansible-playbook deployment`, `service`만 넣어주면 끝입니다.

<img width="500" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/a5a956a4-5dd4-4fcd-acb3-7d46655f4274">

## Docker를 얹어서 내 애플리케이션 올려보기

`playbook.yml`은 아래와 같습니다.

```yaml
- hosts: devops[0]
#   become: true

  tasks:
  - name: Copying jar from ansible server to devops server
    copy:
      src: "/root/jenkins-study-0.0.1-SNAPSHOT.jar"
      dest: "/home/ubuntu/docker"

  - name: login into DockerHub if not login
    docker_login:
      username: ****
      password: ****

  - name: create a docker image with deployed waf file
    command: docker build --platform linux/amd64 -t gusah009/cicd-project-ansible .
    args: 
        chdir: /home/ubuntu/docker
    
  - name: push the image on Docker Hub
    command: docker push gusah009/cicd-project-ansible

  - name: remove the docker image from the ansible server
    command: docker rmi gusah009/cicd-project-ansible  
    ignore_errors: yes
```

각 부분에 대한 설명)

- `hosts: devops[0]` :  docker image 빌드를 여러곳에서 할 필요 없으니 한 곳에서만 하도록 설정
- `tasks.copy` : jenkins에서 빌드되어 ansible 서버로 온 jar 파일을 다시 docker build할 곳으로 넘겨준다.
- `tasks.docker_login` : docker hub에 docker image를 올려야 하기 때문에 로그인을 해준다.
- `tasks.docker_build` : 도커 빌드
- `tasks.docker_image_push` : 만들어진 도커 이미지를 docker hub에 올린다.
- `tasks.docker_rmi` : docker hub에 올렸으면 방금 만든 이미지는 삭제한다.

### 애플리케이션 올리기

도커 이미지를 빌드해서 docker hub에 올렸다면 그 이미지를 받아서 위의 deployment, service를 갱신해주는 작업을 하면 됩니다.

그럼 아래처럼 나의 애플리케이션 파일이 배포되어 있는걸 볼 수 있습니다.

<img width="200" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/e7aae591-0265-4941-b7d0-af144242cf8e"><img width="200" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/097116e4-5ba5-4566-a902-54818d06f0cd">

---

> *오라클 서버가 너무 느려서 봤더니 **메모리 사용량이 계속 80~90%** 가 찍히고 있었습니다…
이유는 스왑 메모리를 사용하고 있지 않아서 였는데, k8s를 사용하면 기본적으로 스왑 메모리를 사용하지 않도록 합니다.
이유는 k8s가 노드들의 리소스를 확인하고 적절한 곳에 파드를 분배해야 하는데 스왑 메모리가 켜져있으면 파드의 현재 리소스를 파악할 수 없기 때문입니다.
**하지만 저는 개발용으로 사용중이어서 그냥 스왑 메모리를 켜버렸습니다.***
> 
> 
> <img width="500" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/72d67dd1-20c8-4a0c-80bd-fd52e4f8705e">
>
> *before*
> 
> <img width="500" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/c7ac8d78-edc3-4905-be7a-ba6d98a94f29">
>
> *after*
> 
> <img width="500" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/d1e77c3d-83fc-47af-b6a4-192daa503b9a">
>
> 메모리 사용량이 뚝 떨어진걸 볼 수 있습니다. (그 와중에 또 서버가 죽어서 metric 공백이 생겼네요…)
> 
> <img width="500" alt="image" src="https://github.com/KEEPER31337/Homepage-Back-R2/assets/26597702/a58e99d0-4c49-4dd9-9003-3c88f6e71154">
>
> 속시원
>

## ref
[Jenkins를 이용한 CI/CD Pipeline 구축 - 인프런 | 강의](https://www.inflearn.com/course/젠킨스-ci-cd-파이프라인/dashboard)
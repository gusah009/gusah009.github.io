---
date: '2023-08-05'
title: 'Jenkins를 이용한 CI/CD 파이프라인 구축 5'
categories: ['jenkins']
summary: '파이프라인과 jenkins slave'
thumbnail: './thumbnail/choonsik_jenkins.jpeg'
---

> **파이프라인과 jenkins slave**

# Jenkins 파이프라인

### Pipeline 데모 사용해보기

이번 시간엔 파이프라인을 구축해보겠습니다.

먼저 간단한 파이프라인을 먼저 구축해봅시다.

- `sample-pipeline.yml`
    
    ```groovy
    pipeline {
        agent any
        stages {
            stage('Compile') {
                steps {
                    echo "Compiled successfully!";
                }
            }
    
            stage('JUnit') {
                steps {
                    echo "JUnit passed successfully!";
                }
            }
    
            stage('Code Analysis') {
                steps {
                    echo "Code Analysis completed successfully!";
                }
            }
    
            stage('Deploy') {
                steps {
                    echo "Deployed successfully!";
                }
            }
        }
    }
    ```
    

![image](https://user-images.githubusercontent.com/26597702/271583425-17add2fe-ae2d-4b25-a2c3-5bd6df97b98a.png)

> *미세한 꿀팁) 아래의 IntelliJ IDEA GDSL을 이용하면 하이라이팅 및 자동완성 기능을 쓸 수 있습니다. 구글에 검색하면 더 고도화된 GDSL이 많이 나오니 참고하세용.*
> 
> 
> ![image](https://user-images.githubusercontent.com/26597702/271583481-569f088f-4223-4e56-9d29-74a2fdfd9dc9.png)
> 

### 지금까지 했던 내용 Pipeline으로 구축해보기

- Jenkinsfile
    
    ```groovy
    pipeline {
      agent any
      tools {
        gradle 'gradle 8.3'
      }
      stages {
        stage('github clone') {
          steps {
            git branch: 'main', url: 'https://github.com/gusah009/jenkins-study.git'
          }
        }
    
        stage('jar build') {
          steps {
            sh '''
                        echo build start!
                        gradle clean bootJar
                    '''
          }
          post {
            success {
              echo 'gradle build success'
            }
    
            failure {
              echo 'gradle build failed'
            }
          }
        }
    
        stage('[deploy] copy jar to ansible server') {
          steps {
            sshPublisher(
                continueOnError: false, failOnError: true,
                publishers: [
                    sshPublisherDesc(
                        configName: "ansible-host",
                        verbose: true,
                        transfers: [
                            sshTransfer(
                                sourceFiles: "build/libs/jenkins-study-0.0.1-SNAPSHOT.jar",
                                removePrefix: "build/libs",
                                remoteDirectory: ".",
                                execCommand: ""
                            )
                        ]
                    )
                ]
            )
          }
        }
    
        stage('[deploy] build and push docker image') {
          steps {
            sshPublisher(
                continueOnError: false, failOnError: true,
                publishers: [
                    sshPublisherDesc(
                        configName: "ansible-host",
                        verbose: true,
                        transfers: [
                            sshTransfer(
                                execCommand: "ansible-playbook create-cicd-project-image-playbook.yml;"
                            )
                        ]
                    )
                ]
            )
          }
        }
    
        stage('[deploy] publish docker image to k8s') {
          steps {
            sshPublisher(
                continueOnError: false, failOnError: true,
                publishers: [
                    sshPublisherDesc(
                        configName: "ansible-host",
                        verbose: true,
                        transfers: [
                            sshTransfer(
                                execCommand: "ansible-playbook /root/k8s/k8s-cicd-deployment-playbook.yml;\n"
                                    + "ansible-playbook /root/k8s/k8s-cicd-service-playbook.yml;"
                            )
                        ]
                    )
                ]
            )
          }
        }
      }
    }
    ```
    

위 파이프라인이 보기엔 굉장히 길지만 지금까지 해왔던 내용을 pipeline에 그대로 옮겼을 뿐이라 찬찬히 읽어보면 굉장히 쉽습니다.

![image](https://user-images.githubusercontent.com/26597702/271583523-1c768a60-9da9-48a2-9832-f9a1d10d6711.png)

몇번의 삽질 끝에 파이프라인다운 파이프라인을 만들었습니다..!

한 번 코드도 갱신해서 올려보고 다시 배포해보면...

![image](https://user-images.githubusercontent.com/26597702/271583570-a22b9aa9-6612-45ce-ab2b-520fa39f5123.png)

![image](https://user-images.githubusercontent.com/26597702/271583660-3525fdde-a805-48cb-a63e-2958fe16a612.png)

짜잔 완성~

# Jenkins 마스터, 워커

지금까지 우리가 사용한 젠킨스는 마스터(master)라고 부릅니다.

젠킨스는 자신의 업무를 worker(slave라고도 부름)노드에게 맡길 수 있는 기능이 있는데요,

이번 시간엔 master + worker를 만들어보겠습니다.

## Docker로 slave 띄워보기

[Docker](https://hub.docker.com/r/jenkins/ssh-slave/)

위의 공식 jenkins/ssh-slave docker 문서를 참고했습니다.

jenkins slave의 도커 설정을 마쳤다면 아래와 같이 pipeline script를 작성해봅시다.

```groovy
node('slave1') { // 설정할 때 썼던 docker agent name
	stage('Print Hello') { 
		echo "Hello"
	}
}
```

![image](https://user-images.githubusercontent.com/26597702/271584684-1d5c3490-9bfc-4d3f-af01-137a5268a07a.png)

그럼 위와 같이 **slave1 라벨의 모든 노드가 offline**이라고 뜹니다.

![image](https://user-images.githubusercontent.com/26597702/271584737-d07f7304-ce6e-4743-9af4-60855702e5f1.png)

그리곤 아래와 같이 master 내부에 slave node들을 열심히 생성하기 시작합니다.

> *이건 jenkins에서 제공해주는 docker 플러그인이 해주는 기능입니다. 실제로 jenkins를 구성한다면 노드의 성능을 최대로 활용하기 위해 아예 다른 노드에 워커 노드를 띄우고 SSH 연결하는게 좋을 것 같습니다.*
> 

![image](https://user-images.githubusercontent.com/26597702/271584791-0dbd1197-a018-4712-8408-5ec224583238.png)

시간이 지나면 *Running on ~~~* 문구가 뜨는데, offline이던 slave 노드를 도커로 띄우는 과정입니다.

그럼 pipeline 과정을 도커 내부에서 수행하고 도커는 사라집니다.

## ref
[Jenkins를 이용한 CI/CD Pipeline 구축 - 인프런 | 강의](https://www.inflearn.com/course/젠킨스-ci-cd-파이프라인/dashboard)
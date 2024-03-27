---
date: '2024-03-24'
title: 'Zookeeper Recipe - 기초편'
categories: ['etc']
summary: '오늘은 zookeeper를 더 잘 활용하는 방법인 recipe에 대해 알아보겠습니다.'
thumbnail: './images/zk/zklogo.png'
---

오늘은 zookeeper를 더 잘 활용하는 방법인 recipe에 대해 알아보겠습니다.

# Zookeeper

![zkservice](./images/zk/zkservice.jpg)

우선 주키퍼 레시피를 들어가기 전에 주키퍼에 대해 간단하게 알아야 할 것 같은데요.

주키퍼는 **분산 시스템을 제어**하기 위한 "트리 형태의 데이터 저장소"라고 볼 수 있습니다.

여기선 주키퍼에 대해 상세하게 다루지 않기 때문에 간단하게 주키퍼 레시피를 알기 위한 지식 몇 가지만 훑고 가겠습니다.

## 주키퍼가 보장해주는 기능

먼저 주키퍼가 **보장**해주는 기능입니다.

분산 시스템에서 **보장**은 매우 중요한 단어인데요, 왜냐하면 분산 시스템은 **네트워크라는 불안정한, 불확실한 기반** 위에서 동작하기 때문입니다.

### 1. 순차적 일관성 보장

클라이언트가 데이터를 여러번 업데이트해도 전송된 순서대로 적용됨을 보장해줍니다.

### 2. 원자성 보장

원자성 보장은 주키퍼 API를 통한 명령은 항상 원자성을 가진다는 뜻입니다.

참고용 주키퍼 명령어
- create
- delete
- exists
- setData
- getData
- getChildren

> Reads get all the data bytes associated with a znode and a write replaces all the data.
>
> 읽기는 znode와 관련된 모든 데이터 바이트를 가져오고 쓰기는 모든 데이터를 대체합니다.

### 3. 단일 시스템 이미지

주키퍼는 가용성을 보장하기 위해 여러 서버로 구성되는데, 쓰기를 담당하는 리더와 팔로워들로 구성되어 있습니다.

클라이언트는 어떤 서버가 리더인지 **알 필요 없이** 아무 주키퍼 서버로 요청을 보내도 **항상 같은 값**을 가져올 수 있는데요.

이렇게 **한 클라이언트가 어떤 서버로 요청을 보내도 같은 결과를 내려 준다는 보장**이 일관성 보장입니다.

> 이 부분을 찾아보면서 `2 phase commit`에 대해 공부해봤는데...
>
> 제가 이해한 바로는 찰나 동안은 **이전 버전, 현재 버전**이 공존할 순 있을 것 같습니다.

## 주키퍼 관련 알아야 할 용어

주키퍼가 보장해주는 기능은 위 정도만 알면 될 것 같고 다음으론 주키퍼 관련 용어입니다.

### znode

![zknamespace](./images/zk/zknamespace.jpg)

파일 트리의 inode와 비슷하게 주키퍼는 znode가 있습니다.

znode는 데이터를 저장할 수 있는 노드입니다.

### zxid

주키퍼는 트랜잭션 id를 이용해 변경된 상태를 순서대로 정렬해 가지고 있는 정보가 최신 정보인지 확인이 가능하도록 도와줍니다.

이 때 주키퍼의 트랜잭션 id를 zxid라고 부릅니다.

### 더 자세한 내용

주키퍼에 대해 자세한 내용은 [주키퍼 공식 문서](https://zookeeper.apache.org/)와 저희 [팀원이 쓴 주키퍼 관련 글](https://brunch.co.kr/@timevoyage/77)을 추천합니다.

> 팀원 분이 글을 정말 잘 쓰는데 이 글을 마지막으로 사라지셨다는...

# Zookeeper Recipe

이번 포스팅의 핵심인 **주키퍼 레시피**입니다.

주키퍼의 이런 **보장**과 **기능**을 활용해 클라이언트단에서 몇 가지 고급 전략을 사용할 수 있습니다.

이를 주키퍼에선 [Recipes](https://zookeeper.apache.org/doc/current/recipes.html)라고 부릅니다.

참고: https://zookeeper.apache.org/doc/r3.9.2/recipes.html#sc_recipes_eventHandles

## Barrier

먼저 Barrier입니다. Barrier는 모든 노드들이 **처리가 가능할 때 까지 기다리는 기술**입니다.

컨셉은 간단합니다.

1. client는 zk에 `exists()` API를 날려서 barrier node가 있는지 확인하고 `watch`를 걸어둡니다.
2. 만약 없으면 barrier가 풀렸다고 생각해 명령을 수행합니다.
3. 만약 있으면 노드들은 명령을 대기합니다.
    - 그리고 노드들은 barrier path가 없어지는 event를 기다립니다.

이 컨셉을 보면서 *'그럼 모든 노드가 처리 가능한지는 어떻게 알지?'*  라는 의문이 생길수 있습니다.

사실 Barrier 만으로는 모든 노드가 처리 가능한 상태인지 **알 수 있는 방법은 없습니다.**

그래서 모든 노드들을 컨트롤할 **컨트롤 노드가 따로 필요하기 때문에** 컨트롤 노드 없이 Barrier를 수행할 수 있는 **Double Barrier** 라는 개념이 나왔습니다.

구현이 어떻게 되어있는지 알고 싶다면 apache curator(netflix curator 였던...)에서 구현을 확인하시면 됩니다.

[curator DistributedBarrier github](https://github.com/apache/curator/blob/master/curator-recipes/src/main/java/org/apache/curator/framework/recipes/barriers/DistributedBarrier.java)

### Double Barrier

더블 배리어를 이용하면 **모든 클라이언트들의 시작과 종료를 동기화** 할 수 있습니다.

역시 컨셉은 간단한데요.

1. `exists(b + "/ready", true)`를 watch로 세팅합니다. `b`+`/ready` 노드가 만들어지는 대로 모든 클라이언트가 동작을 시작하기 위함입니다.
2. 다음으로 노드를 만듭니다. barrier node를 `b`, 클라이언트를 `p` 라고 했을 때 `b`+`/`+`p` 경로에 노드를 만듭니다.
    - 이 때 노드는 `ephemeral`로 만듭니다. 동작이 종료되고 세션이 끝나면 자연스럽게 노드를 지우기 위함입니다.
    - `create("b/p", EPHEMERAL)`
3. L = `getChildren(b, false)` 명령어로 현재 몇 개의 클라이언트가 준비됐는지 확인합니다.
4. L이 클라이언트 전체 개수인 x보다 작으면 계속 `b`+`/ready`를 watch 하면서 기다립니다.
5. L이 클라이언트 개수와 같아지면 마지막으로 들어왔다는 뜻이므로 `b`+`/ready` 노드를 만듭니다.

`/ready` 노드가 만들어지면 모든 클라이언트는 예약해뒀던 동작을 수행합니다.

동작이 모두 끝나면 노드들은 barrier에서 빠져나와야 하고, 이는 아래 순서를 따릅니다.

> 이 때 [주키퍼 공식문서](https://zookeeper.apache.org/doc/r3.9.2/recipes.html#sc_doubleBarriers) 상으론 종료도 동기화를 시켜주고 있습니다.
>
> 종료도 동기화가 필요한 경우가 언제인진 잘 모르겠습니다..

1. L = `getChildren(b, false)` 명령어로 남은 클라이언트들을 모두 가져옵니다. (본인 포함)
2. 만약 본인이 `lowest` 노드이면 다른 클라이언트들이 끝나길 기다립니다.
3. 아니라면 `b/p` 노드를 지우고 `lowest` 노드가 종료가 되길 기다립니다.
4. `lowest` 노드 외에 클라이언트가 남지 않았다면 본인 노드를 지우고 모든 클라이언트는 종료 동작을 수행합니다.
    - curator에서는 아예 barrier 노드 전체를 지워버립니다.

참고: https://curator.apache.org/docs/recipes-double-barrier/

## Producer-Consumer Queues

zookeeper를 이용하면 간단한 큐도 만들 수 있습니다.

1. 큐의 각 원소는 znode로 프로듀싱 된다.
2. 컨슈머는 `getChildren()`으로 큐에 값들을 가져와 하나씩 처리하고 지운다.
3. 만약 컨슈머가 `getChildren()`을 했는데 비어있다면 watch를 걸어두고 기다린다.

> 이 때 컨슈머가 2대 이상이면 중복 처리가 발생할 수 있기 때문에 중복 처리를 원하지 않는다면 컨슈머는 1대로 강제해야 할 것 같습니다.

주키퍼로 만든 큐의 장점은 한 번 프로듀싱 된 데이터는 컨슈머가 가져가지 않는 한 **유실이 잃어나지 않는다는** 점입니다.

하지만 요즘은 다른 좋은 분산 처리 큐가 많이 나와서 굳이 주키퍼로 큐를 만들어 사용할 필요는 없어 보입니다.

## 마무리

지금까지 [주키퍼 레시피 튜토리얼](https://zookeeper.apache.org/doc/current/zookeeperTutorial.html)에 나온 간단한 레시피 몇 가지를 알아봤습니다.

다음엔 더 많이 활용되는 고급 레시피들을 알아보겠습니다.

## 참고

- https://brunch.co.kr/@timevoyage/77
- https://zookeeper.apache.org/doc/current/zookeeperOver.html
- https://zookeeper.apache.org/doc/r3.8.3/zookeeperInternals.html
- https://zookeeper.apache.org/doc/current/zookeeperTutorial.html
- https://zookeeper.apache.org/doc/current/recipes.html
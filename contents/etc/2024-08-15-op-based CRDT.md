---
date: '2024-08-15'
title: 'op based CRDT'
categories: ['crdt', 'yorkie']
summary: 'operation based CRDT에 대해 알아보자'
thumbnail: './images/crdt/notion-icon.png'
---

지금까지 본 상태 기반 CRDT는 자신의 값 전체를 전달하는 방식으로 데이터 일관성을 맞춰왔습니다.

하지만 operation-based CRDT, 즉 작업 기반 CRDT는 변경사항을 전달하는 방식으로 동작합니다.

상태 기반과 작업 기반의 가장 큰 차이를 아래에서 보겠습니다.

![Untitled](op_based/Untitled.png)

### 인과관계 문제

상태 기반은 자신의 전체 상태를 보내기 때문에 순서가 뒤바뀌어도 큰 문제가 없습니다.

하지만 전달해야 할 메시지가 많아질수록 모든 상태를 보내야 해서 비효율적이게 됩니다.

operation 방식은 순서가 뒤바뀌면 큰 문제가 될 수 있습니다. 

위의 예시에선 메시지를 받은 순서대로 데이터를 쓴다면 B 입장에선 C가 미래를 예지하고 먼저 대답을 한 것 처럼 보일 것 입니다.

이를 해결하기 위해 각 명령에 순서를 넣는데, 이는 보통 Logical Clock으로 해결합니다.

### 유실 문제

여기서 끝이 아니라, 또 다른 문제가 있습니다.

상태 기반 CRDT는 중간에 유실이 되는게 큰 문제가 되진 않습니다. 받은 것 중 가장 최신의 데이터로 덮어쓰면 되기 때문입니다.

그런데 작업 기반 CRDT는 모든 작업을 "반드시" 받아야 합니다. 작업을 모두 받아야 데이터가 완성되기 때문인데요,

![Untitled](op_based/Untitled1.png)

이 때 만약 A가 영구적으로 네트워크가 끊겼다면 어떻게 될까요? B는 영원히 기다려야 할까요?

이를 해결하기 위해 다른 노드가 이벤트를 복제해주는 것도 허용하는 방식이 있습니다.

### A의 이벤트를 꼭 A에게 받을 필요는 없다

특정 노드에서 일어난 이벤트를 다른 노드가 복제해주는 이 컨셉은 중복이 아주 많이 발생하는 문제가 있긴 합니다.

N개의 노드가 있다면 이벤트 하나가 발생했을 때 (N - 1)^2 만큼 네트워크로 메시지가 날아가게 되는데요,

![graphviz.png](op_based/graphviz.png)

이렇게 중복이 많아지는 문제를 해결하기 위해 pull-based model이 채택되었습니다.

이것만으론 충분하지 않아서 pull을 할 때 본인의 타임스탬프를 보내는 방식도 함께 채택되었습니다.

이 방식을 이용하면 모든 변경사항이 아니라, 본인이 알고 있는 이벤트 다음부터 얻을 수 있다.

![Untitled](op_based/Untitled2.png)

출처: [https://www.bartoszsypytkowski.com/content/images/2020/08/rcb-sequence-diagram-2.png](https://www.bartoszsypytkowski.com/content/images/2020/08/rcb-sequence-diagram-2.png)

## 참고

[Operation based CRDTs: protocol](https://www.bartoszsypytkowski.com/operation-based-crdts-protocol/)
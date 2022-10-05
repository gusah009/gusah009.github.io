---
date: '2022-08-01'
title: '[item40] @Override 애너테이션을 일관되게 사용하라'
categories: ['effective_java']
summary: '`IntelliJ`에서 Override Methods 기능을 사용해 메서드를 오버라이드 하면 자동으로 메서드 위에 `@Override` 어노테이션을 붙여줍니다. 이번 장에서는 해당 어노테이션의 필요성에 대해 알아보겠습니다.'
thumbnail: './effective_java_thumb.png'
---

> **@Override 애너테이션을 일관되게 사용하라**

`IntelliJ`에서 *Override Methods* 기능을 사용해 메서드를 오버라이드 하면 자동으로 메서드 위에 `@Override` 어노테이션을 붙여줍니다. 이번 장에서는 해당 어노테이션의 필요성에 대해 알아보겠습니다.

## Overloading 실수를 막기 위한 @Override
헷갈리는 두 용어가 있습니다. 바로 `Overloading`과 `Overriding`입니다.
- `Overloading`: 메서드의 이름만 같고 인자를 다르게 하는 기법
- `Overriding`: 하위 클래스에서 상위 클래스의 메서드를 재정의 한 것

가끔 하위 클래스에서 오버라이딩을 시도할 때 많이 하는 실수가 있습니다. 바로 오버라이딩 대신 오버로딩을 해버리는 것입니다. 아래 코드를 보겠습니다.
```java
public class Mistake {
  private String name;

  public boolean equals(Mistake mistake) {
    if (this == mistake) {
      return true;
    }
    return Objects.equals(name, mistake.name);
  }
}
```
`equals()`를 잘 재정의하여 사용한 것 같지만, 사실 상위 클래스의 `equals()` 메서드는 인자로 `Mistake`가 아니라 `Object`를 받습니다. 이는 명백한 오버로딩입니다. 하지만 코드 작성자는 오버라이딩을 기대했을 것입니다. 이 때 필요한 것이 `@Override` 어노테이션 입니다.
```java
@Override
public boolean equals(Mistake mistake) {
  //...
}
```
위와 같이 `@Override` 어노테이션을 붙여주면 IDE가 친절하게 `Method does not override method from its superclass`라는 컴파일 에러를 내줍니다. 

`@Override` 어노테이션을 사용한다면 컴파일 타임에 실수를 바로 잡을 수 있기 때문에 붙이는 것이 좋습니다.
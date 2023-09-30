---
date: '2023-08-13'
title: 'MultipartFile read twice 문제 (with inputstream)'
categories: ['etc']
summary: '오늘은 MultipartFile에서 InputStream을 다루다가 생긴 문제에 대해서 공유해볼까 합니다.'
thumbnail: './images/spring-boot-logo.png'
---

**오늘은 MultipartFile에서 InputStream을 다루다가 생긴 문제에 대해서 공유해볼까 합니다.**

키퍼라는 동아리에서 개발을 하던 도중에 갑자기 썸네일 등록이 안되는 문제를 발견했습니다.

![image](https://user-images.githubusercontent.com/26597702/271755853-a4ca96c9-ec17-4c7b-b3e1-0a14c95917b4.png)

![image](https://user-images.githubusercontent.com/26597702/271755859-524c77eb-efe8-40d0-af77-9b00abc04cd0.png)

서버 로직의 문제일 경우 5xx 에러가 내려가기 때문에 제 로직의 문제일 가능성이 컸습니다.

> 사용자 요청의 문제일 경우 4xx 가 내려갑니다.

## 키퍼 썸네일 유틸리티

썸네일 개발은 제 담당이었기 때문에 바로 로그를 찾아봤습니다.

![image](https://user-images.githubusercontent.com/26597702/271755758-b5323221-c4bc-4383-a4e8-8bf83a261f68.png)

세상에 `/private/var/folders/…` 라니… 도대체 저게 무슨 경로인가요…

찾아봤더니, `Spring`은 파일을 request로 받아서 저장할 때 `MultipartFile`이란 객체를 사용하는데, 이 객체에 담기는 **실제 파일 데이터를 임시로 저장하는 곳이라고 합니다.**

`NoSuchFileException` 이란 뜻은 저 실제 파일 데이터가 없어졌다는걸까요?

그래서 한 번 디버깅을 돌려봤습니다.

![image](https://user-images.githubusercontent.com/26597702/271755762-7d16efa3-02b1-4396-9e89-fa7055417d27.png)

오른쪽 시간을 보면 둘 다 16:35:44에 `ls` 명령어를 입력했는데, 실시간으로 **05** 파일이 없어지는걸 볼 수 있었습니다.

> *04, 06, 07 파일은 요청시에 함께 올린 썸네일이 아닌 다른 파일들입니다.*
> 

![image](https://user-images.githubusercontent.com/26597702/271756043-ba8870e0-380e-4073-b2c7-346bad2f8192.png)

일단 문제가 생긴 곳은 위 부분이었습니다.

`MultipartFile`의 `InputStream` 데이터를 가지고 와서 이미지 유틸리티인 `ImageIO`에 넣어주는 간단한 코드인데, 여기서 저 파일을 찾을 수 없다는 에러가 뜬 것입니다.

원인은 바로 위 `trySave` 메서드의 `checkInvalidImageFile`에 있었는데, `checkInvalidImageFile`을 한 번 보겠습니다.

> *`checkInvalidImageFile`: 유효한 이미지 파일인지 확인하는 메서드*
>
> *`tryResizingAndSave`: "썸네일"이라는 의도에 맞게 적절한 크기로 resizing 후 저장하는 메서드*
> 

![image](https://user-images.githubusercontent.com/26597702/271756046-33d7e7ee-f81d-4ac6-ac03-1356d8c1e81c.png)

`checkInvalidImageFile`의 코드는 놀라울만큼 간단한데요,

방금 위에서 봤던 `ImageIO.read`를 이용해서 이미지 여부만 판단하는게 전부입니다.

> *`ImageIO.read` 함수를 이용하면 이미지인지 확인이 가능하다. 이미지가 아니라면 `null`을 반환합니다.*
> 

여기서 문제는 `file.getInputStream()` 코드인데, 여기서 **이미 한 번 inputStream을 읽어버렸다는게 문제였습니다.**

stream이라는 명칭에 걸맞게 한 번 읽은 stream은 **재사용이 불가능합니다.** 

> (mark, reset 기능이 있지만 제외하고…)

그래서 이미 읽어버린 파일에 대해 다시 `getInputStream`을 가져오려니 문제가 생겼던 것입니다.

**그럼 파일이 사라진건 무슨 일일까?**

스프링의 `MultipartFile`은 임시 폴더에 데이터가 저장되는데요, 말 그대로 **임시 폴더**이기 때문에 스프링 내부적으로 MultipartFile의 **데이터를 한 번 전부 읽고 나면 파일을 지워버립니다.**

그래서 임시 파일이 없어졌고, 다시 읽어오려니 `NoSuchFileException`이 터진것이었습니다.

### 해결

해결은 간단하게 inputStream의 데이터를 처음 읽어올 때 `byte[]`로 저장해서 재사용하도록 했습니다.

끝--
---
title: SSD mobileNet V1 custom 모델 안드로이드 적용시키기 (2/2)
tags:
  - M/L
  - projects
toc_label: SSD mobileNet V1 custom 모델 안드로이드 적용시키기 (2/2)
toc: false
toc_sticky: false
---

![](https://images.velog.io/images/gusah009/post/c71f513b-d1c2-416e-9b05-f7570d91ea94/100000_train.png)
## ckpt -> pb 파일로 변환
학습이 끝나면 train폴더에 ckpt파일들이 생깁니다.
해당 파일중 가장 마지막 checkpoint파일을 pb파일로 변환해야합니다.
아래 명령어에서 model.ckpt- 뒤의 숫자는 본인 파일의 숫자를 작성하시면 됩니다.
이제 명령어를 실행시키시면 exported_model 폴더에 pb파일이 생성됩니다.
```shell
python object_detection/export_tflite_ssd_graph.py  --pipeline_config_path=ssd_mobilenet_v1_coco.config  --trained_checkpoint_prefix=train/model.ckpt-103512 --output_directory exported_model
```
## pb -> tflite 파일로 변환
생성된 pb파일을 이제 android프로젝트에 맞게 경량화 시켜야 합니다.
exported_model의 파일을 tflite 파일로 변환시켜 주겠습니다.
```shell
tflite_convert --input_shape=1,300,300,3 --input_arrays=normalized_input_image_tensor --output_arrays=TFLite_Detection_PostProcess,TFLite_Detection_PostProcess:1,TFLite_Detection_PostProcess:2,TFLite_Detection_PostProcess:3 --allow_custom_ops --graph_def_file=exported_model/tflite_graph.pb --output_file=detect.tflite
```
### 삽질...
명령어를 실행시키고 나면 저희의 작업폴더인 models 폴더에 detect.tflite 파일이 생성되어있습니다. 해당파일을 바로넣으면 오류가 나면서 안되고, metadata라는 것을 추가해주어야 합니다.
> 해당 오류때문에 며칠을 고생했던 기억이 있습니다.. ㅠㅜ
실제 공식문서에서 빠진 부분입니다.

## meta 데이터 추가
### label.txt 파일 추가
metadata를 추가하기 앞서서 label.txt 파일을 생성하겠습니다.
label.txt 위치는 models 폴더에 위치하고, 양식은 1번이 dog, 2번이 cat, 3번이 snake라면
```text
dog
cat
snake
```
형식으로 넣어주시기만 하면 됩니다.
### metadata 추가하기
아래 python코드를 이용해 detect.tflite 파일에 metadata를 추가해주시면 됩니다.
실제로 바꼈다는 내용이 있진 않고 파일 내부적으로 변경됩니다.
저는 models폴더에 python파일로 만들어서 실행시켰습니다.

## Android 프로젝트에 추가하기
[https://github.com/tensorflow/examples](https://github.com/tensorflow/examples)
위 프로젝트를 git clone 받고 해당 프로젝트의 `lite/examples/object_detection/android/src/main/assests` 폴더안에 있는 `detect.tflite`파일을 저희가 학습한 `detect.tflite`파일로 바꿔줍니다.
```shell
git clone "https://github.com/tensorflow/examples"
```
추가로  l`ite/examples/object_detection/android/src/main/java/org/tensorflow/lite/examples/detection/DetectorActivity.java` 파일 안에 `TF_OD_API_IS_QUANTIZED = false`로 바꿔주시면 됩니다.
```java
private static final boolean TF_OD_API_IS_QUANTIZED = false;
```

## 마무리
학습된 과정을 tensorboard로 보고싶다면 models 폴더에서 아래 명령어를 실행시켜줍니다.
```shell
tensorboard --logdir=train
```
![](https://images.velog.io/images/gusah009/post/355ed039-2ebc-4578-9bf2-d682cb81a259/%EC%86%90%EC%8B%A4%EA%B0%92.png)![](https://images.velog.io/images/gusah009/post/8fd818fe-c87f-4926-a79f-5c8014e0b2cb/100000_eval.png)
> 모든 학습이 끝나고 직접 건물인식을 시켜봤는데, 하늘을보고 건물이라하는 경우가 허다했고 정확히 학습한부분만 인식하는 경우가 많았습니다. 오히려 10만번 학습시킨 ckpt보다 4~6만번이 더 실제로 느끼기에 정확도가 좋았던 것 같습니다.

이상 **SSD mobilenet v1 custom dataset android 적용시키기** 글을 마치겠습니다.
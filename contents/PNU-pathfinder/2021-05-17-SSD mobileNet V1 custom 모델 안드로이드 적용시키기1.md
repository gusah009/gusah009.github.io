---
date: '2021-05-17'
title: 'SSD mobileNet V1 custom 모델 안드로이드 적용시키기 (1/2)'
categories: ['pathfinder']
summary: '이번에 소프트웨어설계실험 과목에서 진행한 **부산대 길찾기**프로젝트에서 객체인식 모델 학습부분입니다.'
thumbnail: './thumbnail/pathfinder_loss.png'
---

이번에 소프트웨어설계실험 과목에서 진행한 **부산대 길찾기**프로젝트에서 객체인식 모델 학습부분입니다.

# 서론
tensorflow 객체인식이라는 처음접하는 분야에, android 역시 한번도 해본 적이 없던 저에겐 큰 도전이었습니다. 이번 건물인식 프로젝트를 진행하면서 했던 많은 삽질들을 여기 공유하고, 다른 사람들이 이로인해 시간을 허비하지 않길 바라면서 블로그 글을 작성합니다... ㅠㅠ

tensorflow android object detection 에서 제공하는 기본 모델이 이유는 모르겠지만 SSD mobileNet v1을 지원하고 있습니다. v2로는 진행을 해보진 않았습니다.

# 개발환경
- windows 10
- conda
- (base) python 3.8 tensorflow 2.4.1, tensorflow-gpu==2.4.1
- (ssdV1) python 3.7 tensorflow 1.15.0, tensorflow-gpu==1.15.0
- CUDA 10.0
- cuDNN==7.6.0 for CUDA 10.0

## 환경 세팅
먼저 환경을 맞추기 위해 pip를 초기화하였습니다.

위에 tensorflow를 2.4.1과 1.15.0 두 개를 사용하는 이유는 뒤에 진행하면서 tensorflow 버전이 1이라서 안되는 경우가 있고, 2라서 안되는 경우가 있어서 다음과 같이 전체 tensorflow 버전은 2.4.1로 맞추고, ssdV1 가상환경은 1.15.0으로 맞춰서 진행하였습니다.

학습시엔 tensorflow-gpu 1.14.0 버전으로 진행하기위해 CUDA와 cuDNN 버전은 1.15.0 버전에 맞췄습니다. -> [tensorflow-gpu 버전 확인하기](https://www.tensorflow.org/install/source_windows#tested_build_configurations)

### 전역 pip 세팅
먼저, 필요한 pip를 설치해줍니다.
```shell
pip3 install tensorflow==2.4.1 tensorflow-gpu==2.4.1 pillow Cython lxml jupyter matplotlib
```
### 가상환경 pip 세팅
다음으로 conda 가상환경을 만들어 주겠습니다. (anaconda는 설치되어있다고 가정하고 진행하겠습니다) anaconda prompt에서 다음과 같이 실행시킵니다
```shell
conda create -n ssdV1 python=3.7
conda activate ssdV1
pip3 install tensorflow==1.15.0 tensorflow-gpu==1.15.0 pillow Cython lxml jupyter matplotlib pandas
```
> 저는 관리자 권한 anaconda prompt에서 실행시켰습니다.

### tensorflow model 가져오기
각자 개발할 환경에 들어가셔서 아래 명령어를 실행시켜주시면 됩니다.
```shell
cd (각자 개발환경 dir 내부)
git clone https://github.com/tensorflow/models.git
```
protobuf를 컴파일하고, PYTHONPATH를 변경해줍니다. [protobuf windows 다운 사이트](https://github.com/protocolbuffers/protobuf/releases)
> 저는 protoc-3.17.0-win64.zip을 다운받았습니다.

```shell
cd <개발환경>\models\research\
<protoc 폴더>\bin\protoc.exe object_detection/protos/*.proto --python_out=.
set PYTHONPATH=%PYTHONPATH%<개발환경>\models;
set PYTHONPATH=%PYTHONPATH%<개발환경>\models\research;
set PYTHONPATH=%PYTHONPATH%<개발환경>\models\research\slim;
```
### 개발환경 테스트
그리고 다음 명령어로 테스트 했을 때 됐다는 메시지가 뜨고 아무반응이 없으면 성공입니다.
```shell
python object_detection/builders/model_builder_test.py
```
> 에러가 나는 경우
1. ```ModuleNotFoundError: No module named 'tf_slim'```
```shell
pip install tf_slim
```
2. ```ModuleNotFoundError: No module named 'scipy'```
```shell
pip install scipy
```

# 폴더 구조화 & 이미지 데이터 정리
이 글의 대부분의 작업은 models 폴더 안에서 실행됩니다.

## 폴더 구조화
우선 폴더구조를 아래와 같이 생성합니다.

> models \
> \\--- annotations \
> \\--- images \
> \\------ train \
> \\------ test \
> \\--- checkpoints \
> \\--- tf_record \
> \\--- research \
> \\--- data \
> \\--- ...
    

images 아래에 train과 test를 적절한 비율 (7:3)으로 나누어 저장합니다. (이 때, 이미지 파일들은 1부터 순서대로 존재해야합니다!)
## 이미지 라벨링
이미지 라벨링은 [https://github.com/tzutalin/labelImg](https://github.com/tzutalin/labelImg)의 labelImg를 사용하시는 것을 추천드립니다.
설치가 귀찮으신 분은 [https://tzutalin.github.io/labelImg/](https://tzutalin.github.io/labelImg/) 이 페이지에서 최신 버전을 다운받아서 사용하시면 됩니다.

이미지 라벨링이 끝나신 분들은 jpg파일과 xml파일들이 train, test 폴더내에 존재하면 됩니다.
> 저만 그랬을 수도 있지만, xml 파일 안에 이미지 파일의 위치가 저장됩니다.
xml 파일들을 다시한번 열어서 모두 고치고싶지 않으시다면 이미지 파일들을 미리 train, test 폴더안에 넣어놓고 라벨링 하시는 것을 추천드립니다!

### label_map.txt
다음으로 label_map.txt 파일을 models\annotations 안에 생성합니다. 아래와 같은 예시로 생성하시면 됩니다.
```json
item {
  id: 1
  name: 'person'
}
item {
  id: 2
  name: 'dog'
}
```
### xml to csv
이제 XML 파일을 CSV 파일로 전환해야 합니다. 아래의 코드를 models\xml_to_csv.py 파일로 저장하고 실행시키면 됩니다.
```shell
python xml_to_csv.py
```
그럼 이제 models\data 폴더안에 test_labels.csv 파일과 train_labels.csv 파일이 생깁니다.
[gist.github.com/iKhushPatel/ed1f837656b155d9b94d45b42e00f5e4](gist.github.com/iKhushPatel/ed1f837656b155d9b94d45b42e00f5e4)
### tfrecord 파일 수정
아래의 코드를 models\research\object_detection\dataset_tools\generate_tfrecord.py 파일로 저장하시고 몇몇 부분을 수정해주셔야 합니다.
[github.com/datitran/raccoon_dataset/blob/master/generate_tfrecord.py#L25](github.com/datitran/raccoon_dataset/blob/master/generate_tfrecord.py#L25)
```python
def class_text_to_int(row_label):
    if row_label == 'raccoon':
        return 1
    else:
        None
```
이 부분을 각자 label_map.txt 파일에 넣은 값대로 추가해주시면 됩니다.
ex)
```python
def class_text_to_int(row_label):
    if row_label == 'person':
        return 1
    elif row_label == 'dog':
        return 2
    else:
        None
```
그리고 models 폴더로 나오셔서 아래 명령어를 실행시켜 줍니다. (train, test 두 번 돌리셔야 합니다)
```shell
python research/object_detection/dataset_tools/generate_tfrecord.py --csv_input=data/train_labels.csv --output_path=train.record --image_dir=images/train
```
```shell
python research/object_detection/dataset_tools/generate_tfrecord.py --csv_input=data/test_labels.csv --output_path=test.record --image_dir=images/test
```
> ModuleNotFoundError: No module named 'object_detection' 에러가 나는 경우
```shell
pip install tensorflow-object-detection-api
```
진행하시고 나면 models 폴더에 train.record, test.record 파일이 생성됩니다.

### 사전학습 모델 가져오기
아래에서 pre-trained model을 다운로드 받습니다.

[download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_coco_2018_01_28.tar.gz](download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_coco_2018_01_28.tar.gz)

위 파일의 압축을 풀고, model.ckpt.meta, model.ckpt.index, model.ckpt.data-00000-of-00001 3개의 파일을 models\checkpoints 에 저장합니다.

본격적인 학습은 다음글에서 계속하겠습니다.

### config 파일 수정하기
models/research/object_detection/samples/configs 아래에 있는 ssd_mobilenet_v1_ coco 파일을 models/ 로 복사합니다.

다음으로 3가지를 수정해주시면 됩니다.

**1. num_classes 변경**
```python
ssd {
    num_classes: 3 # 자기 클래스 개수로 변경
    box_coder {
        faster_rcnn_box_coder {
            y_scale: 10.0 
            x_scale: 10.0 
            height_scale: 5.0 
            width_scale: 5.0 
    } 
 }
 ```
**2. fine_tune_checkpoint 변경**
```python
fine_tune_checkpoint: "checkpoints/model.ckpt" # model.ckpt 경로 입력
```
**3. train, eval input reader 변경**
```python
train_input_reader: { 
    tf_record_input_reader { 
        input_path: "train.record" # train.record 경로 입력
    } 
    label_map_path: "annotations/label_map.txt"  #  label_map.pbtxt 경로 입력
  }
eval_input_reader: { 
    tf_record_input_reader { 
        input_path: "test.record" # test.record 경로 입력
    } 
    label_map_path: "annotations/label_map.txt"  # label_map.pbtxt 경로 입력
    shuffle : false
    num_readers : 1
  }
```

# 학습시키기
이제 학습 준비가 끝났습니다. 본격적인 학습을 진행해보겠습니다.
models 폴더에서 아래 명령어를 실행시켜줍니다.
```shell
mkdir train
mkdir eval
python research\object_detection\model_main.py --pipeline_config_path=ssd_mobilenet_v1_coco.config --model_dir=train --num_train_steps=200000 --sample_1_of_n_eval_examples=1 --alsologtostderr
```
> NotImplementedError: Cannot convert a symbolic Tensor (cond_2/strided_slice:0) to a numpy array. 에러가 발생할 경우
저는 numpy가 1.20.3이 설치되어 있었는데 , 1.18.4 버전으로 다운그레이드한 후에 정상적으로 동작했습니다.
```shell
pip uninstall numpy
pip install numpy==1.18.4
```

> ModuleNotFoundError: No module named 'pycocotools' 에러가 발생할 경우
아래 블로그 글대로 따라 진행하시면 됩니다.
[https://blog.naver.com/PostView.nhn?blogId=tip9004&logNo=221270291955](https://blog.naver.com/PostView.nhn?blogId=tip9004&logNo=221270291955)

> ModuleNotFoundError: No module named 'lvis' 에러가 발생할 경우
```shell
pip install lvis
```

> self._traceback = tf_stack.extract_stack() 에러가 발생할 경우
research\object_detection\model_main.py 파일안에 아래와같이 추가해줍니다.
(gpu 문제인것 같습니다)
```python
from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession
config = ConfigProto()
config.gpu_options.allow_growth = True
session = InteractiveSession(config=config)
```
저는 numpy를 1.17.4 버전으로 다운그레이드했을 때 해결이 됐습니다.


![](https://images.velog.io/images/gusah009/post/c4a13c78-a9b7-4401-b77d-4386ac0f0042/image.png)
이런 화면이 뜨면서 학습이 진행되시면 됩니다. 다음 글은 학습이 끝난 이후에 다시 작성하겠습니다.

출처: [https://seoftware.tistory.com/108](https://seoftware.tistory.com/108),

[https://github.com/tensorflow/examples/tree/master/lite/examples/object_detection/android](https://github.com/tensorflow/examples/tree/master/lite/examples/object_detection/android),

[https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf1_training_and_evaluation.md](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf1_training_and_evaluation.md)

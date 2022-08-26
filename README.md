# Youngle Calendar

**Welcome to Youngle Calendar!**

Using **React, Redux, Next, and TailwindCSS** to clone [Google Calendar](https://www.google.com/calendar)

Deployed at this [link](https://youngle-calendar.vercel.app/)!

Check the detailed features and slice design below!

회고록 링크는 [여기](https://syjn99.notion.site/61576dc49bf84da79ff568e4b8cf8bce)서 확인 가능합니다.

---
## Features

### Views

Monthly view, ~~Weekly View,~~ Daily View를 구현했습니다. Default로는 오늘의 달에 해당하는 Monthly View을 보여줍니다.

Weekly View는 구현은 완료했으나, 내부 로직 문제로 렌더링 시 시간이 오래 걸려 배포 단계에서 자꾸 걸립니다.

Navbar의 <, > 버튼을 통해 이동할 수 있습니다. ‘오늘' 버튼을 통해 오늘 날짜에 해당하는 view로 돌아갈 수 있습니다.

### Making Schedules

Navbar에 있는 + 버튼을 클릭하거나, 날짜를 직접 클릭해서 새로운 schedule을 생성할 수 있습니다. Day view에서는 원하는 시간대 클릭을 통해 schedule을 만들 수 있습니다.

새로운 schedule 생성 시, 모달이 화면에 뜨며 사용자가 form의 양식에 맞춰 작성할 수 있습니다. 시간은 기본적으로 클릭한 날짜에 맞춰 자동으로 생성되나, 수정을 원하면 시간 컴포넌트를 클릭해 날짜를 조정할 수 있습니다. 내용 추가 없이도 schedule 생성은 가능합니다.

### Editing & Deleting Schedules

캘린더 상에 렌더링되어 있는 schedule을 클릭하면 schedule의 상세 내용을 확인할 수 있습니다. schedule의 편집과 삭제는 버튼 클릭을 통해 가능합니다.

---
## Slices

### 1. `schedules`

`schedules` state에는 두 가지 데이터가 저장되어 있습니다.

- **`schedulesList`** : `schedule`들의 리스트. `schedule`의 구조는 아래를 확인해주세요.
    - `schedule` 코드
        
        ```jsx
        const someSchedule = {
        	id, // Redux 내장 nanoid() 사용
        	title, // string
        	description, // string
        	time: {
        		isDetailSet, // default = false.
        		startTime, // date
        		endTime,   // date
        	}, // isDetailSet = false면 startTime = X월 XX일 하루종일, endTime = null
        		 // isDetailSet = true면 유저가 설정 가능.
        	repeat: {
        		isRepeat, // default = false
        		period,   // isRepeat = true면 주기 설정 가능. 
        	}
        }
        ```
        
- **`dateMap`** : Map처럼 활용 가능한 오브젝트입니다. 해당 일에 렌더링해야하는 `schedule`들의 id를 저장합니다. 구조는 토글을 열어 확인해 주세요.
    - `dateMap` 코드
        
        ```jsx
        const dateMap = {
        	"YYYY-MM" : {
        		"DD" : [id1, id2, ...],
        		...
        	},
        	...
        }
        ```
        

`schedulesSlice`에는 총 세 가지 action이 가능합니다.

1. **`scheduleAdded`** : 클라이언트로부터 `title, startDate, endDate, description`을 받아서, `nanoid()`를 통해 고유의 id를 부여한 뒤 `schedules` state를 업데이트합니다. 업데이트하는 과정은 1) `schedulesList`에 `schedule` 오브젝트를 푸시한 뒤, 2) 반복문을 통해 `dateMap`에 렌더링해야하는 날짜에 id를 푸시합니다.
2. **`scheduleDeleted`** : 클라이언트로부터 지우고자 하는 id를 받습니다. id를 통해, `schedulesList`에 있는 해당하는 `schedule`을 찾고 이를 `null`로 바꿉니다.
3. **`scheduleEdited`** : 클라이언트로부터 편집하고자 하는 `id, title, startDate, endDate, description`을 받습니다. 기존 id에 해당하는 `schedule`을 마찬가지로 `null`로 바꾸고, 새로운 `schedule` 오브젝트를 푸시합니다. 이후 `scheduleAdded`와 동일합니다.

### 2. `currentMonth`

`currentMonth` state에는, 현재 렌더링하고자 하는 달력의 연도와 월을 저장합니다. 총 세 가지의 action이 있습니다.

1. **`prevMonth`** : 이전 달로 이동하기 위해 state을 업데이트합니다.
2. **`nextMonth`** : 다음 달로 이동하기 위해 state을 업데이트합니다.
3. **`todayMonth`** : Navbar에서 ‘오늘' 버튼을 클릭할 때만 일어나는 action으로, 오늘에 해당하는 달로 이동하기 위해 state을 업데이트합니다.
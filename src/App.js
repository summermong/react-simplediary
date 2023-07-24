import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const dummyList = [
  {
    id: 1,
    author: "황윤",
    content: "안녕하쇼",
    emotion: 5,
    created_date: new Date().getTime(),
    // ms로 시간을 변형하기
  },
  {
    id: 2,
    author: "유영석",
    content: "윤이짱!",
    emotion: 3,
    created_date: new Date().getTime(),
  },
];

function App() {
  return (
    <div className="App">
      <DiaryEditor />
      <DiaryList diaryList={dummyList} />
    </div>
  );
}

export default App;

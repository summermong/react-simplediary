import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import { useState } from "react";
import { useRef } from "react";

// const dummyList = [
//   {
//     id: 1,
//     author: "황윤",
//     content: "안녕하쇼",
//     emotion: 5,
//     created_date: new Date().getTime(),
//     // ms로 시간을 변형하기
//   },
//   {
//     id: 2,
//     author: "유영석",
//     content: "윤이짱!",
//     emotion: 3,
//     created_date: new Date().getTime(),
//   },
// ];

function App() {
  const [data, setData] = useState([]);
  const dataId = useRef(0); // 0부터 시작하게

  const onCreate = ({ author, content, emotion }) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]); // newItem을 최상단에 올림
  };

  const onDelete = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  };

  // onCreate로 setData에 데이터 추가
  // diaryList에서 수정된 데이터 초기값을 받아옴
  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} onDelete={onDelete} />
    </div>
  );
}

export default App;

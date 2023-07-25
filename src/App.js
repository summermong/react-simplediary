import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

// https://jsonplaceholder.typicode.com/comments

function App() {
  const [data, setData] = useState([]);
  const dataId = useRef(1); // 1부터 시작하게

  const getData = async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments`
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback(({ author, content, emotion }) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData((data) => [newItem, ...data]); // 함수형 업데이트
  }, []);

  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  };

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRation = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRation };
  }, [data.length]);

  // 구조 분해 할당으로 다시 받기
  const { goodCount, badCount, goodRation } = getDiaryAnalysis;

  // onCreate로 setData에 데이터 추가
  // diaryList에서 수정된 데이터 초기값을 받아옴
  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div> 전체 일기: {data.length} </div>
      <div> 기분 좋은 일기 개수: {goodCount} </div>
      <div> 기분 나쁜 일기 개수: {badCount} </div>
      <div> 기분 좋은 일기 비율: {goodRation} </div>
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
}

export default App;

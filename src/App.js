import { act } from "react-dom/test-utils";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import { useEffect, useRef, useMemo, useCallback, useReducer } from "react";

// reducer 함수는 컴포넌트 밖으로 꺼내주기

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data; // 이 값으로 새로운 state가 된다.
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        // action.data는 밑에서 dispatch에 담은 것들
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.content } : it
      );
    }
    default:
      return state; // 저 경우에 해당 안되면 state 변화 없게
  }
};

const App = () => {
  // const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer, []);
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
    dispatch({ type: "INIT", data: initData });
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback(({ author, content, emotion }) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    dataId.current += 1;
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
  }, []);

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
};

export default App;

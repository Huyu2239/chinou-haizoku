import { useState, useEffect } from "react";
import Cookies from "js-cookie";


type teacherResultType = [number, number];


type groupResultType = {
  [key: string]: teacherResultType;
}

type courseResultType = {
  [key: string]: groupResultType;
}

type resultType = {
  [key: string]: courseResultType;
}

const TeacherResult = ({ teacherResult } : { teacherResult: teacherResultType }) => {
  return (
    <div>
      {teacherResult[0]}/{teacherResult[1]}
    </div>
  );
}

const GroupResult = ({ groupResult }: { groupResult: groupResultType }) => {
  return (
    <div>
        {Object.keys(groupResult).map((key) => {
          return <div key={key}>{key}<TeacherResult teacherResult={groupResult[key]} /></div>;
        })}
    </div>
  );
}

const CourseResult = ({ courseResult }: { courseResult: courseResultType }) => {
  return (
    <div>
        {Object.keys(courseResult).map((key) => {
          return <div key={key}>{key}<GroupResult groupResult={courseResult[key]} /></div>;
        })}
    </div>
  );
}


const ResultPage = () => {
  const [resultData, setResultData] = useState<resultType>({});

  useEffect(() => {
    const getResultData = async () => {
      const userToken = Cookies.get("user_token");
      if (!userToken) {
        console.log("User is not logged in.");
        return;
      };
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "result", {
        headers: {
          "User-Token": userToken,
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        console.error("Failed to get result data:", data);
        return;
      }
      if (!data.counts) {
        console.error("Result data does not contain contents:", data);
        return;
      }
      setResultData(data.counts);
    };
    getResultData();
  }, []);


  if (Object.keys(resultData).length > 0) {
    return (
      <div>
        {Object.keys(resultData).map((key) => {
          return <div key={key}>{key}<CourseResult courseResult={resultData[key]} /></div>;
        })}
      </div>
  );
  } else {
    return <div>ページをリロードして下さい</div>;
  }
}

export default ResultPage;

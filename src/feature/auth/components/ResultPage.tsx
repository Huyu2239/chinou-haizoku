import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// コース名とグループ名の日本語マッピング
const courseNameMapping: { [key: string]: string } = {
  data_kagaku: "データ科学講座",
  human: "人間情報学講座",
  social: "社会情報学講座",
};

const groupNameMapping: { [key: string]: string } = {
  data_kougaku: "データ工学グループ",
  chinou_suuri: "知能数理グループ",
  kikai_gakusyuu: "機械学習グループ",
  keisan_chinou: "計算知能グループ",
  gakusyuu_kougaku: "学習工学グループ",
  syakai_jouhougaku: "社会情報学グループ",
  gengo_onsei: "言語音声メディア工学グループ",
  pattern_ninsiki: "パターン認識グループ",
  gazou_cg: "画像メディア工学・CGグループ",
};

type teacherResultType = [number, number];

type groupResultType = {
  [key: string]: teacherResultType;
};

type courseResultType = {
  [key: string]: groupResultType;
};

type resultType = {
  [key: string]: courseResultType;
};

// 各教員の結果を表示するコンポーネント（詳細表示用）
const TeacherResult = ({ teacherResult }: { teacherResult: teacherResultType }) => {
  const data = [
    { name: "第一志望", count: teacherResult[0] },
    { name: "第一〜第三志望", count: teacherResult[1] },
  ];

  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="第一志望" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// グループ内の各教員の結果を表示（詳細表示用）
const GroupResult = ({ groupResult }: { groupResult: groupResultType }) => {
  return (
    <div>
      {Object.keys(groupResult).map((teacher) => (
        <div key={teacher} style={{ marginBottom: "30px" }}>
          <h4>{teacher}</h4>
          <TeacherResult teacherResult={groupResult[teacher]} />
        </div>
      ))}
    </div>
  );
};

// コース内のグループ間の比較用に、各グループの集計結果を表示するコンポーネント
const CourseResult = ({ courseResult }: { courseResult: courseResultType }) => {
  // 各グループの教員結果を集計
  const aggregatedData = Object.keys(courseResult).map((groupKey) => {
    const group = courseResult[groupKey];
    let sumFirst = 0;
    let sumTop3 = 0;
    Object.values(group).forEach(([first, top3]) => {
      sumFirst += first;
      sumTop3 += top3;
    });
    return { 
      group: groupNameMapping[groupKey] || groupKey, 
      first: sumFirst, 
      top3: sumTop3 
    };
  });

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={aggregatedData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <XAxis dataKey="group" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="first" fill="#8884d8" name="第一志望" />
          <Bar dataKey="top3" fill="#8884d0" name="第一〜第三志望" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: "wrap" }}>
        {Object.keys(courseResult).map((group) => (
          <div key={group} style={{ minWidth: '300px' }}>
            <h3>{groupNameMapping[group] || group}</h3>
            <GroupResult groupResult={courseResult[group]} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultPage = () => {
  const [resultData, setResultData] = useState<resultType>({});
  const [surveyUrl, setSurveyUrl] = useState<string>("");

  useEffect(() => {
    const getResultData = async () => {
      const userToken = Cookies.get("user_token");
      if (!userToken) {
        console.log("User is not logged in.");
        return;
      }
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
    const getSurveyUrl = async () => {
      const userToken = Cookies.get("user_token");
      if (!userToken) {
        console.log("User is not logged in.");
        return;
      }
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "survey", {
        headers: {
          "User-Token": userToken,
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        console.error("Failed to get survey URL:", data);
        return;
      }
      if (!data.url) {
        console.error("Survey URL does not contain contents:", data);
        return;
      }
      setSurveyUrl(data.url);
    };
    getSurveyUrl();
  }, []);

  if (Object.keys(resultData).length > 0) {
    return (
      <div>
        <h1>志望教員アンケート</h1>
        <div>
          <a href={surveyUrl} target="_blank" rel="noreferrer">アンケート回答はこちら</a>
        </div>
        {Object.keys(resultData).map((course) => (
          <div key={course}>
            <h2>{courseNameMapping[course] || course}</h2>
            {/* コース内のグループごとの詳細結果も表示する場合は下記のGroupResult呼び出しを追加 */}
            {/* <CourseResultDetail courseResult={resultData[course]} /> */}
            <CourseResult courseResult={resultData[course]} />
          </div>
        ))}
      </div>
    );
  } else {
    return <div>
      { surveyUrl ? <a href={surveyUrl} target="_blank" rel="noreferrer">アンケート回答はこちら</a> : "Loading..." }
    </div>;
  }
};

export default ResultPage;

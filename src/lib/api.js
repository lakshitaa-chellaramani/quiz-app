import axios from "axios";

const fetchQuizData = async () => {
  try {
    const response = await axios.get("https://api.jsonserve.com/Uw5CrX", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return null;
  }
};
export { fetchQuizData };
